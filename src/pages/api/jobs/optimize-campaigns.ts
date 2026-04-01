import type { NextApiRequest, NextApiResponse } from 'next';
import { db as supabaseAdmin } from '@/lib/supabaseAdmin';
import { calculateMetrics, applyRules, getAIAnalysis } from '@/lib/campaignBot';
import { logAction, createNotification } from '@/lib/auth';

export const config = { maxDuration: 60 };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const secret = req.headers['x-job-secret'];
  if (secret !== process.env.SESSION_SECRET) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const { user_id } = req.body as { user_id?: string };

  const jobStart = new Date().toISOString();
  const { data: jobRow } = await supabaseAdmin.from('job_runs').insert({
    job_name: 'optimize-campaigns',
    user_id: user_id ?? null,
    status: 'running',
    started_at: jobStart,
    records_processed: 0,
  }).select('id').single();

  const jobId = jobRow?.id;

  try {
    let campaignsQ = supabaseAdmin
      .from('campaigns')
      .select('*, profiles!inner(*)')
      .eq('status', 'Active');

    if (user_id) campaignsQ = campaignsQ.eq('user_id', user_id);

    const { data: campaigns, error: cErr } = await campaignsQ;
    if (cErr) throw new Error(cErr.message);

    const results: Record<string, unknown>[] = [];

    for (const campaign of campaigns ?? []) {
      try {
        const profile = (campaign as any).profiles;
        const automationEnabled = profile?.automation_enabled ?? false;

        if (!automationEnabled) {
          results.push({ campaign_id: campaign.id, action: 'skipped', reason: 'automation_disabled' });
          continue;
        }

        const botMode  = profile?.bot_mode  ?? 'safe';
        const targetAcos = profile?.target_acos ?? 30;

        const campaignData = {
          id: 0, name: campaign.name, spend: campaign.spend,
          sales: campaign.sales, clicks: campaign.clicks,
          impressions: campaign.impressions, orders: campaign.orders,
          acos: campaign.acos, roas: campaign.roas, ctr: campaign.ctr,
          budget: campaign.budget, status: campaign.status,
          target_acos: targetAcos,
        };

        const metrics     = calculateMetrics(campaignData);
        const ruleDecision = applyRules(metrics, campaignData);
        let aiAnalysis = '';

        if (botMode !== 'safe') {
          aiAnalysis = await getAIAnalysis(campaignData, metrics, ruleDecision);
        }

        const logStatus = botMode === 'auto' ? 'executed'
          : botMode === 'semi' ? 'pending' : 'pending';

        await logAction({
          user_id:     campaign.user_id,
          campaign_id: campaign.id,
          action_type: ruleDecision.action,
          actor:       'ai',
          mode:        botMode,
          status:      logStatus,
          payload: {
            campaign_name: campaign.name,
            rule_reason:   ruleDecision.reason,
            suggested_change: ruleDecision.suggestedChange,
            metrics: { acos: metrics.acos, roas: metrics.roas, ctr: metrics.ctr },
            ai_analysis: aiAnalysis,
          },
        });

        if (ruleDecision.priority === 'critical') {
          await createNotification({
            user_id:     campaign.user_id,
            campaign_id: campaign.id,
            title: `Critical: ${campaign.name}`,
            body:  `ACOS ${metrics.acos.toFixed(1)}% — ${ruleDecision.reason}`,
            type:  'error',
            link:  '/ai-engine',
          });
        } else if (ruleDecision.action === 'scale') {
          await createNotification({
            user_id:     campaign.user_id,
            campaign_id: campaign.id,
            title: `Scale opportunity: ${campaign.name}`,
            body:  `ACOS ${metrics.acos.toFixed(1)}% / ROAS ${metrics.roas.toFixed(1)} — ready to scale`,
            type:  'success',
            link:  '/ai-engine',
          });
        }

        results.push({ campaign_id: campaign.id, action: ruleDecision.action, priority: ruleDecision.priority });
      } catch (innerErr: any) {
        console.error(`Error processing campaign ${campaign.id}:`, innerErr.message);
      }
    }

    if (jobId) {
      await supabaseAdmin.from('job_runs').update({
        status: 'completed',
        finished_at: new Date().toISOString(),
        records_processed: results.length,
      }).eq('id', jobId);
    }

    return res.status(200).json({ processed: results.length, results });
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
