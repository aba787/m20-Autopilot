import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAuth } from '@/lib/auth';
import { db as supabaseAdmin } from '@/lib/supabaseAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await requireAuth(req, res);
  if (!user) return;

  if (req.method === 'GET') {
    const { limit = '50', offset = '0', status, actor } = req.query as Record<string, string>;

    let q = supabaseAdmin
      .from('action_logs')
      .select(`*, campaigns(name)`)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(Number(offset), Number(offset) + Number(limit) - 1);

    if (status) q = q.eq('status', status);
    if (actor)  q = q.eq('actor', actor);

    const { data, error } = await q;
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ logs: data ?? [] });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
