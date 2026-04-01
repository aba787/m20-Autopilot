import type { NextApiRequest, NextApiResponse } from 'next';
import { db as supabaseAdmin } from '@/lib/supabaseAdmin';
import { logAction, createNotification } from '@/lib/auth';

export const config = { maxDuration: 60 };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const secret = req.headers['x-job-secret'];
  if (secret !== process.env.SESSION_SECRET) return res.status(403).json({ error: 'Forbidden' });

  const { user_id } = req.body as { user_id?: string };

  const { data: jobRow } = await supabaseAdmin.from('job_runs').insert({
    job_name: 'optimize-keywords',
    user_id: user_id ?? null,
    status: 'running',
    started_at: new Date().toISOString(),
    records_processed: 0,
  }).select('id').single();
  const jobId = jobRow?.id;

  try {
    let q = supabaseAdmin
      .from('keywords')
      .select('*, profiles!inner(*)')
      .eq('status', 'Active');

    if (user_id) q = q.eq('user_id', user_id);

    const { data: keywords, error } = await q;
    if (error) throw new Error(error.message);

    const processed: Record<string, unknown>[] = [];

    for (const kw of keywords ?? []) {
      const profile   = (kw as any).profiles;
      const automationEnabled = profile?.automation_enabled ?? false;

      if (!automationEnabled) {
        processed.push({ keyword_id: kw.id, action: 'skipped', reason: 'automation_disabled' });
        continue;
      }

      const botMode    = profile?.bot_mode   ?? 'safe';
      const targetAcos = profile?.target_acos ?? 30;

      const acos   = kw.sales > 0 ? (kw.spend / kw.sales) * 100 : 0;
      const hasData = kw.clicks >= 10;

      let action = 'keep';
      let reason = '';
      let type: 'info' | 'warning' | 'error' | 'success' = 'info';

      if (hasData && acos > targetAcos * 2) {
        action = 'lower_bid';
        reason = `ACOS ${acos.toFixed(1)}% is very high — lower bid by 20%`;
        type   = 'warning';
      } else if (hasData && acos < targetAcos * 0.6 && kw.sales > 0) {
        action = 'raise_bid';
        reason = `ACOS ${acos.toFixed(1)}% is excellent — raise bid by 15%`;
        type   = 'success';
      } else if (kw.impressions > 500 && kw.clicks === 0) {
        action = 'add_negative';
        reason = `Zero clicks from ${kw.impressions} impressions — consider adding as negative`;
        type   = 'warning';
      }

      if (action !== 'keep') {
        await logAction({
          user_id:    kw.user_id,
          keyword_id: kw.id,
          action_type: action,
          actor:  'ai',
          mode:   botMode,
          status: botMode === 'auto' ? 'executed' : 'pending',
          payload: { keyword: kw.keyword, match_type: kw.match_type, bid: kw.bid, acos, reason },
        });

        await createNotification({
          user_id: kw.user_id,
          title: `Keyword: "${kw.keyword}"`,
          body:  reason,
          type,
          link: '/products',
        });

        processed.push({ keyword_id: kw.id, action, acos });
      }
    }

    if (jobId) {
      await supabaseAdmin.from('job_runs').update({
        status: 'completed',
        finished_at: new Date().toISOString(),
        records_processed: processed.length,
      }).eq('id', jobId);
    }

    return res.status(200).json({ processed: processed.length, results: processed });
  } catch (e: any) {
    if (jobId) {
      await supabaseAdmin.from('job_runs').update({
        status: 'failed',
        finished_at: new Date().toISOString(),
        error: e.message,
      }).eq('id', jobId);
    }
    return res.status(500).json({ error: e.message });
  }
}
