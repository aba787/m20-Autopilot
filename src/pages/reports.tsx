import { useState } from 'react';
import { reportsData, salesChartData } from '@/data/mock';
import { FileText, Download, Calendar } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

type Period = 'daily' | 'weekly' | 'monthly';

export default function Reports() {
  const [period, setPeriod] = useState<Period>('daily');
  const data = reportsData[period];

  const totalSpend = data.reduce((s, d) => s + d.spend, 0);
  const totalSales = data.reduce((s, d) => s + d.sales, 0);
  const totalOrders = data.reduce((s, d) => s + d.orders, 0);
  const avgRoas = (totalSales / totalSpend).toFixed(2);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">التقارير</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">تقارير أداء مفصلة لحملاتك الإعلانية</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary text-sm flex items-center gap-2">
            <Download className="w-4 h-4" /> تصدير PDF
          </button>
          <button className="btn-secondary text-sm flex items-center gap-2">
            <Download className="w-4 h-4" /> تصدير CSV
          </button>
        </div>
      </div>

      <div className="flex gap-2">
        {[
          { key: 'daily' as Period, label: 'يومي' },
          { key: 'weekly' as Period, label: 'أسبوعي' },
          { key: 'monthly' as Period, label: 'شهري' },
        ].map(t => (
          <button key={t.key} onClick={() => setPeriod(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${period === t.key ? 'bg-brand-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4">
          <p className="text-xs text-gray-500 mb-1">إجمالي الإنفاق</p>
          <p className="text-xl font-bold">{totalSpend.toLocaleString()} ر.س</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-gray-500 mb-1">إجمالي المبيعات</p>
          <p className="text-xl font-bold text-emerald-600">{totalSales.toLocaleString()} ر.س</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-gray-500 mb-1">متوسط ROAS</p>
          <p className="text-xl font-bold text-brand-600">{avgRoas}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-gray-500 mb-1">إجمالي الطلبات</p>
          <p className="text-xl font-bold">{totalOrders.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <h3 className="font-bold mb-4">المبيعات والإنفاق</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="rSalesGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3374ff" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3374ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v: number) => `${v.toLocaleString()} ر.س`} />
              <Area type="monotone" dataKey="sales" stroke="#3374ff" fill="url(#rSalesGrad)" strokeWidth={2} name="المبيعات" />
              <Area type="monotone" dataKey="spend" stroke="#f59e0b" fill="transparent" strokeWidth={2} name="الإنفاق" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <h3 className="font-bold mb-4">ROAS</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="roas" fill="#3374ff" radius={[4, 4, 0, 0]} name="ROAS" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-bold mb-4 flex items-center gap-2"><Calendar className="w-4 h-4 text-brand-600" /> التفاصيل</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800">
                <th className="text-right py-3 px-3 font-medium text-gray-500">الفترة</th>
                <th className="text-right py-3 px-3 font-medium text-gray-500">الإنفاق</th>
                <th className="text-right py-3 px-3 font-medium text-gray-500">المبيعات</th>
                <th className="text-right py-3 px-3 font-medium text-gray-500">ROAS</th>
                <th className="text-right py-3 px-3 font-medium text-gray-500">ACOS</th>
                <th className="text-right py-3 px-3 font-medium text-gray-500">الطلبات</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d, i) => (
                <tr key={i} className="border-b border-gray-100 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30">
                  <td className="py-3 px-3 font-medium">{d.date}</td>
                  <td className="py-3 px-3">{d.spend.toLocaleString()} ر.س</td>
                  <td className="py-3 px-3 text-emerald-600 font-medium">{d.sales.toLocaleString()} ر.س</td>
                  <td className="py-3 px-3 text-brand-600 font-bold">{d.roas}</td>
                  <td className="py-3 px-3">{d.acos}%</td>
                  <td className="py-3 px-3">{d.orders}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
