import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAuth } from '@/lib/auth';
import { db as supabaseAdmin } from '@/lib/supabaseAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const user = await requireAuth(req, res);
  if (!user) return;

  const { id } = req.query as { id: string };
  const { approve } = req.body as { approve: boolean };

  const newStatus = approve ? 'approved' : 'rejected';

  const { data, error } = await supabaseAdmin
    .from('action_logs')
    .update({ status: newStatus })
    .eq('id', id)
    .eq('user_id', user.id)
    .eq('status', 'pending')
    .select()
    .single();

  if (error || !data) return res.status(404).json({ error: 'Log not found or already processed' });
  return res.status(200).json({ log: data });
}
