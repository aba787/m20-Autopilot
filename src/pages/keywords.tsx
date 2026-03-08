import { useState } from 'react';
import { keywords } from '@/data/mock';
import { Search, Filter, Key } from 'lucide-react';

export default function Keywords() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = keywords.filter(k => {
    const matchSearch = k.keyword.includes(search) || k.campaign.includes(search);
    const matchStatus = statusFilter === 'all' || k.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">الكلمات المفتاحية</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">تحليل وإدارة الكلمات المفتاحية لحملاتك</p>
      </div>

      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="flex-1 flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2">
            <Search className="w-4 h-4 text-gray-400" />
            <input type="text" placeholder="بحث في الكلمات المفتاحية..." value={search} onChange={e => setSearch(e.target.value)}
              className="bg-transparent border-none outline-none text-sm w-full" />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
              className="input-field py-2 text-sm w-auto">
              <option value="all">جميع الحالات</option>
              <option value="active">نشطة</option>
              <option value="paused">متوقفة</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800">
                <th className="text-right py-3 px-3 font-medium text-gray-500 dark:text-gray-400">الكلمة المفتاحية</th>
                <th className="text-right py-3 px-3 font-medium text-gray-500 dark:text-gray-400">الحملة</th>
                <th className="text-right py-3 px-3 font-medium text-gray-500 dark:text-gray-400">CPC</th>
                <th className="text-right py-3 px-3 font-medium text-gray-500 dark:text-gray-400">CTR</th>
                <th className="text-right py-3 px-3 font-medium text-gray-500 dark:text-gray-400">التحويلات</th>
                <th className="text-right py-3 px-3 font-medium text-gray-500 dark:text-gray-400">ACOS</th>
                <th className="text-right py-3 px-3 font-medium text-gray-500 dark:text-gray-400">ROAS</th>
                <th className="text-right py-3 px-3 font-medium text-gray-500 dark:text-gray-400">الحالة</th>
                <th className="text-right py-3 px-3 font-medium text-gray-500 dark:text-gray-400">توصية النظام</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(k => (
                <tr key={k.id} className="border-b border-gray-100 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <Key className="w-3.5 h-3.5 text-brand-500" />
                      <span className="font-medium">{k.keyword}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-gray-500">{k.campaign}</td>
                  <td className="py-3 px-3">{k.cpc} ر.س</td>
                  <td className="py-3 px-3">{k.ctr}%</td>
                  <td className="py-3 px-3">{k.conversions}</td>
                  <td className="py-3 px-3">
                    <span className={k.acos <= 20 ? 'text-emerald-600 font-medium' : k.acos <= 35 ? 'text-amber-600 font-medium' : 'text-red-600 font-medium'}>
                      {k.acos}%
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className={k.roas >= 5 ? 'text-emerald-600 font-bold' : k.roas >= 3 ? 'text-amber-600 font-bold' : 'text-red-600 font-bold'}>
                      {k.roas}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className={k.status === 'active' ? 'badge-success' : 'badge-warning'}>
                      {k.status === 'active' ? 'نشطة' : 'متوقفة'}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-xs px-2 py-1 rounded-lg bg-brand-50 dark:bg-brand-950/50 text-brand-700 dark:text-brand-400">
                      {k.recommendation}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
