import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAuth } from '@/lib/auth';
import { db as supabaseAdmin } from '@/lib/supabaseAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await requireAuth(req, res);
  if (!user) return;

  if (req.method === 'GET') {
    const { from, to } = req.query as Record<string, string>;

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    let q = supabaseAdmin
      .from('accounting_snapshots')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });

    if (from) q = q.gte('date', from);
    else      q = q.gte('date', thirtyDaysAgo.toISOString().split('T')[0]);
    if (to)   q = q.lte('date', to);

    const { data, error } = await q.limit(90);
    if (error) return res.status(500).json({ error: error.message });

    const rows = data ?? [];

    const totals = rows.reduce((acc, r) => ({
      revenue:     acc.revenue     + r.revenue,
      ad_spend:    acc.ad_spend    + r.ad_spend,
      cogs:        acc.cogs        + r.cogs,
      gross_profit:acc.gross_profit+ r.gross_profit,
      net_profit:  acc.net_profit  + r.net_profit,
      orders:      acc.orders      + r.orders,
      units:       acc.units       + r.units,
    }), { revenue: 0, ad_spend: 0, cogs: 0, gross_profit: 0, net_profit: 0, orders: 0, units: 0 });

    const acos  = totals.revenue  > 0 ? (totals.ad_spend / totals.revenue)  * 100 : 0;
    const roas  = totals.ad_spend > 0 ?  totals.revenue  / totals.ad_spend        : 0;

    return res.status(200).json({ snapshots: rows, totals: { ...totals, acos, roas } });
  }

  if (req.method === 'POST') {
    const body = req.body;
    const { error } = await supabaseAdmin
      .from('accounting_snapshots')
      .upsert({ ...body, user_id: user.id }, { onConflict: 'user_id,date' });

    if (error) return res.status(400).json({ error: error.message });
    return res.status(201).json({ ok: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
