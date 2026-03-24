import { useState } from 'react';
import { campaigns } from '@/data/mock';
import { Search, ChevronUp, ChevronDown } from 'lucide-react';

type SortKey = 'spend' | 'sales' | 'roas' | 'acos' | 'ctr';

export default function Campaigns() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortKey, setSortKey] = useState<SortKey>('sales');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const types = ['all', ...Array.from(new Set(campaigns.map(c => c.type)))];

  const filtered = campaigns
    .filter(c => {
      const ms = c.name.toLowerCase().includes(search.toLowerCase());
      const mst = statusFilter === 'all' || c.status === statusFilter;
      const mt = typeFilter === 'all' || c.type === typeFilter;
      return ms && mst && mt;
    })
    .sort((a, b) => sortDir === 'desc' ? b[sortKey] - a[sortKey] : a[sortKey] - b[sortKey]);

  const toggleSort = (k: SortKey) => {
    if (sortKey === k) setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    else { setSortKey(k); setSortDir('desc'); }
  };

  const Th = ({ label, k }: { label: string; k: SortKey }) => (
    <th className="text-right py-2.5 px-3 font-medium text-gray-500 dark:text-gray-400 cursor-pointer whitespace-nowrap hover:text-gray-800 dark:hover:text-gray-200"
      onClick={() => toggleSort(k)}>
      <div className="flex items-center gap-1 justify-end">
        {label}
        {sortKey === k ? (sortDir === 'desc' ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />) : <ChevronDown className="w-3 h-3 opacity-30" />}
      </div>
    </th>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">الحملات</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{filtered.length} حملة</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-3 flex flex-wrap gap-2">
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded px-3 py-1.5 flex-1 min-w-48">
          <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input type="text" placeholder="بحث في الحملات..." value={search} onChange={e => setSearch(e.target.value)}
            className="bg-transparent border-none outline-none text-sm w-full" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded px-3 py-1.5 text-sm outline-none">
          <option value="all">جميع الحالات</option>
          <option value="active">نشطة</option>
          <option value="paused">متوقفة</option>
        </select>
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
          className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded px-3 py-1.5 text-sm outline-none">
          {types.map(t => <option key={t} value={t}>{t === 'all' ? 'جميع الأنواع' : t}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="text-right py-2.5 px-3 font-medium text-gray-500 dark:text-gray-400">الحملة</th>
                <th className="text-right py-2.5 px-3 font-medium text-gray-500 dark:text-gray-400">الحالة</th>
                <th className="text-right py-2.5 px-3 font-medium text-gray-500 dark:text-gray-400">الميزانية</th>
                <Th label="الإنفاق" k="spend" />
                <Th label="المبيعات" k="sales" />
                <Th label="ROAS" k="roas" />
                <Th label="ACOS" k="acos" />
                <Th label="CTR" k="ctr" />
                <th className="text-right py-2.5 px-3 font-medium text-gray-500 dark:text-gray-400">النقرات</th>
                <th className="text-right py-2.5 px-3 font-medium text-gray-500 dark:text-gray-400">الطلبات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id} className="border-b border-gray-100 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30">
                  <td className="py-3 px-3">
                    <p className="font-medium text-gray-900 dark:text-gray-100">{c.name}</p>
                    <p className="text-xs text-gray-400">{c.type}</p>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${c.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}>
                      {c.status === 'active' ? '● نشطة' : '○ متوقفة'}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-gray-600 dark:text-gray-400">{c.budget.toLocaleString()}</td>
                  <td className="py-3 px-3">{c.spend.toLocaleString()}</td>
                  <td className="py-3 px-3 font-medium text-green-600">{c.sales.toLocaleString()}</td>
                  <td className="py-3 px-3">
                    <span className={`font-bold ${c.roas >= 4 ? 'text-green-600' : c.roas >= 2 ? 'text-amber-600' : 'text-red-500'}`}>{c.roas}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`${c.acos <= 25 ? 'text-green-600' : c.acos <= 40 ? 'text-amber-600' : 'text-red-500'}`}>{c.acos}%</span>
                  </td>
                  <td className="py-3 px-3">{c.ctr}%</td>
                  <td className="py-3 px-3">{c.clicks.toLocaleString()}</td>
                  <td className="py-3 px-3">{c.orders}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p>لا توجد حملات تطابق البحث</p>
          </div>
        )}
      </div>
    </div>
  );
}
