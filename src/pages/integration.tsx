import { useState, useEffect } from 'react';
import { Link2, CheckCircle2, Clock, RefreshCw, Shield, Activity, Loader2, AlertCircle, XCircle, PlusCircle } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { useAuth, authFetch } from '@/lib/useAuth';
import { useRouter } from 'next/router';

const CARD = { background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '0.875rem', boxShadow: 'var(--card-shadow)' } as const;

interface AmazonConnection {
  id: string;
  seller_name: string;
  marketplace: string;
  is_active: boolean;
  last_synced_at: string | null;
  token_expires_at: string | null;
  created_at: string;
}

interface SyncLog {
  date: string;
  status: 'success' | 'error';
  items: string;
}

export default function Integration() {
  const { t } = useI18n();
  const { token } = useAuth();
  const af = authFetch(token);
  const router = useRouter();

  const [connections, setConnections] = useState<AmazonConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [syncLogs, setSyncLogs] = useState<SyncLog[]>([]);

  useEffect(() => {
    const { status, error } = router.query;
    if (status === 'success') {
      setStatusMsg({ type: 'success', text: 'تم ربط حساب أمازون بنجاح!' });
      router.replace('/integration', undefined, { shallow: true });
    } else if (error) {
      setStatusMsg({ type: 'error', text: `فشل الربط: ${error}` });
      router.replace('/integration', undefined, { shallow: true });
    }
  }, [router.query]);

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    fetchConnections();
  }, [token]);

  const fetchConnections = async () => {
    try {
      const res = await af('/api/amazon-connection');
      const data = await res.json();
      if (res.ok) setConnections(data.connections ?? []);
    } catch {}
    finally { setLoading(false); }
  };

  const connectAmazon = () => {
    if (!token) return;
    setConnecting(true);
    window.location.href = `/api/amazon/connect?token=${encodeURIComponent(token)}`;
  };

  const syncNow = async () => {
    setSyncing(true);
    setStatusMsg(null);
    try {
      const res = await af('/api/amazon/sync', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setStatusMsg({ type: 'success', text: `تمت المزامنة: ${data.synced ?? 0} حملة` });
        setSyncLogs(prev => [{ date: new Date().toLocaleString('ar-SA'), status: 'success', items: `تمت مزامنة ${data.synced ?? 0} حملة` }, ...prev.slice(0, 9)]);
        fetchConnections();
      } else {
        setStatusMsg({ type: 'error', text: data.error || 'فشلت المزامنة' });
        setSyncLogs(prev => [{ date: new Date().toLocaleString('ar-SA'), status: 'error', items: data.error || 'فشلت المزامنة' }, ...prev.slice(0, 9)]);
      }
    } catch (e: any) {
      setStatusMsg({ type: 'error', text: e.message });
    } finally {
      setSyncing(false);
    }
  };

  const isExpired = (expiresAt: string | null) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Link2 className="w-5 h-5" style={{ color: 'var(--accent)' }} /> {t('connect.title')}
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{t('connect.subtitle')}</p>
      </div>

      {statusMsg && (
        <div className="flex items-center gap-3 p-3 rounded-xl text-sm"
          style={{
            background: statusMsg.type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
            border: `1px solid ${statusMsg.type === 'success' ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
            color: statusMsg.type === 'success' ? '#10b981' : '#ef4444',
          }}>
          {statusMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <XCircle className="w-4 h-4 flex-shrink-0" />}
          {statusMsg.text}
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-sm text-white">{t('connect.connectedStores')}</h2>
          <button onClick={connectAmazon} disabled={connecting}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold text-[#0a0612] transition-all"
            style={{ background: 'var(--accent-gradient)', opacity: connecting ? 0.7 : 1 }}>
            {connecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlusCircle className="w-4 h-4" />}
            {connecting ? 'جاري التوجيه...' : 'ربط حساب أمازون'}
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-7 h-7 animate-spin" style={{ color: 'var(--accent)' }} />
          </div>
        ) : connections.length === 0 ? (
          <div className="p-8 text-center" style={CARD}>
            <AlertCircle className="w-10 h-10 mx-auto mb-3" style={{ color: 'var(--text-dim)' }} />
            <p className="text-sm font-medium text-white mb-1">لم يتم ربط أي حساب بعد</p>
            <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>اضغط على "ربط حساب أمازون" للبدء</p>
            <button onClick={connectAmazon} disabled={connecting}
              className="flex items-center gap-2 mx-auto px-5 py-2 rounded-lg text-sm font-semibold text-[#0a0612]"
              style={{ background: 'var(--accent-gradient)' }}>
              {connecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Link2 className="w-4 h-4" />}
              ربط حساب أمازون
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {connections.map(conn => (
              <div key={conn.id} className="p-4" style={CARD}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(255,153,0,0.12)', border: '1px solid rgba(255,153,0,0.25)' }}>
                    <span className="text-lg">🛒</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-bold text-sm text-white">{conn.seller_name}</h3>
                      <span className="text-xs px-1.5 py-0.5 rounded flex items-center gap-1"
                        style={conn.is_active && !isExpired(conn.token_expires_at)
                          ? { background: 'rgba(16,185,129,0.12)', color: 'var(--success)', border: '1px solid rgba(16,185,129,0.25)' }
                          : { background: 'rgba(239,68,68,0.12)', color: 'var(--error)', border: '1px solid rgba(239,68,68,0.25)' }}>
                        {conn.is_active && !isExpired(conn.token_expires_at)
                          ? <><CheckCircle2 className="w-3 h-3" /> {t('connect.connected')}</>
                          : <><XCircle className="w-3 h-3" /> منتهي الصلاحية</>}
                      </span>
                    </div>
                    <p className="text-xs" style={{ color: 'var(--text-dim)' }}>{conn.marketplace}</p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <p className="text-xs" style={{ color: 'var(--text-dim)' }}>{t('connect.lastSync')}</p>
                    <p className="text-xs font-medium text-white">
                      {conn.last_synced_at ? new Date(conn.last_synced_at).toLocaleDateString('ar-SA') : 'لم تتم بعد'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {connections.length > 0 && (
        <div className="p-4 flex items-center justify-between" style={CARD}>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4" style={{ color: 'var(--success)' }} />
            <div>
              <p className="text-sm font-medium text-white">{t('connect.autoSync')}</p>
              <p className="text-xs" style={{ color: 'var(--text-dim)' }}>مزامنة الحملات والكلمات المفتاحية</p>
            </div>
          </div>
          <button onClick={syncNow} disabled={syncing}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-[#0a0612] transition-all"
            style={{ background: 'var(--accent-gradient)', opacity: syncing ? 0.7 : 1 }}>
            <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? t('connect.syncing') : t('connect.syncNow')}
          </button>
        </div>
      )}

      <div className="p-4" style={CARD}>
        <div className="flex items-center gap-2 mb-3">
          <Shield className="w-4 h-4" style={{ color: 'var(--success)' }} />
          <h3 className="font-bold text-sm text-white">{t('connect.security')}</h3>
        </div>
        <div className="space-y-2">
          {[t('connect.readData'), t('connect.manageCampaigns'), t('connect.accessReports')].map(p => (
            <div key={p} className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--success)' }} />
              <span style={{ color: 'var(--text-muted)' }}>{p}</span>
            </div>
          ))}
        </div>
      </div>

      {syncLogs.length > 0 && (
        <div style={{ ...CARD, overflow: 'hidden' }}>
          <div className="px-4 py-3 flex items-center gap-1.5" style={{ borderBottom: '1px solid var(--border-primary)' }}>
            <Clock className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
            <h3 className="font-bold text-sm text-white">{t('connect.syncHistory')}</h3>
          </div>
          <div>
            {syncLogs.map((h, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3"
                style={{ borderBottom: i < syncLogs.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
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
      )}
    </div>
  );
}
