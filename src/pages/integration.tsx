import { useState } from 'react';
import { stores } from '@/data/mock';
import { Link2, CheckCircle2, Clock, RefreshCw, Shield, Activity } from 'lucide-react';

const syncHistory = [
  { date: '2026-03-08 14:30', status: 'success', items: 'مزامنة 10 حملات و 42 كلمة مفتاحية' },
  { date: '2026-03-08 08:00', status: 'success', items: 'مزامنة 10 حملات و 40 كلمة مفتاحية' },
  { date: '2026-03-07 14:30', status: 'success', items: 'مزامنة 9 حملات و 38 كلمة مفتاحية' },
  { date: '2026-03-07 08:00', status: 'error', items: 'فشل الاتصال — إعادة المحاولة تلقائياً' },
];

export default function Integration() {
  const [syncing, setSyncing] = useState(false);

  const syncNow = () => {
    setSyncing(true);
    setTimeout(() => setSyncing(false), 2000);
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold flex items-center gap-2"><Link2 className="w-5 h-5 text-blue-600" /> ربط أمازون</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">إدارة ربط حسابات أمازون ومزامنة البيانات</p>
      </div>

      {/* Connected Stores */}
      <div>
        <h2 className="font-bold text-sm mb-3">المتاجر المرتبطة</h2>
        <div className="space-y-3">
          {stores.map(store => (
            <div key={store.id} className="card p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">🛒</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-bold text-sm">{store.name}</h3>
                    <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-1.5 py-0.5 rounded flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> مرتبط
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{store.marketplace}</p>
                </div>
                <div className="text-left flex-shrink-0">
                  <p className="text-xs text-gray-500 mb-0.5">آخر مزامنة</p>
                  <p className="text-xs font-medium">{store.lastSync}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-0.5">المبيعات</p>
                  <p className="font-bold text-sm text-green-600">{store.totalSales.toLocaleString()}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-0.5">حملات نشطة</p>
                  <p className="font-bold text-sm">{store.activeCampaigns}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-0.5">صحة الحساب</p>
                  <p className={`font-bold text-sm ${store.health >= 90 ? 'text-green-600' : store.health >= 70 ? 'text-amber-600' : 'text-red-500'}`}>{store.health}%</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sync Actions */}
      <div className="card p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-green-600" />
          <div>
            <p className="text-sm font-medium">المزامنة التلقائية</p>
            <p className="text-xs text-gray-500">تتم المزامنة كل 6 ساعات تلقائياً</p>
          </div>
        </div>
        <button onClick={syncNow} disabled={syncing}
          className="flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-60">
          <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
          {syncing ? 'جارٍ المزامنة...' : 'مزامنة الآن'}
        </button>
      </div>

      {/* Security */}
      <div className="card p-4">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="w-4 h-4 text-green-600" />
          <h3 className="font-bold text-sm">الأمان والصلاحيات</h3>
        </div>
        <div className="space-y-2">
          {['قراءة بيانات الإعلانات', 'إدارة الحملات والكلمات المفتاحية', 'قراءة بيانات المبيعات'].map(p => (
            <div key={p} className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span className="text-gray-600 dark:text-gray-400">{p}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sync History */}
      <div className="card overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
          <h3 className="font-bold text-sm flex items-center gap-1.5"><Clock className="w-4 h-4" /> سجل المزامنة</h3>
        </div>
        <div>
          {syncHistory.map((h, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-800/50 last:border-0">
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${h.status === 'success' ? 'bg-green-500' : 'bg-red-500'}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm">{h.items}</p>
              </div>
              <span className="text-xs text-gray-400 flex-shrink-0">{h.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
