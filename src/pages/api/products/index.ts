import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAuth } from '@/lib/auth';
import { db as supabaseAdmin } from '@/lib/supabaseAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await requireAuth(req, res);
  if (!user) return;

  if (req.method === 'GET') {
    const { status, search } = req.query;

    let q = supabaseAdmin
      .from('products')
      .select('*')
      .eq('user_id', user.id)
      .order('sales', { ascending: false });

    if (status && status !== 'all') {
      q = q.eq('status', status);
    }

    if (search && typeof search === 'string') {
      q = q.or(`name.ilike.%${search}%,asin.ilike.%${search}%`);
    }

    const { data, error } = await q;
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ products: data });
  }

  if (req.method === 'POST') {
    const { asin, name, brand, image, status: prodStatus, sales, spend, profit, acos, tacos, units, clicks, impressions, orders } = req.body;

    if (!asin || !name) {
      return res.status(400).json({ error: 'asin and name are required' });
    }

    const { data, error } = await supabaseAdmin
      .from('products')
      .upsert({
        user_id: user.id,
        asin,
        name,
        brand: brand ?? null,
        image: image ?? null,
        status: prodStatus ?? 'active',
        sales: sales ?? 0,
        spend: spend ?? 0,
        profit: profit ?? 0,
        acos: acos ?? 0,
        tacos: tacos ?? 0,
        units: units ?? 0,
        clicks: clicks ?? 0,
        impressions: impressions ?? 0,
        orders: orders ?? 0,
      }, { onConflict: 'user_id,asin' })
      .select('*')
      .single();

    if (error) return res.status(400).json({ error: error.message });
    return res.status(201).json({ product: data });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
