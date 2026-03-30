import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAdmin, logAction } from '@/lib/auth';
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

    const { data: before } = await adminDb
      .from('profiles')
      .select('role')
      .eq('id', id)
      .single();

    const oldRole = before?.role ?? 'user';

    const { data, error } = await adminDb
      .from('profiles')
      .update({ role })
      .eq('id', id)
      .select('id, email, full_name, role')
      .single();

    if (error || !data) return res.status(500).json({ error: 'Failed to update user' });

    await logAction({
      user_id: admin.id,
      action_type: 'admin_role_change',
      actor: 'user',
      mode: admin.bot_mode,
      status: 'executed',
      payload: { target_user_id: id, target_email: data.email, old_role: oldRole, new_role: role },
    }).catch(err => { console.error('Failed to log admin role change:', err); });

    return res.status(200).json({ user: data });
  }

  if (req.method === 'DELETE') {
    if (id === admin.id) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    const { data: target } = await adminDb
      .from('profiles')
      .select('email, full_name, role')
      .eq('id', id)
      .single();

    const { error } = await adminDb.from('profiles').delete().eq('id', id);
    if (error) return res.status(500).json({ error: 'Failed to delete user' });

    await logAction({
      user_id: admin.id,
      action_type: 'admin_delete_user',
      actor: 'user',
      mode: admin.bot_mode,
      status: 'executed',
      payload: { target_user_id: id, target_email: target?.email, target_name: target?.full_name, target_role: target?.role },
    }).catch(err => { console.error('Failed to log admin user deletion:', err); });

    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
