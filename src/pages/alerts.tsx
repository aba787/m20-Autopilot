import { useState } from 'react';
import { alerts as initialAlerts } from '@/data/mock';
import { Bell, AlertTriangle, AlertCircle, CheckCircle2, X } from 'lucide-react';

const CARD = { background: 'rgba(0,217,255,0.04)', border: '1px solid rgba(0,217,255,0.12)', borderRadius: '0.875rem' } as const;

const severityConfig: Record<string, { label: string; color: string; icon: any; border: string; bg: string }> = {
  critical: { label: 'Critical', color: '#ef4444', icon: AlertCircle,   border: 'rgba(239,68,68,0.3)',    bg: 'rgba(239,68,68,0.05)'    },
  warning:  { label: 'Warning',  color: '#f59e0b', icon: AlertTriangle, border: 'rgba(245,158,11,0.3)',   bg: 'rgba(245,158,11,0.05)'   },
  success:  { label: 'Good',     color: '#10b981', icon: CheckCircle2,  border: 'rgba(16,185,129,0.3)',   bg: 'rgba(16,185,129,0.05)'   },
};

export default function Alerts() {
  const [items, setItems]             = useState(initialAlerts);
  const [filter, setFilter]           = useState<'all' | 'unread'>('all');
  const [severityFilter, setSeverityFilter] = useState('all');

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
            <Bell className="w-5 h-5 text-amber-400" /> Alerts
          </h1>
          <p className="text-sm" style={{ color: '#8a94a6' }}>{unreadCount} unread</p>
        </div>
        <button onClick={markAllRead} className="text-sm transition-colors" style={{ color: '#00d9ff' }}>
          Mark all as read
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <div className="flex items-center rounded-lg overflow-hidden text-sm" style={{ border: '1px solid rgba(0,217,255,0.15)' }}>
          <button onClick={() => setFilter('all')}
            className="px-3 py-1.5 font-medium transition-colors"
            style={filter === 'all' ? { background: 'rgba(0,217,255,0.15)', color: '#00d9ff' } : { color: '#8a94a6' }}>
            All ({items.length})
          </button>
          <button onClick={() => setFilter('unread')}
            className="px-3 py-1.5 font-medium transition-colors"
            style={filter === 'unread' ? { background: 'rgba(0,217,255,0.15)', color: '#00d9ff' } : { color: '#8a94a6' }}>
            Unread ({unreadCount})
          </button>
        </div>
        <select value={severityFilter} onChange={e => setSeverityFilter(e.target.value)}
          className="rounded-lg px-3 py-1.5 text-sm outline-none text-white"
          style={{ background: 'rgba(0,217,255,0.06)', border: '1px solid rgba(0,217,255,0.15)' }}>
          <option value="all">All Types</option>
          <option value="critical">Critical</option>
          <option value="warning">Warning</option>
          <option value="success">Good</option>
        </select>
      </div>

      {/* List */}
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
                      style={{ color: cfg.color, background: 'rgba(0,0,0,0.2)' }}>{cfg.label}</span>
                    {!a.read && <span className="w-2 h-2 rounded-full" style={{ background: '#00d9ff' }} />}
                  </div>
                  <p className="text-sm" style={{ color: '#a0aec0' }}>{a.message}</p>
                  <p className="text-xs mt-1" style={{ color: '#4a5568' }}>{a.time}</p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {!a.read && (
                    <button onClick={() => markRead(a.id)}
                      className="p-1.5 rounded text-xs transition-colors"
                      style={{ color: '#00d9ff' }} title="Mark as read">✓</button>
                  )}
                  <button onClick={() => dismiss(a.id)}
                    className="p-1.5 rounded transition-colors"
                    style={{ color: '#4a5568' }}>
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="p-12 text-center" style={CARD}>
            <Bell className="w-10 h-10 mx-auto mb-3" style={{ color: '#4a5568' }} />
            <p className="font-bold text-white">No Alerts</p>
            <p className="text-sm mt-1" style={{ color: '#8a94a6' }}>All good! Everything is running smoothly.</p>
          </div>
        )}
      </div>
    </div>
  );
}
