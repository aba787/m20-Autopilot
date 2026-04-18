import { useState, useMemo, useEffect, useCallback } from 'react';
import { TrendingUp, TrendingDown, ShoppingCart, DollarSign, MousePointerClick, Package, BarChart3, AlertTriangle, Zap, Percent, Wallet, Calendar, LineChart as LineChartIcon, BarChart as BarChartIcon, Pencil, Check, X, Lightbulb, Loader2 } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar,
} from 'recharts';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { useAuth, authFetch } from '@/lib/useAuth';

const CARD = { background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '0.875rem', boxShadow: 'var(--card-shadow)' } as const;
const CUR = 'SAR';

type DateFilter = 'today' | '7days' | '30days' | 'custom';
type ChartType = 'line' | 'bar';

const metricColors: Record<string, { bg: string; text: string; border: string }> = {
  sales:    { bg: 'rgba(16,185,129,0.10)', text: '#10b981', border: 'rgba(16,185,129,0.3)' },
  orders:   { bg: 'rgba(59,130,246,0.10)', text: '#3b82f6', border: 'rgba(59,130,246,0.3)' },
  acos:     { bg: 'rgba(245,158,11,0.10)', text: '#f59e0b', border: 'rgba(245,158,11,0.3)' },
  clicks:   { bg: 'rgba(139,92,246,0.10)', text: '#8b5cf6', border: 'rgba(139,92,246,0.3)' },
  profit:   { bg: 'rgba(34,197,94,0.10)',  text: '#22c55e', border: 'rgba(34,197,94,0.3)' },
  adSpend:  { bg: 'rgba(236,72,153,0.10)', text: '#ec4899', border: 'rgba(236,72,153,0.3)' },
  units:    { bg: 'rgba(6,182,212,0.10)',  text: '#06b6d4', border: 'rgba(6,182,212,0.3)' },
  tacos:    { bg: 'rgba(249,115,22,0.10)', text: '#f97316', border: 'rgba(249,115,22,0.3)' },
  budget:   { bg: 'rgba(234,179,8,0.10)',  text: '#eab308', border: 'rgba(234,179,8,0.3)' },
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'var(--bg-secondary)',
      border: '1px solid var(--accent-border)',
      borderRadius: 12,
      padding: '12px 16px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
    }}>
      <p style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: 14, marginBottom: 8 }}>{label}</p>
      {payload.map((p: any, i: number) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: p.color }} />
          <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>{p.name}:</span>
          <span style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: 15 }}>
            {p.value?.toLocaleString()} {CUR}
          </span>
        </div>
      ))}
    </div>
  );
};

interface DashData {
  kpis: Record<string, { value: number; change?: number | null }>;
  chart: { date: string; revenue: number; ad_spend: number; profit: number }[];
  budget_warning: boolean;
  pending_actions: any[];
}

interface Product {
  id: number;
  name: string;
  sales: number;
  spend: number;
  acos: number;
  tacos: number;
  profit: number;
  image?: string;
  units?: number;
}

