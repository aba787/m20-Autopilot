import { useState } from 'react';
import { products } from '@/data/mock';
import { Search, ShieldOff, ChevronDown, X, Tag, AlertTriangle } from 'lucide-react';

const brands = ['الكل', ...Array.from(new Set(products.map(p => p.brand)))];

export default function Products() {
  const [search, setSearch] = useState('');
  const [brandFilter, setBrandFilter] = useState('الكل');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null);
  const [blacklisted, setBlacklisted] = useState<number[]>([]);

  const filtered = products.filter(p => {
    if (blacklisted.includes(p.id)) return false;
    const ms = p.name.includes(search) || p.asin.includes(search);
    const mb = brandFilter === 'الكل' || p.brand === brandFilter;
    const mst = statusFilter === 'all' || p.status === statusFilter;
    return ms && mb && mst;
  });

  const handleBlacklist = (id: number) => {
    setBlacklisted(prev => [...prev, id]);
    if (selectedProduct?.id === id) setSelectedProduct(null);
  };

  const statusLabel: Record<string, string> = { active: 'نشط', weak: 'ضعيف', poor: 'سيئ' };
  const statusColor: Record<string, string> = {
    active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    weak: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
    poor: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">المنتجات والكلمات المفتاحية</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{filtered.length} منتج</p>
        </div>
        <a href="/blacklist" className="flex items-center gap-1.5 text-sm text-red-600 hover:text-red-700 border border-red-200 dark:border-red-800 px-3 py-1.5 rounded-lg">
          <ShieldOff className="w-4 h-4" /> القائمة السوداء ({blacklisted.length})
        </a>
      </div>

      {/* Filters */}
      <div className="card p-3 flex flex-wrap gap-2 items-center">
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded px-3 py-1.5 flex-1 min-w-48">
          <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input type="text" placeholder="بحث بالاسم أو ASIN..." value={search} onChange={e => setSearch(e.target.value)}
            className="bg-transparent border-none outline-none text-sm w-full" dir="rtl" />
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-gray-500">البراند:</span>
          <select value={brandFilter} onChange={e => setBrandFilter(e.target.value)}
            className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded px-3 py-1.5 text-sm outline-none">
            {brands.map(b => <option key={b}>{b}</option>)}
          </select>
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded px-3 py-1.5 text-sm outline-none">
          <option value="all">جميع الحالات</option>
          <option value="active">نشط</option>
          <option value="weak">ضعيف</option>
          <option value="poor">سيئ</option>
        </select>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Table */}
        <div className={`${selectedProduct ? 'lg:col-span-2' : 'lg:col-span-3'} card overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
                <tr>
                  <th className="text-right py-2.5 px-3 font-medium text-gray-500 dark:text-gray-400">المنتج</th>
                  <th className="text-right py-2.5 px-3 font-medium text-gray-500 dark:text-gray-400">ASIN</th>
                  <th className="text-right py-2.5 px-3 font-medium text-gray-500 dark:text-gray-400">المبيعات</th>
                  <th className="text-right py-2.5 px-3 font-medium text-gray-500 dark:text-gray-400">الربح</th>
                  <th className="text-right py-2.5 px-3 font-medium text-gray-500 dark:text-gray-400">ACOS</th>
                  <th className="text-right py-2.5 px-3 font-medium text-gray-500 dark:text-gray-400">الحالة</th>
                  <th className="text-right py-2.5 px-3 font-medium text-gray-500 dark:text-gray-400">إجراء</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id}
                    onClick={() => setSelectedProduct(selectedProduct?.id === p.id ? null : p)}
                    className={`border-b border-gray-100 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30 cursor-pointer transition-colors ${selectedProduct?.id === p.id ? 'bg-gray-50 dark:bg-gray-800/30' : ''}`}>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0 text-xs text-gray-500">
                          {p.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 dark:text-gray-100 leading-snug" style={{ maxWidth: selectedProduct ? '200px' : '280px' }}>
                            {p.name}
                          </p>
                          <p className="text-xs text-gray-400">{p.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono text-xs text-gray-500">{p.asin}</td>
                    <td className="py-3 px-3 font-medium text-green-600">{p.sales.toLocaleString()}</td>
                    <td className={`py-3 px-3 font-medium ${p.profit > 0 ? 'text-green-600' : 'text-red-500'}`}>{p.profit.toLocaleString()}</td>
                    <td className="py-3 px-3">
                      <span className={p.acos <= 25 ? 'text-green-600' : p.acos <= 35 ? 'text-amber-600' : 'text-red-500'}>{p.acos}%</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${statusColor[p.status]}`}>
                        {statusLabel[p.status]}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <button onClick={e => { e.stopPropagation(); handleBlacklist(p.id); }}
                        className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700 border border-red-200 dark:border-red-800 px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                        <ShieldOff className="w-3 h-3" /> استبعاد
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail panel */}
        {selectedProduct && (
          <div className="card p-4 sticky top-6 self-start">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm">تفاصيل المنتج</h3>
              <button onClick={() => setSelectedProduct(null)} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500 mb-1">اسم المنتج</p>
                <p className="text-sm font-medium leading-snug">{selectedProduct.name}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 rounded bg-gray-50 dark:bg-gray-800">
                  <p className="text-[10px] text-gray-500">المبيعات</p>
                  <p className="font-bold text-sm text-green-600">{selectedProduct.sales.toLocaleString()}</p>
                </div>
                <div className="p-2 rounded bg-gray-50 dark:bg-gray-800">
                  <p className="text-[10px] text-gray-500">الربح</p>
                  <p className={`font-bold text-sm ${selectedProduct.profit > 0 ? 'text-green-600' : 'text-red-500'}`}>{selectedProduct.profit.toLocaleString()}</p>
                </div>
                <div className="p-2 rounded bg-gray-50 dark:bg-gray-800">
                  <p className="text-[10px] text-gray-500">التكلفة</p>
                  <p className="font-bold text-sm">{selectedProduct.cost.toLocaleString()}</p>
                </div>
                <div className="p-2 rounded bg-gray-50 dark:bg-gray-800">
                  <p className="text-[10px] text-gray-500">الوحدات</p>
                  <p className="font-bold text-sm">{selectedProduct.units}</p>
                </div>
              </div>

              <div>
                <p className="text-xs font-medium mb-1.5 flex items-center gap-1"><Tag className="w-3 h-3 text-brand-600" /> الكلمات المفتاحية</p>
                <div className="flex flex-wrap gap-1">
                  {selectedProduct.keywords.length > 0 ? selectedProduct.keywords.map((kw, i) => (
                    <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800">{kw}</span>
                  )) : <span className="text-xs text-gray-400">لا يوجد</span>}
                </div>
              </div>

              {selectedProduct.negKeywords.length > 0 && (
                <div>
                  <p className="text-xs font-medium mb-1.5 flex items-center gap-1"><AlertTriangle className="w-3 h-3 text-red-500" /> كلمات سلبية</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedProduct.negKeywords.map((kw, i) => (
                      <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800">{kw}</span>
                    ))}
                  </div>
                </div>
              )}

              <button onClick={() => handleBlacklist(selectedProduct.id)}
                className="w-full flex items-center justify-center gap-1.5 text-sm text-red-600 border border-red-200 dark:border-red-800 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20">
                <ShieldOff className="w-4 h-4" /> نقل للقائمة السوداء
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
