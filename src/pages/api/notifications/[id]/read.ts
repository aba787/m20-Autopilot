import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAuth } from '@/lib/auth';
import { db as supabaseAdmin } from '@/lib/supabaseAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const user = await requireAuth(req, res);
  if (!user) return;

  const { id } = req.query as { id: string };

  if (id === 'all') {
    await supabaseAdmin.from('notifications').update({ read: true }).eq('user_id', user.id).eq('read', false);
  } else {
    await supabaseAdmin.from('notifications').update({ read: true }).eq('id', id).eq('user_id', user.id);
  }

  return res.status(200).json({ ok: true });
}
