import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAdmin } from '@/lib/auth';
import { db as adminDb } from '@/lib/supabaseAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const admin = await requireAdmin(req, res);
  if (!admin) return;

  const { search, role, page = '1', limit = '20' } = req.query as Record<string, string>;
  const parsedPage = parseInt(page);
  const parsedLimit = parseInt(limit);
  const pageNum = Number.isFinite(parsedPage) ? Math.max(1, parsedPage) : 1;
  const limitNum = Number.isFinite(parsedLimit) ? Math.min(100, Math.max(1, parsedLimit)) : 20;
  const from = (pageNum - 1) * limitNum;
  const to = from + limitNum - 1;

  let query = adminDb
    .from('profiles')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (search) {
    query = query.or(`email.ilike.%${search}%,full_name.ilike.%${search}%`);
  }
  if (role && (role === 'admin' || role === 'user')) {
    query = query.eq('role', role);
  }

  const { data: users, error, count } = await query;
  if (error) return res.status(500).json({ error: 'Failed to fetch users' });

  return res.status(200).json({ users: users ?? [], total: count ?? 0, page: pageNum, limit: limitNum });
}
