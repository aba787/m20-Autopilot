import { useState } from 'react';
import { reportsData, salesChartMonthly } from '@/data/mock';
import { FileText, Download } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

type Period = 'daily' | 'weekly' | 'monthly';

export default function Reports() {
  const [period, setPeriod] = useState<Period>('daily');

  const data = reportsData[period];

  const download = () => {
    const csv = ['التاريخ,الإنفاق,المبيعات,ROAS,ACOS,الطلبات',
      ...data.map(d => `${d.date},${d.spend},${d.sales},${d.roas},${d.acos},${d.orders}`)
    ].join('\n');
    const link = document.createElement('a');
    link.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    link.download = `report-${period}.csv`;
    link.click();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2"><FileText className="w-5 h-5 text-brand-600" /> التقارير</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">تقارير الأداء والإنفاق</p>
        </div>
        <button onClick={download}
          className="flex items-center gap-2 border border-gray-200 dark:border-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800">
          <Download className="w-4 h-4" /> تصدير CSV
        </button>
      </div>

      {/* Period toggle */}
      <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden text-sm w-fit">
        {(['daily', 'weekly', 'monthly'] as Period[]).map(p => (
          <button key={p} onClick={() => setPeriod(p)}
            className={`px-4 py-1.5 font-medium transition-colors ${period === p ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
            {p === 'daily' ? 'يومي' : p === 'weekly' ? 'أسبوعي' : 'شهري'}
          </button>
        ))}
      </div>

      {/* KPI summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'إجمالي المبيعات', value: data.reduce((s, d) => s + d.sales, 0).toLocaleString() + ' ر.س', color: 'text-green-600' },
          { label: 'إجمالي الإنفاق', value: data.reduce((s, d) => s + d.spend, 0).toLocaleString() + ' ر.س', color: '' },
          { label: 'متوسط ROAS', value: (data.reduce((s, d) => s + d.roas, 0) / data.length).toFixed(1), color: 'text-green-600' },
          { label: 'إجمالي الطلبات', value: data.reduce((s, d) => s + d.orders, 0).toLocaleString(), color: '' },
        ].map((k, i) => (
          <div key={i} className="card p-4">
            <p className="text-xs text-gray-500 mb-1">{k.label}</p>
            <p className={`text-xl font-bold ${k.color}`}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Line Chart */}
      <div className="card p-5">
        <h3 className="font-bold text-sm mb-4">المبيعات والإنفاق</h3>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip formatter={(v: number) => v.toLocaleString() + ' ر.س'} />
            <Line type="monotone" dataKey="sales" stroke="#22c55e" strokeWidth={2} dot={false} name="المبيعات" />
            <Line type="monotone" dataKey="spend" stroke="#000" strokeWidth={2} dot={false} name="الإنفاق" strokeDasharray="4 2" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Bar chart for ROAS */}
      <div className="card p-5">
        <h3 className="font-bold text-sm mb-4">ROAS بمرور الوقت</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip />
            <Bar dataKey="roas" fill="#22c55e" radius={[3, 3, 0, 0]} name="ROAS" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="text-right py-2.5 px-4 font-medium text-gray-500">الفترة</th>
                <th className="text-right py-2.5 px-4 font-medium text-gray-500">الإنفاق</th>
                <th className="text-right py-2.5 px-4 font-medium text-gray-500">المبيعات</th>
                <th className="text-right py-2.5 px-4 font-medium text-gray-500">ROAS</th>
                <th className="text-right py-2.5 px-4 font-medium text-gray-500">ACOS%</th>
                <th className="text-right py-2.5 px-4 font-medium text-gray-500">الطلبات</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d, i) => (
                <tr key={i} className="border-b border-gray-100 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30">
                  <td className="py-3 px-4 font-medium">{d.date}</td>
                  <td className="py-3 px-4">{d.spend.toLocaleString()}</td>
                  <td className="py-3 px-4 text-green-600 font-medium">{d.sales.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <span className={`font-bold ${d.roas >= 4 ? 'text-green-600' : 'text-amber-600'}`}>{d.roas}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={d.acos <= 25 ? 'text-green-600' : 'text-amber-600'}>{d.acos}%</span>
                  </td>
                  <td className="py-3 px-4">{d.orders}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
