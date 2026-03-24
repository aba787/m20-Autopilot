import { useState } from 'react';
import { alerts as initialAlerts } from '@/data/mock';
import { Bell, AlertTriangle, AlertCircle, CheckCircle2, X } from 'lucide-react';

const severityConfig: Record<string, { label: string; color: string; icon: any; bg: string }> = {
  critical: { label: 'حرج', color: 'text-red-600', icon: AlertCircle, bg: 'border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/10' },
  warning: { label: 'تحذير', color: 'text-amber-600', icon: AlertTriangle, bg: 'border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/10' },
  success: { label: 'إيجابي', color: 'text-green-600', icon: CheckCircle2, bg: 'border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/10' },
};

export default function Alerts() {
  const [items, setItems] = useState(initialAlerts);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [severityFilter, setSeverityFilter] = useState('all');

  const dismiss = (id: number) => setItems(prev => prev.filter(a => a.id !== id));
  const markRead = (id: number) => setItems(prev => prev.map(a => a.id === id ? { ...a, read: true } : a));
  const markAllRead = () => setItems(prev => prev.map(a => ({ ...a, read: true })));

  const filtered = items.filter(a => {
    const rf = filter === 'unread' ? !a.read : true;
    const sf = severityFilter === 'all' || a.severity === severityFilter;
    return rf && sf;
  });

  const unreadCount = items.filter(a => !a.read).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2"><Bell className="w-5 h-5 text-amber-500" /> التنبيهات</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{unreadCount} غير مقروء</p>
        </div>
        <button onClick={markAllRead} className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
          تحديد الكل كمقروء
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden text-sm">
          <button onClick={() => setFilter('all')}
            className={`px-3 py-1.5 font-medium ${filter === 'all' ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900' : 'text-gray-500'}`}>
            الكل ({items.length})
          </button>
          <button onClick={() => setFilter('unread')}
            className={`px-3 py-1.5 font-medium ${filter === 'unread' ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900' : 'text-gray-500'}`}>
            غير مقروء ({unreadCount})
          </button>
        </div>
        <select value={severityFilter} onChange={e => setSeverityFilter(e.target.value)}
          className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded px-3 py-1.5 text-sm outline-none">
          <option value="all">جميع الأنواع</option>
          <option value="critical">حرج</option>
          <option value="warning">تحذير</option>
          <option value="success">إيجابي</option>
        </select>
      </div>

      {/* List */}
      <div className="space-y-2">
        {filtered.map(a => {
          const cfg = severityConfig[a.severity];
          const Icon = cfg.icon;
          return (
            <div key={a.id} className={`card p-4 border ${cfg.bg} ${!a.read ? 'shadow-sm' : ''}`}>
              <div className="flex items-start gap-3">
                <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${cfg.color}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-bold text-sm">{a.title}</h3>
                    <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${cfg.color} bg-white dark:bg-gray-900`}>{cfg.label}</span>
                    {!a.read && <span className="w-2 h-2 rounded-full bg-blue-500" />}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{a.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{a.time}</p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {!a.read && (
                    <button onClick={() => markRead(a.id)} className="p-1.5 rounded hover:bg-white dark:hover:bg-gray-800 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-xs" title="تحديد كمقروء">✓</button>
                  )}
                  <button onClick={() => dismiss(a.id)} className="p-1.5 rounded hover:bg-white dark:hover:bg-gray-800 text-gray-400">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="card p-12 text-center">
            <Bell className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="font-bold">لا توجد تنبيهات</p>
            <p className="text-sm text-gray-500 mt-1">ممتاز! كل شيء يعمل بشكل جيد.</p>
          </div>
        )}
      </div>
    </div>
  );
}
