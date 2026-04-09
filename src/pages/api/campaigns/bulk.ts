import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAuth } from '@/lib/auth';
import { db as adminDb } from '@/lib/supabaseAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const auth = await requireAuth(req, res);
  if (!auth) return;

  const { action, campaign_ids, params } = req.body;

  if (!action || !campaign_ids || !Array.isArray(campaign_ids) || campaign_ids.length === 0) {
    return res.status(400).json({ error: 'action and campaign_ids are required' });
  }

  const results: { id: string; success: boolean; error?: string }[] = [];

  for (const id of campaign_ids) {
    try {
      switch (action) {
        case 'pause': {
          await adminDb.from('campaigns').update({ status: 'paused' }).eq('id', id).eq('user_id', auth.id);
          results.push({ id, success: true });
          break;
        }
        case 'enable': {
          await adminDb.from('campaigns').update({ status: 'active' }).eq('id', id).eq('user_id', auth.id);
          results.push({ id, success: true });
          break;
        }
        case 'update_budget': {
          if (!params?.budget) throw new Error('Budget parameter required');
          await adminDb.from('campaigns').update({ budget: params.budget }).eq('id', id).eq('user_id', auth.id);
          results.push({ id, success: true });
          break;
        }
        case 'increase_budget': {
          const pct = params?.percentage || 10;
          const { data: camp } = await adminDb.from('campaigns').select('budget').eq('id', id).eq('user_id', auth.id).single();
          if (camp) {
            await adminDb.from('campaigns').update({ budget: camp.budget * (1 + pct / 100) }).eq('id', id).eq('user_id', auth.id);
          }
          results.push({ id, success: true });
          break;
        }
        case 'delete': {
          await adminDb.from('campaigns').delete().eq('id', id).eq('user_id', auth.id);
          results.push({ id, success: true });
          break;
        }
        case 'decrease_budget': {
          const dpct = params?.percentage || 10;
          const { data: dcamp } = await adminDb.from('campaigns').select('budget').eq('id', id).eq('user_id', auth.id).single();
          if (dcamp) {
            await adminDb.from('campaigns').update({ budget: dcamp.budget * (1 - dpct / 100) }).eq('id', id).eq('user_id', auth.id);
          }
          results.push({ id, success: true });
          break;
        }
        default:
          results.push({ id, success: false, error: `Unknown action: ${action}` });
      }

      await adminDb.from('action_logs').insert({
        user_id: auth.id,
        campaign_id: id,
        action_type: `bulk_${action}`,
        actor: 'user',
        mode: 'auto',
        status: 'executed',
        payload: { action, params },
      });
    } catch (err: any) {
      results.push({ id, success: false, error: err.message });
    }
  }

  const succeeded = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  return res.status(200).json({
    success: true,
    summary: { total: campaign_ids.length, succeeded, failed },
    results,
  });
}
