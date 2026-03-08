import { stores } from '@/data/mock';
import { Store, CheckCircle2, XCircle, RefreshCw, BarChart3, Megaphone, Activity } from 'lucide-react';

export default function Stores() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">المتاجر</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">إدارة متاجر أمازون المرتبطة بحسابك</p>
        </div>
        <button className="btn-primary text-sm flex items-center gap-2">
          <Store className="w-4 h-4" /> إضافة متجر
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stores.map(store => (
          <div key={store.id} className={`card p-5 hover:shadow-md transition-shadow ${store.status === 'connected' ? 'border-emerald-200 dark:border-emerald-800/30' : 'border-red-200 dark:border-red-800/30'}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${store.status === 'connected' ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                  <Store className={`w-5 h-5 ${store.status === 'connected' ? 'text-emerald-600' : 'text-red-600'}`} />
                </div>
                <div>
                  <h3 className="font-bold">{store.name}</h3>
                  <p className="text-xs text-gray-500">{store.marketplace}</p>
                </div>
              </div>
              {store.status === 'connected' ? (
                <span className="badge-success flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> متصل</span>
              ) : (
                <span className="badge-danger flex items-center gap-1"><XCircle className="w-3 h-3" /> غير متصل</span>
              )}
            </div>

            {store.status === 'connected' && (
              <>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800 text-center">
                    <BarChart3 className="w-4 h-4 text-brand-600 mx-auto mb-1" />
                    <p className="text-xs text-gray-500">المبيعات</p>
                    <p className="font-bold text-sm">{store.totalSales.toLocaleString()} ر.س</p>
                  </div>
                  <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800 text-center">
                    <Megaphone className="w-4 h-4 text-brand-600 mx-auto mb-1" />
                    <p className="text-xs text-gray-500">حملات نشطة</p>
                    <p className="font-bold text-sm">{store.activeCampaigns}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-500 flex items-center gap-1"><Activity className="w-3 h-3" /> صحة المتجر</span>
                    <span className="font-bold">{store.health}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-emerald-500 rounded-full h-2" style={{ width: `${store.health}%` }} />
                  </div>
                </div>
              </>
            )}

            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>آخر مزامنة: {store.lastSync}</span>
              <button className="flex items-center gap-1 text-brand-600 hover:underline">
                <RefreshCw className="w-3 h-3" /> مزامنة
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
