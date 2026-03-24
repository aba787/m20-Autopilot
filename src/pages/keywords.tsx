import { useState } from 'react';
import { keywords } from '@/data/mock';
import { Search, Tag, ChevronUp, ChevronDown } from 'lucide-react';

export default function Keywords() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortKey, setSortKey] = useState<'cpc' | 'acos' | 'conversions' | 'roas'>('conversions');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const filtered = keywords
    .filter(k => {
      const ms = k.keyword.includes(search) || k.product.includes(search);
      const mst = statusFilter === 'all' || k.status === statusFilter;
      const mt = typeFilter === 'all' || k.type === typeFilter;
      return ms && mst && mt;
    })
    .sort((a, b) => sortDir === 'desc' ? b[sortKey] - a[sortKey] : a[sortKey] - b[sortKey]);

  const toggleSort = (k: typeof sortKey) => {
    if (sortKey === k) setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    else { setSortKey(k); setSortDir('desc'); }
  };

  const Th = ({ label, k }: { label: string; k: typeof sortKey }) => (
    <th className="text-right py-2.5 px-3 font-medium text-gray-500 cursor-pointer whitespace-nowrap hover:text-gray-800 dark:hover:text-gray-200"
      onClick={() => toggleSort(k)}>
      <div className="flex items-center gap-1 justify-end">
        {label}
        {sortKey === k ? (sortDir === 'desc' ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />) : <ChevronDown className="w-3 h-3 opacity-30" />}
      </div>
    </th>
  );

  const typeBadge: Record<string, string> = {
    broad: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    phrase: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    exact: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  };
  const typeLabel: Record<string, string> = { broad: 'واسع', phrase: 'عبارة', exact: 'دقيق' };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2"><Tag className="w-5 h-5 text-brand-600" /> الكلمات المفتاحية</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{filtered.length} كلمة مفتاحية</p>
        </div>
      </div>

      <div className="card p-3 flex flex-wrap gap-2">
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded px-3 py-1.5 flex-1 min-w-48">
          <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input type="text" placeholder="بحث في الكلمات..." value={search} onChange={e => setSearch(e.target.value)}
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
          <option value="all">جميع الأنواع</option>
          <option value="broad">واسع (Broad)</option>
          <option value="phrase">عبارة (Phrase)</option>
          <option value="exact">دقيق (Exact)</option>
        </select>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="text-right py-2.5 px-3 font-medium text-gray-500">الكلمة المفتاحية</th>
                <th className="text-right py-2.5 px-3 font-medium text-gray-500">المنتج</th>
                <th className="text-right py-2.5 px-3 font-medium text-gray-500">النوع</th>
                <Th label="CPC" k="cpc" />
                <Th label="التحويلات" k="conversions" />
                <Th label="ACOS" k="acos" />
                <Th label="ROAS" k="roas" />
                <th className="text-right py-2.5 px-3 font-medium text-gray-500">الحالة</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(kw => (
                <tr key={kw.id} className="border-b border-gray-100 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30">
                  <td className="py-3 px-3 font-medium">{kw.keyword}</td>
                  <td className="py-3 px-3 text-gray-500 text-xs max-w-[120px] truncate">{kw.product}</td>
                  <td className="py-3 px-3">
                    <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${typeBadge[kw.type]}`}>{typeLabel[kw.type]}</span>
                  </td>
                  <td className="py-3 px-3">{kw.cpc} ر.س</td>
                  <td className="py-3 px-3 font-medium">{kw.conversions}</td>
                  <td className="py-3 px-3">
                    <span className={kw.acos <= 25 ? 'text-green-600' : kw.acos <= 40 ? 'text-amber-600' : 'text-red-500'}>{kw.acos}%</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`font-bold ${kw.roas >= 4 ? 'text-green-600' : kw.roas >= 2 ? 'text-amber-600' : 'text-red-500'}`}>{kw.roas}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`text-xs px-2 py-0.5 rounded font-medium ${kw.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}>
                      {kw.status === 'active' ? '● نشطة' : '○ متوقفة'}
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
