import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAuth } from '@/lib/auth';
import { db as supabaseAdmin } from '@/lib/supabaseAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await requireAuth(req, res);
  if (!user) return;

  if (req.method === 'GET') {
    const { from, to, status } = req.query as Record<string, string>;

    let q = supabaseAdmin
      .from('campaigns')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false })
      .order('sales', { ascending: false });

    if (from) q = q.gte('date', from);
    if (to)   q = q.lte('date', to);
    if (status && status !== 'all') q = q.eq('status', status);

    const { data, error } = await q.limit(200);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ campaigns: data ?? [] });
  }

  if (req.method === 'POST') {
    const body = req.body;
    const { data, error } = await supabaseAdmin
      .from('campaigns')
      .insert({ ...body, user_id: user.id })
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });
    return res.status(201).json({ campaign: data });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
