import { useState } from 'react';
import { alerts } from '@/data/mock';
import { Bell, AlertTriangle, AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

const severityConfig: Record<string, { label: string; color: string; icon: any; bg: string }> = {
  critical: { label: 'حرج', color: 'text-red-600', icon: AlertCircle, bg: 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800/30' },
  warning: { label: 'تحذير', color: 'text-amber-600', icon: AlertTriangle, bg: 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800/30' },
  success: { label: 'إيجابي', color: 'text-emerald-600', icon: CheckCircle2, bg: 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800/30' },
  info: { label: 'معلومة', color: 'text-blue-600', icon: Info, bg: 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800/30' },
};

export default function Alerts() {
  const [selectedAlert, setSelectedAlert] = useState<typeof alerts[0] | null>(null);
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? alerts : alerts.filter(a => a.severity === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">التنبيهات</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">متابعة التنبيهات والتحذيرات لحملاتك</p>
        </div>
        <button className="btn-secondary text-sm">تحديد الكل كمقروء</button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {['all', 'critical', 'warning', 'success', 'info'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === f ? 'bg-brand-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
            {f === 'all' ? 'الكل' : severityConfig[f]?.label}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {filtered.map(a => {
            const config = severityConfig[a.severity];
            const Icon = config.icon;
            return (
              <div key={a.id}
                onClick={() => setSelectedAlert(a)}
                className={`card p-4 border cursor-pointer hover:shadow-md transition-all ${config.bg} ${selectedAlert?.id === a.id ? 'ring-2 ring-brand-500' : ''} ${!a.read ? '' : 'opacity-70'}`}>
                <div className="flex items-start gap-3">
                  <Icon className={`w-5 h-5 mt-0.5 ${config.color}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-sm">{a.title}</h3>
                      {!a.read && <span className="w-2 h-2 rounded-full bg-brand-500" />}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{a.message}</p>
                    <p className="text-xs text-gray-400 mt-2">{a.time}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="lg:col-span-1">
          {selectedAlert ? (
            <div className="card p-5 sticky top-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold">تفاصيل التنبيه</h3>
                <button onClick={() => setSelectedAlert(null)} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">النوع</p>
                  <span className={`badge ${severityConfig[selectedAlert.severity].color} ${severityConfig[selectedAlert.severity].bg.split(' ')[0]}`}>
                    {severityConfig[selectedAlert.severity].label}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">العنوان</p>
                  <p className="font-bold">{selectedAlert.title}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">التفاصيل</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{selectedAlert.message}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">الوقت</p>
                  <p className="text-sm">{selectedAlert.time}</p>
                </div>
                <div className="flex gap-2 pt-2">
                  <button className="btn-primary flex-1 text-sm">عرض الحملة</button>
                  <button className="btn-secondary flex-1 text-sm">تجاهل</button>
                </div>
              </div>
            </div>
          ) : (
            <div className="card p-8 text-center">
              <Bell className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-sm text-gray-500">اختر تنبيهاً لعرض تفاصيله</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