export default function Dashboard() {
  const { t, lang } = useI18n();
  const { token, user } = useAuth();
  const af = authFetch(token);
  const [dateFilter, setDateFilter] = useState<DateFilter>('30days');
  const [chartType, setChartType] = useState<ChartType>('line');
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const [budgetError, setBudgetError] = useState('');
  const [dashData, setDashData] = useState<DashData | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [pageLoading, setPageLoading] = useState(true);

  const fetchDash = useCallback(async () => {
    try {
      const [statsRes, prodsRes] = await Promise.all([
        af('/api/dashboard/stats'),
        af('/api/products'),
      ]);
      const stats = await statsRes.json();
      const prods = await prodsRes.json();
      if (statsRes.ok) setDashData(stats);
      if (prodsRes.ok) setProducts(prods.products ?? prods ?? []);
    } catch {
    } finally {
      setPageLoading(false);
    }
  }, [token]);

  useEffect(() => { if (token) fetchDash(); else setPageLoading(false); }, [token]);

  const kpis = useMemo(() => {
    if (!dashData) return [];
    const k = dashData.kpis;
    const fmtChange = (ch: number | null | undefined) => ch != null ? `${ch > 0 ? '+' : ''}${ch}%` : '';
    return [
      { label: t('dash.sales'),       value: Math.round(k.revenue?.value ?? 0).toLocaleString() + ' ' + CUR, icon: TrendingUp,        change: fmtChange(k.revenue?.change), up: (k.revenue?.change ?? 0) >= 0, colorKey: 'sales' },
      { label: t('dash.orders'),      value: Math.round(k.orders?.value ?? 0).toLocaleString(),              icon: ShoppingCart,      change: fmtChange(k.orders?.change),  up: (k.orders?.change ?? 0) >= 0, colorKey: 'orders' },
      { label: t('dash.acos'),        value: (k.acos?.value ?? 0).toFixed(1) + '%',                         icon: BarChart3,         change: fmtChange(k.acos?.change),    up: false, colorKey: 'acos' },
      { label: t('dash.profit'),      value: Math.round(k.net_profit?.value ?? 0).toLocaleString() + ' ' + CUR, icon: TrendingUp,    change: fmtChange(k.net_profit?.change), up: (k.net_profit?.change ?? 0) >= 0, colorKey: 'profit' },
      { label: t('dash.adSpend'),     value: Math.round(k.ad_spend?.value ?? 0).toLocaleString() + ' ' + CUR, icon: DollarSign,      change: fmtChange(k.ad_spend?.change), up: false, colorKey: 'adSpend' },
      { label: t('dash.unitsSold'),   value: Math.round(k.units?.value ?? 0).toLocaleString(),               icon: Package,           change: fmtChange(k.units?.change),   up: (k.units?.change ?? 0) >= 0, colorKey: 'units' },
      { label: t('dash.dailyBudget'), value: Math.round(k.daily_budget?.value ?? 0) + ' ' + CUR,           icon: Wallet,            change: '',                            up: true, colorKey: 'budget', highlight: (k.daily_budget?.value ?? 50) < 40, editable: true },
    ];
  }, [dashData, t]);

  const chartData = useMemo(() => {
    if (!dashData?.chart) return [];
    const data = dashData.chart;
    if (dateFilter === 'today') return data.slice(-1);
    if (dateFilter === '7days') return data.slice(-7);
    return data;
  }, [dashData, dateFilter]);

  const budgetValue = dashData?.kpis?.daily_budget?.value ?? 50;
  const showBudgetWarning = dashData?.budget_warning ?? false;

  const saveBudget = async () => {
    const num = parseFloat(editValue.replace(/[^\d.]/g, ''));
    if (isNaN(num) || num < 10) {
      setBudgetError(lang === 'ar' ? 'الحد الأدنى 10 ريال' : 'Minimum budget is 10 SAR');
      return;
    }
    try {
      await af('/api/settings', { method: 'PATCH', body: JSON.stringify({ daily_budget: num }) });
      fetchDash();
    } catch {}
    setBudgetError('');
    setEditingIdx(null);
  };

  const cancelEdit = () => {
    setBudgetError('');
    setEditingIdx(null);
  };

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--accent)' }} />
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {showBudgetWarning && (
        <div className="p-4 rounded-xl flex items-start gap-3"
          style={{ background: 'rgba(0,217,255,0.06)', border: '1px solid rgba(0,217,255,0.2)' }}>
          <Lightbulb className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--accent)' }} />
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {t('budget.lowWarning')}
          </p>
        </div>
      )}

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{t('dash.title')}</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{t('dash.welcome').replace('{name}', user?.full_name || '')}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg overflow-hidden text-sm"
            style={{ border: '1px solid var(--accent-border)' }}>
            {([
              { key: 'today' as DateFilter, label: t('dash.today') },
              { key: '7days' as DateFilter, label: t('dash.last7Days') },
              { key: '30days' as DateFilter, label: t('dash.last30Days') },
            ]).map(f => (
              <button key={f.key}
                onClick={() => setDateFilter(f.key)}
                className="px-3 py-1.5 font-medium transition-colors"
                style={dateFilter === f.key
                  ? { background: 'var(--accent-bg-strong)', color: 'var(--accent)' }
                  : { color: 'var(--text-muted)' }}>
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {kpis.map((k, idx) => {
          const mc = metricColors[k.colorKey] ?? metricColors.sales;
          const editing = editingIdx === idx;
          return (
            <div key={idx} className="p-4 rounded-xl transition-all"
              style={{
                background: 'var(--card-bg)',
                border: `1px solid ${k.highlight ? mc.border : 'var(--card-border)'}`,
                borderRadius: '0.875rem', boxShadow: 'var(--card-shadow)',
              }}>
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: mc.bg }}>
                    <k.icon className="w-4 h-4" style={{ color: mc.text }} />
                  </div>
                  <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{k.label}</p>
                </span>
                {k.editable && !editing && (
                  <button onClick={() => { setEditingIdx(idx); setEditValue(String(budgetValue)); }}
                    className="p-1 rounded hover:bg-white/5" style={{ color: 'var(--text-dim)' }}>
                    <Pencil className="w-3 h-3" />
                  </button>
                )}
              </div>
              {editing ? (
                <div className="flex items-center gap-1.5">
                  <input type="text" value={editValue}
                    onChange={e => setEditValue(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') saveBudget(); if (e.key === 'Escape') cancelEdit(); }}
                    className="flex-1 text-lg font-bold rounded px-2 py-0.5 outline-none"
                    style={{ background: 'var(--input-bg)', border: '1px solid var(--accent)', color: 'var(--text-primary)', maxWidth: '80px' }}
                    autoFocus />
                  <button onClick={saveBudget} className="p-1 rounded" style={{ color: 'var(--success)' }}><Check className="w-4 h-4" /></button>
                  <button onClick={cancelEdit} className="p-1 rounded" style={{ color: 'var(--error)' }}><X className="w-4 h-4" /></button>
                  {budgetError && <p className="text-[10px]" style={{ color: 'var(--error)' }}>{budgetError}</p>}
                </div>
              ) : (
                <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{k.value}</p>
              )}
              {k.change && (
                <p className="text-xs mt-1 font-medium" style={{ color: k.up ? '#10b981' : '#ef4444' }}>
                  {k.change}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {chartData.length > 0 && (
        <div className="p-6" style={CARD}>
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>{t('dash.salesAndSpend')}</h3>
            <div className="flex items-center gap-1 rounded-lg overflow-hidden"
              style={{ border: '1px solid var(--card-border)' }}>
              <button onClick={() => setChartType('line')}
                className="p-2 transition-colors"
                style={chartType === 'line' ? { background: 'var(--accent-bg-strong)', color: 'var(--accent)' } : { color: 'var(--text-dim)' }}>
                <LineChartIcon className="w-5 h-5" />
              </button>
              <button onClick={() => setChartType('bar')}
                className="p-2 transition-colors"
                style={chartType === 'bar' ? { background: 'var(--accent-bg-strong)', color: 'var(--accent)' } : { color: 'var(--text-dim)' }}>
                <BarChartIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={380}>
            {chartType === 'line' ? (
              <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                <XAxis dataKey="date" tick={{ fontSize: 13, fill: 'var(--text-muted)', fontWeight: 500 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 13, fill: 'var(--text-muted)', fontWeight: 500 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4, fill: '#10b981', strokeWidth: 0 }} activeDot={{ r: 7, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }} name={t('dash.sales')} />
                <Line type="monotone" dataKey="ad_spend" stroke="var(--accent)" strokeWidth={2.5} dot={{ r: 4, fill: 'var(--accent)', strokeWidth: 0 }} activeDot={{ r: 7, fill: 'var(--accent)', stroke: '#fff', strokeWidth: 2 }} name={t('dash.spend')} strokeDasharray="4 2" />
              </LineChart>
            ) : (
              <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                <XAxis dataKey="date" tick={{ fontSize: 13, fill: 'var(--text-muted)', fontWeight: 500 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 13, fill: 'var(--text-muted)', fontWeight: 500 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} name={t('dash.sales')} />
                <Bar dataKey="ad_spend" fill="var(--accent)" radius={[4, 4, 0, 0]} name={t('dash.spend')} />
              </BarChart>
            )}
          </ResponsiveContainer>
          <div className="flex gap-5 mt-4">
            <span className="flex items-center gap-1.5 text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
              <div className="w-5 h-0.5 bg-[#10b981] rounded" /> {t('dash.sales')}
            </span>
            <span className="flex items-center gap-1.5 text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
              <div className="w-5 h-0.5 rounded" style={{ background: 'var(--accent)' }} /> {t('dash.spend')}
            </span>
          </div>
        </div>
      )}

      {products.length > 0 && (
        <div className="p-5" style={CARD}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-lg flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Zap className="w-5 h-5" style={{ color: 'var(--accent)' }} /> {t('dash.productPerformance')}
            </h3>
            <Link href="/products" className="text-sm transition-colors font-medium" style={{ color: 'var(--accent)' }}>{t('dash.viewAll')}</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-primary)' }}>
                  {[t('dash.product'), t('dash.sales'), t('dash.spend'), t('dash.acos'), t('dash.profit')].map(h => (
                    <th key={h} className="text-left pb-2.5 font-semibold" style={{ color: 'var(--text-muted)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.slice(0, 5).map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td className="py-2.5">
                      <p className="font-medium text-sm" style={{ color: 'var(--text-primary)', maxWidth: '180px', lineHeight: '1.3' }}>
                        {p.name}
                      </p>
                    </td>
                    <td className="py-2.5 font-semibold" style={{ color: 'var(--success)' }}>{Math.round(p.sales).toLocaleString()} {CUR}</td>
                    <td className="py-2.5" style={{ color: 'var(--text-muted)' }}>{Math.round(p.spend).toLocaleString()} {CUR}</td>
                    <td className="py-2.5">
                      <span style={{ color: p.acos <= 25 ? '#10b981' : p.acos <= 35 ? '#f59e0b' : '#ef4444' }}>{p.acos}%</span>
                    </td>
                    <td className="py-2.5 font-semibold" style={{ color: p.profit > 0 ? '#10b981' : '#ef4444' }}>
                      {Math.round(p.profit).toLocaleString()} {CUR}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!dashData?.chart?.length && products.length === 0 && (
        <div className="p-12 text-center" style={CARD}>
          <p className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{t('dash.welcome').replace('{name}', user?.full_name || '')}</p>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{t('campaigns.noCampaigns')}</p>
        </div>
      )}
    </div>
  );
}
