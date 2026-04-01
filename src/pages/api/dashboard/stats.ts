import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAuth } from '@/lib/auth';
import { db as supabaseAdmin } from '@/lib/supabaseAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const user = await requireAuth(req, res);
  if (!user) return;

  const today = new Date();
  const thirtyDaysAgo = new Date(); thirtyDaysAgo.setDate(today.getDate() - 30);
  const sixtyDaysAgo  = new Date(); sixtyDaysAgo.setDate(today.getDate() - 60);

  const fmt = (d: Date) => d.toISOString().split('T')[0];

  const [currentPeriod, previousPeriod, notifications, pendingActions, profileResult] = await Promise.all([
    supabaseAdmin.from('accounting_snapshots').select('*')
      .eq('user_id', user.id).gte('date', fmt(thirtyDaysAgo)).lte('date', fmt(today))
      .order('date', { ascending: true }),

    supabaseAdmin.from('accounting_snapshots').select('*')
      .eq('user_id', user.id).gte('date', fmt(sixtyDaysAgo)).lt('date', fmt(thirtyDaysAgo))
      .order('date', { ascending: true }),

    supabaseAdmin.from('notifications').select('id, read')
      .eq('user_id', user.id),

    supabaseAdmin.from('action_logs').select('id, action_type, status, created_at, payload')
      .eq('user_id', user.id).eq('status', 'pending').order('created_at', { ascending: false }).limit(5),

    supabaseAdmin.from('profiles').select('daily_budget, automation_enabled')
      .eq('id', user.id).single(),
  ]);

  const aggregate = (rows: any[]) => rows.reduce((acc, r) => ({
    revenue:      acc.revenue      + r.revenue,
    ad_spend:     acc.ad_spend     + r.ad_spend,
    gross_profit: acc.gross_profit + r.gross_profit,
    net_profit:   acc.net_profit   + r.net_profit,
    orders:       acc.orders       + r.orders,
    units:        acc.units        + r.units,
  }), { revenue: 0, ad_spend: 0, gross_profit: 0, net_profit: 0, orders: 0, units: 0 });

  const cur  = aggregate(currentPeriod.data  ?? []);
  const prev = aggregate(previousPeriod.data ?? []);

  const pctChange = (cur: number, prev: number) =>
    prev === 0 ? null : Number(((cur - prev) / prev * 100).toFixed(1));

  const acos = cur.revenue  > 0 ? (cur.ad_spend / cur.revenue)  * 100 : 0;
  const roas = cur.ad_spend > 0 ?  cur.revenue  / cur.ad_spend        : 0;

  const dailyBudget = Number(profileResult.data?.daily_budget ?? 50);
  const automationEnabled = !!profileResult.data?.automation_enabled;

  return res.status(200).json({
    kpis: {
      revenue:      { value: cur.revenue,      change: pctChange(cur.revenue,      prev.revenue)      },
      ad_spend:     { value: cur.ad_spend,     change: pctChange(cur.ad_spend,     prev.ad_spend)     },
      net_profit:   { value: cur.net_profit,   change: pctChange(cur.net_profit,   prev.net_profit)   },
      gross_profit: { value: cur.gross_profit, change: pctChange(cur.gross_profit, prev.gross_profit) },
      orders:       { value: cur.orders,       change: pctChange(cur.orders,       prev.orders)       },
      units:        { value: cur.units,        change: pctChange(cur.units,        prev.units)        },
      acos:         { value: acos,             change: pctChange(acos, prev.revenue > 0 ? (prev.ad_spend / prev.revenue) * 100 : 0) },
      roas:         { value: roas,             change: pctChange(roas, prev.ad_spend > 0 ? prev.revenue / prev.ad_spend : 0)       },
      daily_budget: { value: dailyBudget },
    },
    chart: (currentPeriod.data ?? []).map(r => ({
      date: r.date, revenue: r.revenue, ad_spend: r.ad_spend, profit: r.net_profit,
    })),
    unread_notifications: (notifications.data ?? []).filter(n => !n.read).length,
    pending_actions:      pendingActions.data ?? [],
    budget_warning:       dailyBudget < 40,
    automation_enabled:   automationEnabled,
  });
}
