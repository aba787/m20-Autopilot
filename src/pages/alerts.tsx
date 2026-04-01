import { useState } from 'react';
import { alerts as initialAlerts } from '@/data/mock';
import { Bell, AlertTriangle, AlertCircle, CheckCircle2, X } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

const CARD = { background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '0.875rem', boxShadow: 'var(--card-shadow)' } as const;

export default function Alerts() {
  const { t } = useI18n();
  const [items, setItems]             = useState(initialAlerts);
  const [filter, setFilter]           = useState<'all' | 'unread'>('all');
  const [severityFilter, setSeverityFilter] = useState('all');

  const severityConfig: Record<string, { label: string; color: string; icon: any; border: string; bg: string }> = {
    critical: { label: t('alerts.critical'), color: 'var(--error)', icon: AlertCircle,   border: 'rgba(239,68,68,0.3)',    bg: 'rgba(239,68,68,0.05)'    },
    warning:  { label: t('alerts.warning'),  color: 'var(--warning)', icon: AlertTriangle, border: 'rgba(245,158,11,0.3)',   bg: 'rgba(245,158,11,0.05)'   },
    success:  { label: t('alerts.good'),     color: 'var(--success)', icon: CheckCircle2,  border: 'rgba(16,185,129,0.3)',   bg: 'rgba(16,185,129,0.05)'   },
  };

  const dismiss  = (id: number) => setItems(prev => prev.filter(a => a.id !== id));
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
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-400" /> {t('alerts.title')}
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{unreadCount} {t('alerts.unread')}</p>
        </div>
        <button onClick={markAllRead} className="text-sm transition-colors" style={{ color: 'var(--accent)' }}>
          {t('alerts.markAllRead')}
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        <div className="flex items-center rounded-lg overflow-hidden text-sm" style={{ border: '1px solid var(--input-border)' }}>
          <button onClick={() => setFilter('all')}
            className="px-3 py-1.5 font-medium transition-colors"
            style={filter === 'all' ? { background: 'var(--accent-bg-strong)', color: 'var(--accent)' } : { color: 'var(--text-muted)' }}>
            {t('alerts.allFilter')} ({items.length})
          </button>
          <button onClick={() => setFilter('unread')}
            className="px-3 py-1.5 font-medium transition-colors"
            style={filter === 'unread' ? { background: 'var(--accent-bg-strong)', color: 'var(--accent)' } : { color: 'var(--text-muted)' }}>
            {t('alerts.unreadFilter')} ({unreadCount})
          </button>
        </div>
        <select value={severityFilter} onChange={e => setSeverityFilter(e.target.value)}
          className="rounded-lg px-3 py-1.5 text-sm outline-none text-white"
          style={{ background: 'var(--input-bg)', border: '1px solid var(--input-border)' }}>
          <option value="all">{t('alerts.allTypes')}</option>
          <option value="critical">{t('alerts.critical')}</option>
          <option value="warning">{t('alerts.warning')}</option>
          <option value="success">{t('alerts.good')}</option>
        </select>
      </div>

      <div className="space-y-2">
        {filtered.map(a => {
          const cfg  = severityConfig[a.severity];
          const Icon = cfg.icon;
          return (
            <div key={a.id} className="p-4 rounded-xl"
              style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, boxShadow: !a.read ? '0 1px 3px rgba(0,0,0,0.2)' : 'none' }}>
              <div className="flex items-start gap-3">
                <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: cfg.color }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <h3 className="font-bold text-sm text-white">{a.title}</h3>
                    <span className="text-xs px-1.5 py-0.5 rounded font-medium"
                      style={{ color: cfg.color, background: 'var(--hover-bg)' }}>{cfg.label}</span>
                    {!a.read && <span className="w-2 h-2 rounded-full" style={{ background: 'var(--accent)' }} />}
                  </div>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{a.message}</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-dim)' }}>{a.time}</p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {!a.read && (
                    <button onClick={() => markRead(a.id)}
                      className="p-1.5 rounded text-xs transition-colors"
                      style={{ color: 'var(--accent)' }} title="Mark as read">✓</button>
                  )}
                  <button onClick={() => dismiss(a.id)}
                    className="p-1.5 rounded transition-colors"
                    style={{ color: 'var(--text-dim)' }}>
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="p-12 text-center" style={CARD}>
            <Bell className="w-10 h-10 mx-auto mb-3" style={{ color: 'var(--text-dim)' }} />
            <p className="font-bold text-white">{t('alerts.noAlerts')}</p>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{t('alerts.allGood')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
