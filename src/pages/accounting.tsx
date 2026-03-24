import { useState } from 'react';
import { accounting } from '@/data/mock';
import { Calculator, TrendingUp, DollarSign, Package, Bot } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Accounting() {
  const [view, setView] = useState<'overview' | 'daily' | 'byProduct'>('overview');
  const s = accounting.summary;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2"><Calculator className="w-5 h-5 text-brand-600" /> المحاسبة</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">تحليل الإيرادات والتكاليف والأرباح</p>
        </div>
        <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden text-sm">
          {(['overview', 'daily', 'byProduct'] as const).map(v => (
            <button key={v} onClick={() => setView(v)}
              className={`px-3 py-1.5 font-medium transition-colors ${view === v ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
              {v === 'overview' ? 'ملخص' : v === 'daily' ? 'يومي' : 'بالمنتج'}
            </button>
          ))}
        </div>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-xs text-gray-500">الإيرادات</span>
          </div>
          <p className="text-xl font-bold text-green-600">{s.revenue.toLocaleString()} ر.س</p>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-red-500" />
            <span className="text-xs text-gray-500">إنفاق الإعلانات</span>
          </div>
          <p className="text-xl font-bold">{s.adSpend.toLocaleString()} ر.س</p>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-4 h-4 text-blue-600" />
            <span className="text-xs text-gray-500">تكلفة المنتجات</span>
          </div>
          <p className="text-xl font-bold">{s.productCost.toLocaleString()} ر.س</p>
        </div>
        <div className="card p-4 border-green-200 dark:border-green-800">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-xs text-gray-500">صافي الربح</span>
          </div>
          <p className="text-2xl font-bold text-green-600">{s.profit.toLocaleString()} ر.س</p>
          <p className="text-xs text-green-600 mt-0.5">هامش {s.profitMargin}%</p>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-4 h-4 text-gray-600" />
            <span className="text-xs text-gray-500">الوحدات المباعة</span>
          </div>
          <p className="text-xl font-bold">{s.unitsSold.toLocaleString()}</p>
        </div>
        <div className="card p-4 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center gap-2 mb-2">
            <Bot className="w-4 h-4 text-green-600" />
            <span className="text-xs text-gray-500">تحليل الذكاء الاصطناعي</span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">هامش الربح جيد. تكلفة إعلانات "مكنسة كهربائية" غير مجدية — يُنصح بإيقافها.</p>
        </div>
      </div>

      {/* Chart */}
      {view === 'daily' && (
        <div className="card p-5">
          <h3 className="font-bold text-sm mb-4">الأداء اليومي</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={accounting.daily} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip formatter={(v: number) => v.toLocaleString() + ' ر.س'} />
              <Bar dataKey="revenue" fill="#22c55e" radius={[3, 3, 0, 0]} name="الإيرادات" />
              <Bar dataKey="adSpend" fill="#000000" radius={[3, 3, 0, 0]} name="الإنفاق" />
              <Bar dataKey="profit" fill="#86efac" radius={[3, 3, 0, 0]} name="الربح" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Daily Table */}
      {view === 'daily' && (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
                <tr>
                  <th className="text-right py-2.5 px-4 font-medium text-gray-500">التاريخ</th>
                  <th className="text-right py-2.5 px-4 font-medium text-gray-500">الإيرادات</th>
                  <th className="text-right py-2.5 px-4 font-medium text-gray-500">إنفاق إعلانات</th>
                  <th className="text-right py-2.5 px-4 font-medium text-gray-500">تكلفة منتجات</th>
                  <th className="text-right py-2.5 px-4 font-medium text-gray-500">صافي الربح</th>
                  <th className="text-right py-2.5 px-4 font-medium text-gray-500">الطلبات</th>
                </tr>
              </thead>
              <tbody>
                {accounting.daily.map((d, i) => (
                  <tr key={i} className="border-b border-gray-100 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30">
                    <td className="py-3 px-4 font-medium">{d.date}</td>
                    <td className="py-3 px-4 text-green-600 font-medium">{d.revenue.toLocaleString()}</td>
                    <td className="py-3 px-4">{d.adSpend.toLocaleString()}</td>
                    <td className="py-3 px-4">{d.productCost.toLocaleString()}</td>
                    <td className="py-3 px-4 text-green-600 font-bold">{d.profit.toLocaleString()}</td>
                    <td className="py-3 px-4">{d.orders}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* By Product */}
      {view === 'byProduct' && (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
                <tr>
                  <th className="text-right py-2.5 px-4 font-medium text-gray-500">المنتج</th>
                  <th className="text-right py-2.5 px-4 font-medium text-gray-500">الإيرادات</th>
                  <th className="text-right py-2.5 px-4 font-medium text-gray-500">إنفاق إعلانات</th>
                  <th className="text-right py-2.5 px-4 font-medium text-gray-500">تكلفة المنتج</th>
                  <th className="text-right py-2.5 px-4 font-medium text-gray-500">صافي الربح</th>
                  <th className="text-right py-2.5 px-4 font-medium text-gray-500">الوحدات</th>
                </tr>
              </thead>
              <tbody>
                {accounting.byProduct.map((p, i) => (
                  <tr key={i} className="border-b border-gray-100 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30">
                    <td className="py-3 px-4 font-medium">{p.name}</td>
                    <td className="py-3 px-4 text-green-600 font-medium">{p.revenue.toLocaleString()}</td>
                    <td className="py-3 px-4">{p.adSpend.toLocaleString()}</td>
                    <td className="py-3 px-4">{p.productCost.toLocaleString()}</td>
                    <td className="py-3 px-4 text-green-600 font-bold">{p.profit.toLocaleString()}</td>
                    <td className="py-3 px-4">{p.units}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {view === 'overview' && (
        <div className="card p-5">
          <h3 className="font-bold text-sm mb-4">ربح المنتجات</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={accounting.byProduct} layout="vertical" margin={{ top: 5, right: 30, left: 80, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" tick={{ fontSize: 10 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={80}
                tickFormatter={v => v.length > 12 ? v.slice(0, 12) + '...' : v} />
              <Tooltip formatter={(v: number) => v.toLocaleString() + ' ر.س'} />
              <Bar dataKey="profit" fill="#22c55e" radius={[0, 3, 3, 0]} name="الربح" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
