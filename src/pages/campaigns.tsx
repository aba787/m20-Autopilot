import { useState } from 'react';
import { campaigns } from '@/data/mock';
import { Search, Filter, Plus, Edit2, Eye, X, Megaphone } from 'lucide-react';

export default function Campaigns() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCampaign, setSelectedCampaign] = useState<typeof campaigns[0] | null>(null);

  const filtered = campaigns.filter(c => {
    const matchSearch = c.name.includes(search);
    const matchStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">الحملات</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">إدارة ومتابعة جميع حملاتك الإعلانية</p>
        </div>
        <button className="btn-primary flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> حملة جديدة
        </button>
      </div>

      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="flex-1 flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2">
            <Search className="w-4 h-4 text-gray-400" />
            <input type="text" placeholder="بحث في الحملات..." value={search} onChange={e => setSearch(e.target.value)}
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
                <th className="text-right py-3 px-3 font-medium text-gray-500 dark:text-gray-400">الحملة</th>
                <th className="text-right py-3 px-3 font-medium text-gray-500 dark:text-gray-400">الحالة</th>
                <th className="text-right py-3 px-3 font-medium text-gray-500 dark:text-gray-400">الميزانية</th>
                <th className="text-right py-3 px-3 font-medium text-gray-500 dark:text-gray-400">الإنفاق</th>
                <th className="text-right py-3 px-3 font-medium text-gray-500 dark:text-gray-400">المبيعات</th>
                <th className="text-right py-3 px-3 font-medium text-gray-500 dark:text-gray-400">ROAS</th>
                <th className="text-right py-3 px-3 font-medium text-gray-500 dark:text-gray-400">ACOS</th>
                <th className="text-right py-3 px-3 font-medium text-gray-500 dark:text-gray-400">CTR</th>
                <th className="text-right py-3 px-3 font-medium text-gray-500 dark:text-gray-400">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id} className="border-b border-gray-100 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                  <td className="py-3 px-3">
                    <div>
                      <p className="font-medium">{c.name}</p>
                      <p className="text-xs text-gray-500">{c.type}</p>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className={c.status === 'active' ? 'badge-success' : 'badge-warning'}>
                      {c.status === 'active' ? 'نشطة' : 'متوقفة'}
                    </span>
                  </td>
                  <td className="py-3 px-3">{c.budget.toLocaleString()} ر.س</td>
                  <td className="py-3 px-3">{c.spend.toLocaleString()} ر.س</td>
                  <td className="py-3 px-3">{c.sales.toLocaleString()} ر.س</td>
                  <td className="py-3 px-3">
                    <span className={c.roas >= 4 ? 'text-emerald-600 font-bold' : c.roas >= 2 ? 'text-amber-600 font-bold' : 'text-red-600 font-bold'}>
                      {c.roas}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className={c.acos <= 25 ? 'text-emerald-600' : c.acos <= 40 ? 'text-amber-600' : 'text-red-600'}>
                      {c.acos}%
                    </span>
                  </td>
                  <td className="py-3 px-3">{c.ctr}%</td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => setSelectedCampaign(c)} className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700" title="عرض">
                        <Eye className="w-4 h-4 text-gray-500" />
                      </button>
                      <button className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700" title="تعديل">
                        <Edit2 className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedCampaign && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedCampaign(null)}>
          <div className="card w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-brand-600" /> تفاصيل الحملة
              </h2>
              <button onClick={() => setSelectedCampaign(null)} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">اسم الحملة</p>
                <p className="font-bold text-lg">{selectedCampaign.name}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <p className="text-xs text-gray-500">الحالة</p>
                  <span className={selectedCampaign.status === 'active' ? 'badge-success mt-1' : 'badge-warning mt-1'}>
                    {selectedCampaign.status === 'active' ? 'نشطة' : 'متوقفة'}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <p className="text-xs text-gray-500">النوع</p>
                  <p className="font-medium text-sm mt-1">{selectedCampaign.type}</p>
                </div>
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <p className="text-xs text-gray-500">الميزانية</p>
                  <p className="font-bold">{selectedCampaign.budget.toLocaleString()} ر.س</p>
                </div>
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <p className="text-xs text-gray-500">الإنفاق</p>
                  <p className="font-bold">{selectedCampaign.spend.toLocaleString()} ر.س</p>
                </div>
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <p className="text-xs text-gray-500">المبيعات</p>
                  <p className="font-bold text-emerald-600">{selectedCampaign.sales.toLocaleString()} ر.س</p>
                </div>
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <p className="text-xs text-gray-500">ROAS</p>
                  <p className="font-bold text-brand-600">{selectedCampaign.roas}</p>
                </div>
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <p className="text-xs text-gray-500">ACOS</p>
                  <p className="font-bold">{selectedCampaign.acos}%</p>
                </div>
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <p className="text-xs text-gray-500">CTR</p>
                  <p className="font-bold">{selectedCampaign.ctr}%</p>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button className="btn-primary flex-1">تعديل الحملة</button>
                <button className="btn-secondary flex-1" onClick={() => setSelectedCampaign(null)}>إغلاق</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
