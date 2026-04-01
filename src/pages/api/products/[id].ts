import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAuth } from '@/lib/auth';
import { db as supabaseAdmin } from '@/lib/supabaseAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await requireAuth(req, res);
  if (!user) return;

  const { id } = req.query;
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Product ID required' });
  }

  if (req.method === 'GET') {
    const { data, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error || !data) return res.status(404).json({ error: 'Product not found' });
    return res.status(200).json({ product: data });
  }

  if (req.method === 'PATCH') {
    const allowed = ['name', 'brand', 'image', 'status', 'sales', 'spend', 'profit', 'acos', 'tacos', 'units', 'clicks', 'impressions', 'orders'];
    const updates: Record<string, unknown> = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    const { data, error } = await supabaseAdmin
      .from('products')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select('*')
      .single();

    if (error) return res.status(400).json({ error: error.message });
    return res.status(200).json({ product: data });
  }

  if (req.method === 'DELETE') {
    const { error } = await supabaseAdmin
      .from('products')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) return res.status(400).json({ error: error.message });
    return res.status(200).json({ deleted: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
