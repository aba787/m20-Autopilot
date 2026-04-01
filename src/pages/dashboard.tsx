import { useState, useMemo } from 'react';
import { kpiData, salesChartMonthly, salesChartTwoWeeks, campaignBreakdown, products, alerts } from '@/data/mock';
import { TrendingUp, TrendingDown, ShoppingCart, DollarSign, MousePointerClick, Package, BarChart3, AlertTriangle, Zap, Percent, Wallet, Calendar } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';

const CARD = { background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '0.875rem', boxShadow: 'var(--card-shadow)' } as const;
const CUR = 'SAR';

type DateFilter = 'today' | '7days' | '30days' | 'custom';

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
          <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>
            {p.name === 'sales' ? p.name : p.name}:
          </span>
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

  const chartData = useMemo(() => {
    switch (dateFilter) {
      case 'today':
        return salesChartTwoWeeks.slice(-1);
      case '7days':
        return salesChartTwoWeeks.slice(-7);
      case '30days':
        return salesChartMonthly;
      case 'custom':
        return salesChartMonthly;
      default:
        return salesChartMonthly;
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
    dailyBudget: kpiData.dailyBudget,
  }), [kpiScale]);

  const kpis = [
    { label: t('dash.sales'),      value: scaledKpi.sales.toLocaleString() + ' ' + CUR,  icon: TrendingUp,       change: '+28%',  up: true  },
    { label: t('dash.orders'),     value: scaledKpi.orders.toLocaleString(),               icon: ShoppingCart,     change: '+12%',  up: true  },
    { label: t('dash.cost'),       value: scaledKpi.cost.toLocaleString() + ' ' + CUR,    icon: DollarSign,       change: '+8%',   up: false },
    { label: t('dash.acos'),       value: scaledKpi.acos + '%',                            icon: BarChart3,        change: '-2.1%', up: false },
    { label: t('dash.clicks'),     value: scaledKpi.clicks.toLocaleString(),               icon: MousePointerClick,change: '+15%',  up: true  },
    { label: t('dash.profit'),     value: scaledKpi.profit.toLocaleString() + ' ' + CUR,  icon: TrendingUp,       change: '+34%',  up: true  },
    { label: t('dash.adSpend'),    value: scaledKpi.spend.toLocaleString() + ' ' + CUR,   icon: DollarSign,       change: '+8%',   up: false },
    { label: t('dash.unitsSold'),  value: scaledKpi.unitsSold.toLocaleString(),            icon: Package,          change: '+19%',  up: true  },
    { label: t('dash.tacos'),      value: scaledKpi.tacos + '%',                           icon: Percent,          change: '-1.5%', up: false },
    { label: t('dash.dailyBudget'), value: scaledKpi.dailyBudget + ' ' + CUR,             icon: Wallet,           change: '',      up: true, highlight: scaledKpi.dailyBudget < 40  },
  ];

  const showBudgetWarning = kpiData.dailyBudget < 40;

  return (
    <div className="space-y-5">

      {showBudgetWarning && (
        <div className="p-4 rounded-xl flex items-start gap-3"
          style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.3)' }}>
          <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--warning)' }} />
          <p className="text-sm font-medium" style={{ color: 'var(--warning)' }}>
            {t('budget.lowWarning')}
          </p>
        </div>
      )}

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">{t('dash.title')}</h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{t('dash.welcome')}</p>
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
          <Calendar className="w-4 h-4" style={{ color: 'var(--accent)' }} />
          <input type="date" value={customFrom} onChange={e => setCustomFrom(e.target.value)}
            className="rounded-lg px-3 py-1.5 text-sm outline-none text-white"
            style={{ background: 'var(--input-bg)', border: '1px solid var(--input-border)' }} />
          <span className="text-sm" style={{ color: 'var(--text-muted)' }}>→</span>
          <input type="date" value={customTo} onChange={e => setCustomTo(e.target.value)}
            className="rounded-lg px-3 py-1.5 text-sm outline-none text-white"
            style={{ background: 'var(--input-bg)', border: '1px solid var(--input-border)' }} />
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {kpis.map((k, i) => {
          const Icon = k.icon;
          return (
            <div key={i} className="p-4 transition-all duration-200"
              style={{
                ...CARD,
                ...(k.highlight ? { border: '1px solid rgba(245,158,11,0.4)', background: 'rgba(245,158,11,0.06)' } : {}),
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--accent-border)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = k.highlight ? 'rgba(245,158,11,0.4)' : 'var(--card-border)'; }}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <Icon className="w-4 h-4" style={{ color: k.highlight ? 'var(--warning)' : 'var(--accent)' }} />
                  <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>{k.label}</span>
                </div>
                {k.change && (
                  <span className="text-xs font-medium flex items-center gap-0.5"
                    style={{ color: k.up ? '#10b981' : '#ef4444' }}>
                    {k.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {k.change}
                  </span>
                )}
              </div>
              <p className="text-xl font-bold text-white">{k.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 p-5" style={CARD}>
          <h3 className="font-bold text-base mb-4 text-white">{t('dash.salesAndSpend')}</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={chartData} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
              <XAxis dataKey="date" tick={{ fontSize: 13, fill: 'var(--text-muted)', fontWeight: 500 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 13, fill: 'var(--text-muted)', fontWeight: 500 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="sales" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4, fill: '#10b981', strokeWidth: 0 }} activeDot={{ r: 7, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }} name="sales" />
              <Line type="monotone" dataKey="spend" stroke="var(--accent)" strokeWidth={2.5} dot={{ r: 4, fill: 'var(--accent)', strokeWidth: 0 }} activeDot={{ r: 7, fill: 'var(--accent)', stroke: '#fff', strokeWidth: 2 }} name="spend" strokeDasharray="4 2" />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex gap-5 mt-3">
            <span className="flex items-center gap-1.5 text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
              <div className="w-5 h-0.5 bg-[#10b981] rounded" /> {t('dash.sales')} (Sales)
            </span>
            <span className="flex items-center gap-1.5 text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
              <div className="w-5 h-0.5 rounded" style={{ background: 'var(--accent)' }} /> {t('dash.spend')} (Spend)
            </span>
          </div>
        </div>

        <div className="p-5" style={CARD}>
          <h3 className="font-bold text-base mb-4 text-white">{t('dash.campaignMix')}</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={campaignBreakdown} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" nameKey="name">
                {campaignBreakdown.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--accent-border)', borderRadius: 12, color: 'var(--text-primary)', fontSize: 14 }}
                formatter={(v: number) => [v + '%']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-1">
            {campaignBreakdown.map((c, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm" style={{ background: c.fill }} />
                  <span style={{ color: 'var(--text-muted)' }}>{c.name}</span>
                </div>
                <span className="font-bold text-white">{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="p-5" style={CARD}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-base text-white flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-400" /> {t('dash.alerts')}
            </h3>
            <Link href="/alerts" className="text-sm transition-colors font-medium" style={{ color: 'var(--accent)' }}>{t('dash.viewAll')}</Link>
          </div>
          <div className="space-y-1">
            {alerts.slice(0, 4).map(a => (
              <div key={a.id} className="flex items-start gap-2.5 py-2.5" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <div className="w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0"
                  style={{ background: a.severity === 'critical' ? '#ef4444' : a.severity === 'warning' ? '#f59e0b' : '#10b981' }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white leading-snug">{a.title}</p>
                  <p className="text-sm truncate mt-0.5" style={{ color: 'var(--text-muted)' }}>{a.message}</p>
                </div>
                <span className="text-xs flex-shrink-0" style={{ color: 'var(--text-dim)' }}>{a.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-5" style={CARD}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-base text-white flex items-center gap-1.5">
              <Zap className="w-4 h-4" style={{ color: 'var(--accent)' }} /> {t('dash.productPerformance')}
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
                        <img src={p.image} alt={p.name} className="w-8 h-8 rounded object-cover flex-shrink-0"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                        <p className="font-medium text-white text-sm" style={{ maxWidth: '140px', lineHeight: '1.3' }}>
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
