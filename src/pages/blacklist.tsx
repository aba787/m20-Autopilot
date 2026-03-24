import { useState } from 'react';
import { blacklist as initialBlacklist } from '@/data/mock';
import { ShieldOff, Trash2, RotateCcw, Plus } from 'lucide-react';

export default function Blacklist() {
  const [items, setItems] = useState(initialBlacklist);
  const [newAsin, setNewAsin] = useState('');
  const [newName, setNewName] = useState('');
  const [newReason, setNewReason] = useState('');

  const remove = (id: number) => setItems(prev => prev.filter(i => i.id !== id));

  const add = () => {
    if (!newAsin || !newName) return;
    setItems(prev => [...prev, { id: Date.now(), name: newName, asin: newAsin, reason: newReason || 'يدوي', date: new Date().toISOString().split('T')[0] }]);
    setNewAsin(''); setNewName(''); setNewReason('');
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2"><ShieldOff className="w-5 h-5 text-red-600" /> القائمة السوداء</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">المنتجات المستبعدة — الذكاء الاصطناعي يتجاهلها تلقائياً</p>
        </div>
        <span className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-sm px-3 py-1 rounded-full font-medium">{items.length} منتج</span>
      </div>

      {/* Add manually */}
      <div className="card p-4">
        <h3 className="font-bold text-sm mb-3 flex items-center gap-2"><Plus className="w-4 h-4" /> إضافة يدوية</h3>
        <div className="flex flex-wrap gap-2">
          <input type="text" placeholder="ASIN *" value={newAsin} onChange={e => setNewAsin(e.target.value)}
            className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded px-3 py-1.5 text-sm outline-none w-40 font-mono" dir="ltr" />
          <input type="text" placeholder="اسم المنتج *" value={newName} onChange={e => setNewName(e.target.value)}
            className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded px-3 py-1.5 text-sm outline-none flex-1 min-w-40" />
          <input type="text" placeholder="السبب" value={newReason} onChange={e => setNewReason(e.target.value)}
            className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded px-3 py-1.5 text-sm outline-none flex-1 min-w-40" />
          <button onClick={add} className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-1.5 rounded text-sm font-medium hover:opacity-90">
            إضافة
          </button>
        </div>
      </div>

      {/* List */}
      {items.length === 0 ? (
        <div className="card p-12 text-center">
          <ShieldOff className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <h3 className="font-bold mb-1">القائمة السوداء فارغة</h3>
          <p className="text-sm text-gray-500">يمكنك استبعاد المنتجات من صفحة المنتجات أو إضافتها يدوياً أعلاه.</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
                <tr>
                  <th className="text-right py-2.5 px-4 font-medium text-gray-500">المنتج</th>
                  <th className="text-right py-2.5 px-4 font-medium text-gray-500">ASIN</th>
                  <th className="text-right py-2.5 px-4 font-medium text-gray-500">سبب الاستبعاد</th>
                  <th className="text-right py-2.5 px-4 font-medium text-gray-500">تاريخ الإضافة</th>
                  <th className="text-right py-2.5 px-4 font-medium text-gray-500">إجراء</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.id} className="border-b border-gray-100 dark:border-gray-800/50">
                    <td className="py-3 px-4 font-medium">{item.name}</td>
                    <td className="py-3 px-4 font-mono text-xs text-gray-500" dir="ltr">{item.asin}</td>
                    <td className="py-3 px-4">
                      <span className="text-xs bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 px-2 py-0.5 rounded">{item.reason}</span>
                    </td>
                    <td className="py-3 px-4 text-gray-500 text-xs">{item.date}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <button onClick={() => remove(item.id)} title="إزالة من القائمة"
                          className="p-1.5 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600">
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => remove(item.id)} title="حذف نهائي"
                          className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
