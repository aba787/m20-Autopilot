import { useState, useMemo } from 'react';
import { kpiData, salesChartMonthly, salesChartTwoWeeks, campaignBreakdown, products, alerts } from '@/data/mock';
import { TrendingUp, TrendingDown, ShoppingCart, DollarSign, MousePointerClick, Package, BarChart3, AlertTriangle, Zap, Percent, Wallet, Calendar, LineChart as LineChartIcon, BarChart as BarChartIcon, Pencil, Check, X } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar,
} from 'recharts';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';

const CARD = { background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '0.875rem', boxShadow: 'var(--card-shadow)' } as const;
const CUR = 'SAR';

type DateFilter = 'today' | '7days' | '30days' | 'custom';
type ChartType = 'line' | 'bar';

const metricColors: Record<string, { bg: string; text: string; border: string }> = {
  sales:    { bg: 'rgba(16,185,129,0.10)', text: '#10b981', border: 'rgba(16,185,129,0.3)' },
  orders:   { bg: 'rgba(59,130,246,0.10)', text: '#3b82f6', border: 'rgba(59,130,246,0.3)' },
  cost:     { bg: 'rgba(239,68,68,0.10)',  text: '#ef4444', border: 'rgba(239,68,68,0.3)' },
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

export default function Dashboard() {
  const { t, lang } = useI18n();
  const [dateFilter, setDateFilter] = useState<DateFilter>('30days');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');
  const [chartType, setChartType] = useState<ChartType>('line');
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const [budgetValue, setBudgetValue] = useState(kpiData.dailyBudget);
  const [budgetError, setBudgetError] = useState('');

  const saveBudget = () => {
    const num = parseFloat(editValue.replace(/[^\d.]/g, ''));
    if (isNaN(num) || num < 10) {
      setBudgetError(lang === 'ar' ? 'الحد الأدنى 10 ريال' : 'Minimum budget is 10 SAR');
      return;
    }
    setBudgetValue(num);
    setBudgetError('');
    setEditingIdx(null);
  };

  const cancelEdit = () => {
    setBudgetError('');
    setEditingIdx(null);
  };

  const chartData = useMemo(() => {
    switch (dateFilter) {
      case 'today': return salesChartTwoWeeks.slice(-1);
      case '7days': return salesChartTwoWeeks.slice(-7);
      case '30days': return salesChartMonthly;
      case 'custom': return salesChartMonthly;
      default: return salesChartMonthly;
    }
  }, [dateFilter]);

  const kpiScale = useMemo(() => {
    if (dateFilter === 'today') return 1 / 30;
    if (dateFilter === '7days') return 7 / 30;
    return 1;
  }, [dateFilter]);

  const scaledKpi = useMemo(() => ({
    sales: Math.round(kpiData.sales * kpiScale),
    orders: Math.round(kpiData.orders * kpiScale),
    cost: Math.round(kpiData.cost * kpiScale),
    clicks: Math.round(kpiData.clicks * kpiScale),
    profit: Math.round(kpiData.profit * kpiScale),
    spend: Math.round(kpiData.spend * kpiScale),
    unitsSold: Math.round(kpiData.unitsSold * kpiScale),
    acos: kpiData.acos,
    tacos: kpiData.tacos,
    dailyBudget: budgetValue,
  }), [kpiScale, budgetValue]);

  const kpis = [
    { label: t('dash.sales'),       value: scaledKpi.sales.toLocaleString() + ' ' + CUR,  icon: TrendingUp,       change: '+28%',  up: true,  colorKey: 'sales' },
    { label: t('dash.orders'),      value: scaledKpi.orders.toLocaleString(),               icon: ShoppingCart,     change: '+12%',  up: true,  colorKey: 'orders' },
    { label: t('dash.cost'),        value: scaledKpi.cost.toLocaleString() + ' ' + CUR,    icon: DollarSign,       change: '+8%',   up: false, colorKey: 'cost' },
    { label: t('dash.acos'),        value: scaledKpi.acos + '%',                            icon: BarChart3,        change: '-2.1%', up: false, colorKey: 'acos' },
    { label: t('dash.clicks'),      value: scaledKpi.clicks.toLocaleString(),               icon: MousePointerClick,change: '+15%',  up: true,  colorKey: 'clicks' },
    { label: t('dash.profit'),      value: scaledKpi.profit.toLocaleString() + ' ' + CUR,  icon: TrendingUp,       change: '+34%',  up: true,  colorKey: 'profit' },
    { label: t('dash.adSpend'),     value: scaledKpi.spend.toLocaleString() + ' ' + CUR,   icon: DollarSign,       change: '+8%',   up: false, colorKey: 'adSpend' },
    { label: t('dash.unitsSold'),   value: scaledKpi.unitsSold.toLocaleString(),            icon: Package,          change: '+19%',  up: true,  colorKey: 'units' },
    { label: t('dash.tacos'),       value: scaledKpi.tacos + '%',                           icon: Percent,          change: '-1.5%', up: false, colorKey: 'tacos' },
    { label: t('dash.dailyBudget'), value: scaledKpi.dailyBudget + ' ' + CUR,             icon: Wallet,           change: '',      up: true,  colorKey: 'budget', highlight: scaledKpi.dailyBudget < 40, editable: true },
  ];

  const showBudgetWarning = budgetValue < 40;

  return (
    <div className="space-y-6">

      {showBudgetWarning && (
        <div className="p-4 rounded-xl flex items-start gap-3"
          style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.3)' }}>
          <AlertTriangle className="w-6 h-6 flex-shrink-0 mt-0.5" style={{ color: 'var(--warning)' }} />
          <p className="text-sm font-medium" style={{ color: 'var(--warning)' }}>
            {t('budget.lowWarning')}
          </p>
        </div>
      )}

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{t('dash.title')}</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{t('dash.welcome')}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg overflow-hidden text-sm"
            style={{ border: '1px solid var(--accent-border)' }}>
            {([
              { key: 'today' as DateFilter, label: t('dash.today') },
              { key: '7days' as DateFilter, label: t('dash.last7Days') },
              { key: '30days' as DateFilter, label: t('dash.last30Days') },
              { key: 'custom' as DateFilter, label: t('dash.custom') },
            ]).map(f => (
              <button key={f.key} onClick={() => setDateFilter(f.key)}
                className="px-3 py-1.5 font-medium transition-all text-sm"
                style={dateFilter === f.key
                  ? { background: 'var(--accent-bg-strong)', color: 'var(--accent)' }
                  : { color: 'var(--text-muted)' }}>
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {dateFilter === 'custom' && (
        <div className="flex items-center gap-3 p-3 rounded-xl" style={CARD}>
          <Calendar className="w-5 h-5" style={{ color: 'var(--accent)' }} />
          <input type="date" value={customFrom} onChange={e => setCustomFrom(e.target.value)}
            className="rounded-lg px-3 py-1.5 text-sm outline-none"
            style={{ background: 'var(--input-bg)', border: '1px solid var(--input-border)', color: 'var(--text-primary)' }} />
          <span className="text-sm" style={{ color: 'var(--text-muted)' }}>→</span>
          <input type="date" value={customTo} onChange={e => setCustomTo(e.target.value)}
            className="rounded-lg px-3 py-1.5 text-sm outline-none"
            style={{ background: 'var(--input-bg)', border: '1px solid var(--input-border)', color: 'var(--text-primary)' }} />
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {kpis.map((k, i) => {
          const Icon = k.icon;
          const mc = metricColors[k.colorKey];
          const isEditing = editingIdx === i;
          return (
            <div key={i} className="p-4 transition-all duration-200 group relative"
              style={{
                ...CARD,
                borderColor: mc.border,
                ...(k.highlight ? { border: `1px solid rgba(245,158,11,0.4)`, background: 'rgba(245,158,11,0.06)' } : {}),
              }}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: mc.bg }}>
                    <Icon className="w-4.5 h-4.5" style={{ color: mc.text }} />
                  </div>
                  <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>{k.label}</span>
                </div>
                {k.change && (
                  <span className="text-xs font-semibold flex items-center gap-0.5"
                    style={{ color: k.up ? '#10b981' : '#ef4444' }}>
                    {k.up ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                    {k.change}
                  </span>
                )}
              </div>
              {k.editable && isEditing ? (
                <div>
                  <div className="flex items-center gap-1">
                    <input type="number" min="10" step="1" value={editValue} onChange={e => { setEditValue(e.target.value); setBudgetError(''); }}
                      className="text-xl font-bold w-full rounded px-2 py-0.5 outline-none"
                      style={{ background: 'var(--input-bg)', border: `1px solid ${budgetError ? '#ef4444' : 'var(--accent-border)'}`, color: 'var(--text-primary)' }}
                      autoFocus onKeyDown={e => { if (e.key === 'Enter') saveBudget(); if (e.key === 'Escape') cancelEdit(); }} />
                    <button onClick={saveBudget} className="p-1 rounded hover:bg-emerald-500/20 transition-colors" style={{ color: '#10b981' }} title="Save"><Check className="w-4 h-4" /></button>
                    <button onClick={cancelEdit} className="p-1 rounded hover:bg-red-500/20 transition-colors" style={{ color: '#ef4444' }} title="Cancel"><X className="w-4 h-4" /></button>
                  </div>
                  {budgetError && <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{budgetError}</p>}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{k.value}</p>
                  {k.editable && (
                    <button onClick={() => { setEditingIdx(i); setEditValue(String(budgetValue)); setBudgetError(''); }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-white/10"
                      style={{ color: 'var(--text-dim)' }}
                      title={lang === 'ar' ? 'تعديل الميزانية' : 'Edit budget'}>
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}
              <div className="absolute top-2 left-2 w-1.5 h-6 rounded-full" style={{ background: mc.text }} />
            </div>
          );
        })}
      </div>

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
              <Line type="monotone" dataKey="sales" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4, fill: '#10b981', strokeWidth: 0 }} activeDot={{ r: 7, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }} name={t('dash.sales')} />
              <Line type="monotone" dataKey="spend" stroke="var(--accent)" strokeWidth={2.5} dot={{ r: 4, fill: 'var(--accent)', strokeWidth: 0 }} activeDot={{ r: 7, fill: 'var(--accent)', stroke: '#fff', strokeWidth: 2 }} name={t('dash.spend')} strokeDasharray="4 2" />
            </LineChart>
          ) : (
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
              <XAxis dataKey="date" tick={{ fontSize: 13, fill: 'var(--text-muted)', fontWeight: 500 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 13, fill: 'var(--text-muted)', fontWeight: 500 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="sales" fill="#10b981" radius={[4, 4, 0, 0]} name={t('dash.sales')} />
              <Bar dataKey="spend" fill="var(--accent)" radius={[4, 4, 0, 0]} name={t('dash.spend')} />
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

      <div className="p-6" style={CARD}>
        <h3 className="font-bold text-lg mb-4" style={{ color: 'var(--text-primary)' }}>{t('dash.campaignMix')}</h3>
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-full md:w-1/2">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={campaignBreakdown} cx="50%" cy="50%" innerRadius={65} outerRadius={100} dataKey="value" nameKey="name">
                  {campaignBreakdown.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--accent-border)', borderRadius: 12, color: 'var(--text-primary)', fontSize: 14 }}
                  formatter={(v: number) => [v + '%']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-full md:w-1/2 space-y-2">
            {campaignBreakdown.map((c, i) => (
              <div key={i} className="flex items-center justify-between text-sm p-2.5 rounded-lg" style={{ background: 'var(--input-bg)' }}>
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded-sm" style={{ background: c.fill }} />
                  <span style={{ color: 'var(--text-muted)' }}>{c.name}</span>
                </div>
                <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="p-5" style={CARD}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-lg flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <AlertTriangle className="w-5 h-5 text-amber-400" /> {t('dash.alerts')}
            </h3>
            <Link href="/alerts" className="text-sm transition-colors font-medium" style={{ color: 'var(--accent)' }}>{t('dash.viewAll')}</Link>
          </div>
          <div className="space-y-1">
            {alerts.slice(0, 4).map(a => (
              <div key={a.id} className="flex items-start gap-2.5 py-2.5" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <div className="w-3 h-3 rounded-full mt-1.5 flex-shrink-0"
                  style={{ background: a.severity === 'critical' ? '#ef4444' : a.severity === 'warning' ? '#f59e0b' : '#10b981' }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold leading-snug" style={{ color: 'var(--text-primary)' }}>{a.title}</p>
                  <p className="text-sm truncate mt-0.5" style={{ color: 'var(--text-muted)' }}>{a.message}</p>
                </div>
                <span className="text-xs flex-shrink-0" style={{ color: 'var(--text-dim)' }}>{a.time}</span>
              </div>
            ))}
          </div>
        </div>

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
                  {[t('dash.product'), t('dash.sales'), t('dash.spend'), t('dash.acos'), 'TACoS', t('dash.profit')].map(h => (
                    <th key={h} className="text-left pb-2.5 font-semibold" style={{ color: 'var(--text-muted)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.slice(0, 5).map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td className="py-2.5">
                      <div className="flex items-center gap-2">
                        <img src={p.image} alt={p.name} className="w-9 h-9 rounded-lg object-cover flex-shrink-0"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                        <p className="font-medium text-sm" style={{ color: 'var(--text-primary)', maxWidth: '140px', lineHeight: '1.3' }}>
                          {p.name}
                        </p>
                      </div>
                    </td>
                    <td className="py-2.5 font-semibold" style={{ color: 'var(--success)' }}>{(p.sales / 1000).toFixed(0)}K {CUR}</td>
                    <td className="py-2.5" style={{ color: 'var(--text-muted)' }}>{(p.spend / 1000).toFixed(0)}K {CUR}</td>
                    <td className="py-2.5">
                      <span style={{ color: p.acos <= 25 ? '#10b981' : p.acos <= 35 ? '#f59e0b' : '#ef4444' }}>{p.acos}%</span>
                    </td>
                    <td className="py-2.5">
                      <span style={{ color: p.tacos <= 20 ? '#10b981' : p.tacos <= 30 ? '#f59e0b' : '#ef4444' }}>{p.tacos}%</span>
                    </td>
                    <td className="py-2.5 font-semibold" style={{ color: p.profit > 0 ? '#10b981' : '#ef4444' }}>
                      {(p.profit / 1000).toFixed(0)}K {CUR}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
