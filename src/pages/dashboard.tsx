import { useState } from 'react';
import { kpiData, salesChartMonthly, salesChartTwoWeeks, campaignBreakdown, products, alerts } from '@/data/mock';
import { TrendingUp, TrendingDown, ShoppingCart, DollarSign, MousePointerClick, Package, BarChart3, AlertTriangle, Zap } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import Link from 'next/link';

const kpis = [
  { label: 'المبيعات', value: kpiData.sales.toLocaleString() + ' ر.س', icon: TrendingUp, color: 'text-green-600', change: '+28%', up: true },
  { label: 'الطلبات', value: kpiData.orders.toLocaleString(), icon: ShoppingCart, color: 'text-blue-600', change: '+12%', up: true },
  { label: 'التكلفة', value: kpiData.cost.toLocaleString() + ' ر.س', icon: DollarSign, change: '+8%', up: false },
  { label: 'ACOS', value: kpiData.acos + '%', icon: BarChart3, change: '-2.1%', up: false },
  { label: 'النقرات', value: kpiData.clicks.toLocaleString(), icon: MousePointerClick, change: '+15%', up: true },
  { label: 'الربح', value: kpiData.profit.toLocaleString() + ' ر.س', icon: TrendingUp, color: 'text-green-600', change: '+34%', up: true },
  { label: 'الإنفاق', value: kpiData.spend.toLocaleString() + ' ر.س', icon: DollarSign, change: '+8%', up: false },
  { label: 'الوحدات', value: kpiData.unitsSold.toLocaleString(), icon: Package, change: '+19%', up: true },
];

export default function Dashboard() {
  const [period, setPeriod] = useState<'monthly' | 'twoWeeks'>('monthly');
  const chartData = period === 'monthly' ? salesChartMonthly : salesChartTwoWeeks;

  return (
    <div className="space-y-5">
      {/* Header + period toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">لوحة التحكم</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">مرحباً أحمد — آخر تحديث: اليوم 14:30</p>
        </div>
        <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden text-sm">
          <button onClick={() => setPeriod('monthly')}
            className={`px-4 py-1.5 font-medium transition-colors ${period === 'monthly' ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
            شهري
          </button>
          <button onClick={() => setPeriod('twoWeeks')}
            className={`px-4 py-1.5 font-medium transition-colors ${period === 'twoWeeks' ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
            أسبوعان
          </button>
        </div>
      </div>

      {/* KPI Cards — 4 per row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {kpis.map((k, i) => (
          <div key={i} className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">{k.label}</span>
              <span className={`text-xs font-medium flex items-center gap-0.5 ${k.up ? 'text-green-600' : 'text-red-500'}`}>
                {k.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {k.change}
              </span>
            </div>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{k.value}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Line chart — spans 2 cols */}
        <div className="lg:col-span-2 card p-5">
          <h3 className="font-bold text-sm mb-4 text-gray-700 dark:text-gray-300">المبيعات والإنفاق</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip formatter={(v: number) => v.toLocaleString() + ' ر.س'} />
              <Line type="monotone" dataKey="sales" stroke="#22c55e" strokeWidth={2} dot={false} name="المبيعات" />
              <Line type="monotone" dataKey="spend" stroke="#000000" strokeWidth={2} dot={false} name="الإنفاق" strokeDasharray="4 2" />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-2">
            <span className="flex items-center gap-1.5 text-xs text-gray-500"><div className="w-4 h-0.5 bg-green-500" /> المبيعات</span>
            <span className="flex items-center gap-1.5 text-xs text-gray-500"><div className="w-4 h-0.5 bg-black dark:bg-white border-dashed border-t border-black dark:border-white" /> الإنفاق</span>
          </div>
        </div>

        {/* Donut chart */}
        <div className="card p-5">
          <h3 className="font-bold text-sm mb-4 text-gray-700 dark:text-gray-300">توزيع الحملات</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={campaignBreakdown} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" nameKey="name">
                {campaignBreakdown.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number) => v + '%'} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-1">
            {campaignBreakdown.map((c, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-sm" style={{ background: c.fill }} />
                  <span className="text-gray-600 dark:text-gray-400">{c.name}</span>
                </div>
                <span className="font-medium">{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts + Product Performance */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Alerts */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm flex items-center gap-1.5"><AlertTriangle className="w-4 h-4 text-amber-500" /> التنبيهات</h3>
            <Link href="/alerts" className="text-xs text-gray-500 hover:text-gray-800 dark:hover:text-gray-200">عرض الكل →</Link>
          </div>
          <div className="space-y-2">
            {alerts.slice(0, 4).map(a => (
              <div key={a.id} className="flex items-start gap-2.5 py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${a.severity === 'critical' ? 'bg-red-500' : a.severity === 'warning' ? 'bg-amber-500' : 'bg-green-500'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-snug">{a.title}</p>
                  <p className="text-xs text-gray-500 truncate mt-0.5">{a.message}</p>
                </div>
                <span className="text-[10px] text-gray-400 flex-shrink-0">{a.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Product Performance */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm flex items-center gap-1.5"><Zap className="w-4 h-4 text-green-600" /> أداء المنتجات</h3>
            <Link href="/products" className="text-xs text-gray-500 hover:text-gray-800 dark:hover:text-gray-200">عرض الكل →</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <th className="text-right pb-2 font-medium text-gray-500">المنتج</th>
                  <th className="text-right pb-2 font-medium text-gray-500">المبيعات</th>
                  <th className="text-right pb-2 font-medium text-gray-500">التكلفة</th>
                  <th className="text-right pb-2 font-medium text-gray-500">الربح</th>
                  <th className="text-right pb-2 font-medium text-gray-500">الوحدات</th>
                </tr>
              </thead>
              <tbody>
                {products.slice(0, 5).map(p => (
                  <tr key={p.id} className="border-b border-gray-50 dark:border-gray-800/50">
                    <td className="py-2 max-w-[120px]">
                      <p className="truncate font-medium text-gray-800 dark:text-gray-200">{p.name.split('-')[0].trim()}</p>
                    </td>
                    <td className="py-2 text-green-600 font-medium">{(p.sales/1000).toFixed(0)}K</td>
                    <td className="py-2">{(p.cost/1000).toFixed(0)}K</td>
                    <td className={`py-2 font-medium ${p.profit > 0 ? 'text-green-600' : 'text-red-500'}`}>{(p.profit/1000).toFixed(0)}K</td>
                    <td className="py-2">{p.units}</td>
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
