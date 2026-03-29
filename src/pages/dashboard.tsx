import { useState } from 'react';
import { kpiData, salesChartMonthly, salesChartTwoWeeks, campaignBreakdown, products, alerts } from '@/data/mock';
import { TrendingUp, TrendingDown, ShoppingCart, DollarSign, MousePointerClick, Package, BarChart3, AlertTriangle, Zap } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import Link from 'next/link';

const CYAN = '#00d9ff';

const kpis = [
  { label: 'Sales',       value: '$' + kpiData.sales.toLocaleString(),  icon: TrendingUp,       change: '+28%',  up: true  },
  { label: 'Orders',      value: kpiData.orders.toLocaleString(),         icon: ShoppingCart,     change: '+12%',  up: true  },
  { label: 'Cost',        value: '$' + kpiData.cost.toLocaleString(),    icon: DollarSign,       change: '+8%',   up: false },
  { label: 'ACOS',        value: kpiData.acos + '%',                      icon: BarChart3,        change: '-2.1%', up: false },
  { label: 'Clicks',      value: kpiData.clicks.toLocaleString(),         icon: MousePointerClick,change: '+15%',  up: true  },
  { label: 'Profit',      value: '$' + kpiData.profit.toLocaleString(),  icon: TrendingUp,       change: '+34%',  up: true  },
  { label: 'Ad Spend',    value: '$' + kpiData.spend.toLocaleString(),   icon: DollarSign,       change: '+8%',   up: false },
  { label: 'Units Sold',  value: kpiData.unitsSold.toLocaleString(),      icon: Package,          change: '+19%',  up: true  },
];

const CARD = { background: 'rgba(0,217,255,0.04)', border: '1px solid rgba(0,217,255,0.12)', borderRadius: '0.875rem' } as const;

export default function Dashboard() {
  const [period, setPeriod] = useState<'monthly' | 'twoWeeks'>('monthly');
  const chartData = period === 'monthly' ? salesChartMonthly : salesChartTwoWeeks;

  return (
    <div className="space-y-5">

      {/* ── Header ──────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Dashboard</h1>
          <p className="text-sm" style={{ color: '#8a94a6' }}>Welcome, Ahmed — Last updated: Today 14:30</p>
        </div>
        <div className="flex items-center rounded-lg overflow-hidden text-sm"
          style={{ border: '1px solid rgba(0,217,255,0.2)' }}>
          {(['monthly', 'twoWeeks'] as const).map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className="px-4 py-1.5 font-medium transition-all"
              style={period === p
                ? { background: 'rgba(0,217,255,0.15)', color: CYAN }
                : { color: '#8a94a6' }}>
              {p === 'monthly' ? 'Monthly' : '2 Weeks'}
            </button>
          ))}
        </div>
      </div>

      {/* ── KPI Cards ───────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {kpis.map((k, i) => {
          const Icon = k.icon;
          return (
            <div key={i} className="p-4 transition-all duration-200"
              style={CARD}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(0,217,255,0.3)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(0,217,255,0.12)'; }}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <Icon className="w-3.5 h-3.5" style={{ color: CYAN }} />
                  <span className="text-xs" style={{ color: '#8a94a6' }}>{k.label}</span>
                </div>
                <span className="text-xs font-medium flex items-center gap-0.5"
                  style={{ color: k.up ? '#10b981' : '#ef4444' }}>
                  {k.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {k.change}
                </span>
              </div>
              <p className="text-lg font-bold text-white">{k.value}</p>
            </div>
          );
        })}
      </div>

      {/* ── Charts ──────────────────────────────────────────── */}
      <div className="grid lg:grid-cols-3 gap-5">

        {/* Line chart */}
        <div className="lg:col-span-2 p-5" style={CARD}>
          <h3 className="font-bold text-sm mb-4 text-white">Sales & Spend</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,217,255,0.07)" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#8a94a6' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#8a94a6' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#0d1628', border: '1px solid rgba(0,217,255,0.2)', borderRadius: 8, color: '#fff' }}
                formatter={(v: number) => [`$${v.toLocaleString()}`]} />
              <Line type="monotone" dataKey="sales" stroke="#10b981" strokeWidth={2} dot={false} name="Sales" />
              <Line type="monotone" dataKey="spend" stroke={CYAN}    strokeWidth={2} dot={false} name="Spend" strokeDasharray="4 2" />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex gap-5 mt-2">
            <span className="flex items-center gap-1.5 text-xs" style={{ color: '#8a94a6' }}>
              <div className="w-4 h-0.5 bg-[#10b981]" /> Sales
            </span>
            <span className="flex items-center gap-1.5 text-xs" style={{ color: '#8a94a6' }}>
              <div className="w-4 h-0.5" style={{ background: CYAN }} /> Spend
            </span>
          </div>
        </div>

        {/* Donut chart */}
        <div className="p-5" style={CARD}>
          <h3 className="font-bold text-sm mb-4 text-white">Campaign Mix</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={campaignBreakdown} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" nameKey="name">
                {campaignBreakdown.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: '#0d1628', border: '1px solid rgba(0,217,255,0.2)', borderRadius: 8, color: '#fff' }}
                formatter={(v: number) => [v + '%']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-1">
            {campaignBreakdown.map((c, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-sm" style={{ background: c.fill }} />
                  <span style={{ color: '#a0aec0' }}>{c.name}</span>
                </div>
                <span className="font-medium text-white">{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Alerts + Products ───────────────────────────────── */}
      <div className="grid lg:grid-cols-2 gap-5">

        {/* Alerts */}
        <div className="p-5" style={CARD}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-400" /> Alerts
            </h3>
            <Link href="/alerts" className="text-xs transition-colors" style={{ color: CYAN }}>View all →</Link>
          </div>
          <div className="space-y-1">
            {alerts.slice(0, 4).map(a => (
              <div key={a.id} className="flex items-start gap-2.5 py-2.5" style={{ borderBottom: '1px solid rgba(0,217,255,0.07)' }}>
                <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                  style={{ background: a.severity === 'critical' ? '#ef4444' : a.severity === 'warning' ? '#f59e0b' : '#10b981' }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white leading-snug">{a.title}</p>
                  <p className="text-xs truncate mt-0.5" style={{ color: '#8a94a6' }}>{a.message}</p>
                </div>
                <span className="text-[10px] flex-shrink-0" style={{ color: '#4a5568' }}>{a.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Product Performance */}
        <div className="p-5" style={CARD}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
              <Zap className="w-4 h-4" style={{ color: CYAN }} /> Product Performance
            </h3>
            <Link href="/products" className="text-xs transition-colors" style={{ color: CYAN }}>View all →</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(0,217,255,0.1)' }}>
                  {['Product', 'Sales', 'Cost', 'Profit', 'Units'].map(h => (
                    <th key={h} className="text-left pb-2 font-medium" style={{ color: '#8a94a6' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.slice(0, 5).map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid rgba(0,217,255,0.05)' }}>
                    <td className="py-2 max-w-[110px]">
                      <p className="truncate font-medium text-white">{p.name.split('-')[0].trim()}</p>
                    </td>
                    <td className="py-2 font-medium" style={{ color: '#10b981' }}>${(p.sales / 1000).toFixed(0)}K</td>
                    <td className="py-2" style={{ color: '#a0aec0' }}>${(p.cost / 1000).toFixed(0)}K</td>
                    <td className="py-2 font-medium" style={{ color: p.profit > 0 ? '#10b981' : '#ef4444' }}>
                      ${(p.profit / 1000).toFixed(0)}K
                    </td>
                    <td className="py-2" style={{ color: '#a0aec0' }}>{p.units}</td>
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
