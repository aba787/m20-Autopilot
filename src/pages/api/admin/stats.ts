import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAdmin } from '@/lib/auth';
import { db as adminDb } from '@/lib/supabaseAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const admin = await requireAdmin(req, res);
  if (!admin) return;

  const [usersRes, adminsRes, campaignsRes, actionsRes] = await Promise.all([
    adminDb.from('profiles').select('id', { count: 'exact', head: true }),
    adminDb.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'admin'),
    adminDb.from('campaigns').select('id', { count: 'exact', head: true }),
    adminDb.from('action_logs').select('id', { count: 'exact', head: true }),
  ]);

  return res.status(200).json({
    totalUsers: usersRes.count ?? 0,
    totalAdmins: adminsRes.count ?? 0,
    totalCampaigns: campaignsRes.count ?? 0,
    totalActions: actionsRes.count ?? 0,
  });
}
