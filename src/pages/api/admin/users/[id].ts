import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAdmin } from '@/lib/auth';
import { db as adminDb } from '@/lib/supabaseAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const admin = await requireAdmin(req, res);
  if (!admin) return;

  const { id } = req.query as { id: string };

  if (req.method === 'PATCH') {
    const { role } = req.body as { role?: string };
    if (!role || (role !== 'admin' && role !== 'user')) {
      return res.status(400).json({ error: 'Invalid role. Must be "admin" or "user".' });
    }
    if (id === admin.id) {
      return res.status(400).json({ error: 'Cannot change your own role' });
    }

    const { data, error } = await adminDb
      .from('profiles')
      .update({ role })
      .eq('id', id)
      .select('id, email, full_name, role')
      .single();

    if (error || !data) return res.status(500).json({ error: 'Failed to update user' });
    return res.status(200).json({ user: data });
  }

  if (req.method === 'DELETE') {
    if (id === admin.id) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    const { error } = await adminDb.from('profiles').delete().eq('id', id);
    if (error) return res.status(500).json({ error: 'Failed to delete user' });
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
