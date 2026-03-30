import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAuth } from '@/lib/auth';
import { db as supabaseAdmin } from '@/lib/supabaseAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await requireAuth(req, res);
  if (!user) return;

  if (req.method === 'GET') {
    const { data, error } = await supabaseAdmin
      .from('profiles').select('*')
      .eq('id', user.id).single();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ profile: data });
  }

  if (req.method === 'PATCH') {
    const { full_name, bot_mode, target_acos } = req.body as {
      full_name?: string; bot_mode?: 'safe' | 'semi' | 'auto'; target_acos?: number;
    };

    const updates: Record<string, unknown> = {};
    if (full_name  !== undefined) updates.full_name  = full_name;
    if (bot_mode   !== undefined) updates.bot_mode   = bot_mode;
    if (target_acos !== undefined) updates.target_acos = target_acos;

    const { data, error } = await supabaseAdmin
      .from('profiles').update(updates).eq('id', user.id)
      .select('*').single();

    if (error) return res.status(400).json({ error: error.message });
    return res.status(200).json({ profile: data });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
