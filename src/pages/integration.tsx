import { useState } from 'react';
import { stores } from '@/data/mock';
import { Link2, CheckCircle2, Clock, RefreshCw, Shield, Activity } from 'lucide-react';

const CARD = { background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '0.875rem', boxShadow: 'var(--card-shadow)' } as const;

const syncHistory = [
  { date: '2026-03-08 14:30', status: 'success', items: 'Synced 10 campaigns and 42 keywords' },
  { date: '2026-03-08 08:00', status: 'success', items: 'Synced 10 campaigns and 40 keywords' },
  { date: '2026-03-07 14:30', status: 'success', items: 'Synced 9 campaigns and 38 keywords'  },
  { date: '2026-03-07 08:00', status: 'error',   items: 'Connection failed — retrying automatically' },
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
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Link2 className="w-5 h-5" style={{ color: 'var(--accent)' }} /> Amazon Connect
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Manage Amazon account connections and data sync</p>
      </div>

      {/* Connected Stores */}
      <div>
        <h2 className="font-bold text-sm mb-3 text-white">Connected Stores</h2>
        <div className="space-y-3">
          {stores.map(store => (
            <div key={store.id} className="p-4" style={CARD}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(255,153,0,0.12)', border: '1px solid rgba(255,153,0,0.25)' }}>
                  <span className="text-lg">🛒</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-bold text-sm text-white">{store.name}</h3>
                    <span className="text-xs px-1.5 py-0.5 rounded flex items-center gap-1"
                      style={{ background: 'rgba(16,185,129,0.12)', color: 'var(--success)', border: '1px solid rgba(16,185,129,0.25)' }}>
                      <CheckCircle2 className="w-3 h-3" /> Connected
                    </span>
                  </div>
                  <p className="text-xs" style={{ color: 'var(--text-dim)' }}>{store.marketplace}</p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <p className="text-xs" style={{ color: 'var(--text-dim)' }}>Last sync</p>
                  <p className="text-xs font-medium text-white">{store.lastSync}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mt-3 pt-3" style={{ borderTop: '1px solid var(--border-primary)' }}>
                <div className="text-center">
                  <p className="text-xs" style={{ color: 'var(--text-dim)' }}>Sales</p>
                  <p className="font-bold text-sm" style={{ color: 'var(--success)' }}>${store.totalSales.toLocaleString()}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs" style={{ color: 'var(--text-dim)' }}>Active Campaigns</p>
                  <p className="font-bold text-sm text-white">{store.activeCampaigns}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs" style={{ color: 'var(--text-dim)' }}>Account Health</p>
                  <p className="font-bold text-sm" style={{ color: store.health >= 90 ? '#10b981' : store.health >= 70 ? '#f59e0b' : '#ef4444' }}>{store.health}%</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sync Actions */}
      <div className="p-4 flex items-center justify-between" style={CARD}>
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4" style={{ color: 'var(--success)' }} />
          <div>
            <p className="text-sm font-medium text-white">Auto Sync</p>
            <p className="text-xs" style={{ color: 'var(--text-dim)' }}>Data syncs automatically every 6 hours</p>
          </div>
        </div>
        <button onClick={syncNow} disabled={syncing}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-[#0a0612] transition-all"
          style={{ background: 'var(--accent-gradient)', opacity: syncing ? 0.7 : 1 }}>
          <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
          {syncing ? 'Syncing...' : 'Sync Now'}
        </button>
      </div>

      {/* Security */}
      <div className="p-4" style={CARD}>
        <div className="flex items-center gap-2 mb-3">
          <Shield className="w-4 h-4" style={{ color: 'var(--success)' }} />
          <h3 className="font-bold text-sm text-white">Security & Permissions</h3>
        </div>
        <div className="space-y-2">
          {['Read advertising data', 'Manage campaigns and keywords', 'Read sales data'].map(p => (
            <div key={p} className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--success)' }} />
              <span style={{ color: 'var(--text-muted)' }}>{p}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sync History */}
      <div style={{ ...CARD, overflow: 'hidden' }}>
        <div className="px-4 py-3 flex items-center gap-1.5" style={{ borderBottom: '1px solid var(--border-primary)' }}>
          <Clock className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
          <h3 className="font-bold text-sm text-white">Sync History</h3>
        </div>
        <div>
          {syncHistory.map((h, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3"
              style={{ borderBottom: i < syncHistory.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
              <div className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: h.status === 'success' ? '#10b981' : '#ef4444' }} />
              <div className="flex-1 min-w-0">
                <p className="text-sm" style={{ color: h.status === 'success' ? '#a0aec0' : '#ef4444' }}>{h.items}</p>
              </div>
              <span className="text-xs flex-shrink-0" style={{ color: 'var(--text-dim)' }}>{h.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
