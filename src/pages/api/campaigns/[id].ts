import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAuth, logAction } from '@/lib/auth';
import { db as supabaseAdmin } from '@/lib/supabaseAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await requireAuth(req, res);
  if (!user) return;

  const { id } = req.query as { id: string };

  if (req.method === 'GET') {
    const { data, error } = await supabaseAdmin
      .from('campaigns').select('*').eq('id', id).eq('user_id', user.id).single();
    if (error) return res.status(404).json({ error: 'Campaign not found' });
    return res.status(200).json({ campaign: data });
  }

  if (req.method === 'PATCH') {
    const body = req.body as Record<string, unknown>;
    const allowed: Record<string, unknown> = {};
    if (body.budget !== undefined) allowed.budget = body.budget;
    if (body.status !== undefined) allowed.status = body.status;
    if (Object.keys(allowed).length === 0) return res.status(400).json({ error: 'No editable fields provided. Only budget and status can be updated.' });
    const { data, error } = await supabaseAdmin
      .from('campaigns').update(allowed).eq('id', id).eq('user_id', user.id).select().single();
    if (error) return res.status(400).json({ error: error.message });

    await logAction({
      user_id: user.id, campaign_id: id,
      action_type: 'campaign_update', actor: 'user', mode: user.bot_mode,
      status: 'executed', payload: allowed,
    });

    return res.status(200).json({ campaign: data });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
