import { useState, useEffect, useCallback } from 'react';
import { Calculator, TrendingUp, DollarSign, Package, Bot, Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useI18n } from '@/lib/i18n';
import { useAuth, authFetch } from '@/lib/useAuth';

const CARD = { background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '0.875rem', boxShadow: 'var(--card-shadow)' } as const;
const TICK = { fill: 'var(--text-muted)', fontSize: 10 };
const GRID_STROKE = 'var(--accent-bg)';
const CUR = 'SAR';

interface Snapshot { date: string; revenue: number; ad_spend: number; cogs: number; gross_profit: number; net_profit: number; acos: number; roas: number; orders: number; units: number; }
interface Totals { revenue: number; ad_spend: number; cogs: number; gross_profit: number; net_profit: number; orders: number; units: number; acos: number; roas: number; }

export default function Accounting() {
  const { t } = useI18n();
  const { token } = useAuth();
  const af = authFetch(token);
  const [view, setView] = useState<'overview' | 'daily' | 'byProduct'>('overview');
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [totals, setTotals] = useState<Totals | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const res = await af('/api/accounting');
      const data = await res.json();
      if (res.ok) {
        setSnapshots(data.snapshots ?? []);
        setTotals(data.totals ?? null);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { if (token) fetchData(); else setLoading(false); }, [token]);

  const tabs = [
    { k: 'overview', label: t('accounting.overview') },
    { k: 'daily', label: t('accounting.daily') },
    { k: 'byProduct', label: t('accounting.byProduct') },
  ] as const;

  const profitMargin = totals && totals.revenue > 0 ? Math.round((totals.net_profit / totals.revenue) * 100) : 0;
  const chartData = [...snapshots].reverse();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--accent)' }} />
      </div>
    );
  }

  const s = totals ?? { revenue: 0, ad_spend: 0, cogs: 0, gross_profit: 0, net_profit: 0, orders: 0, units: 0, acos: 0, roas: 0 };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Calculator className="w-5 h-5" style={{ color: 'var(--accent)' }} /> {t('accounting.title')}
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{t('accounting.subtitle')}</p>
        </div>
        <div className="flex items-center rounded-lg overflow-hidden text-sm" style={{ border: '1px solid var(--input-border)' }}>
          {tabs.map(tb => (
            <button key={tb.k} onClick={() => setView(tb.k)}
              className="px-3 py-1.5 font-medium transition-colors"
              style={view === tb.k
                ? { background: 'var(--accent-bg-strong)', color: 'var(--accent)' }
                : { color: 'var(--text-muted)' }}>
              {tb.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <div className="p-4" style={CARD}>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4" style={{ color: 'var(--success)' }} />
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{t('accounting.revenue')}</span>
          </div>
          <p className="text-xl font-bold" style={{ color: 'var(--success)' }}>{Math.round(s.revenue).toLocaleString()} {CUR}</p>
        </div>
        <div className="p-4" style={CARD}>
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4" style={{ color: 'var(--error)' }} />
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{t('dash.adSpend')}</span>
          </div>
          <p className="text-xl font-bold text-white">{Math.round(s.ad_spend).toLocaleString()} {CUR}</p>
        </div>
        <div className="p-4" style={CARD}>
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-4 h-4" style={{ color: 'var(--accent)' }} />
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{t('accounting.productCost')}</span>
          </div>
          <p className="text-xl font-bold text-white">{Math.round(s.cogs).toLocaleString()} {CUR}</p>
        </div>
        <div className="p-4" style={{ ...CARD, border: '1px solid rgba(16,185,129,0.25)', background: 'rgba(16,185,129,0.05)' }}>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4" style={{ color: 'var(--success)' }} />
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{t('accounting.netProfit')}</span>
          </div>
          <p className="text-2xl font-bold" style={{ color: 'var(--success)' }}>{Math.round(s.net_profit).toLocaleString()} {CUR}</p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--success)' }}>{t('accounting.margin')} {profitMargin}%</p>
        </div>
        <div className="p-4" style={CARD}>
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{t('dash.unitsSold')}</span>
          </div>
          <p className="text-xl font-bold text-white">{Math.round(s.units).toLocaleString()}</p>
        </div>
        <div className="p-4" style={{ ...CARD, background: 'var(--hover-bg)' }}>
          <div className="flex items-center gap-2 mb-2">
            <Bot className="w-4 h-4" style={{ color: 'var(--accent)' }} />
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{t('accounting.aiInsight')}</span>
          </div>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>ACOS {Math.round(s.acos)}% - ROAS {s.roas.toFixed(1)}x</p>
        </div>
      </div>

      {view === 'daily' && (
        <div className="p-5" style={CARD}>
          <h3 className="font-bold text-sm mb-4 text-white">{t('accounting.dailyPerformance')}</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
              <XAxis dataKey="date" tick={TICK} />
              <YAxis tick={TICK} />
              <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--accent-border)', borderRadius: 8 }} formatter={(v: number) => `${v.toLocaleString()} ${CUR}`} />
              <Bar dataKey="revenue" fill="#10b981" radius={[3,3,0,0]} name={t('accounting.revenue')} />
              <Bar dataKey="ad_spend" fill="#ef4444" radius={[3,3,0,0]} name={t('dash.adSpend')} />
              <Bar dataKey="net_profit" fill="var(--accent)" radius={[3,3,0,0]} name={t('accounting.netProfit')} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {view === 'daily' && (
        <div style={{ ...CARD, overflow: 'hidden' }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead style={{ background: 'var(--card-bg)', borderBottom: '1px solid var(--border-primary)' }}>
                <tr>
                  {[t('accounting.date'), t('accounting.revenue'), t('dash.adSpend'), t('accounting.productCost'), t('accounting.netProfit'), t('dash.orders')].map(h => (
                    <th key={h} className="text-left py-2.5 px-4 font-medium" style={{ color: 'var(--text-muted)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {snapshots.map((d, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td className="py-3 px-4 font-medium text-white">{d.date}</td>
                    <td className="py-3 px-4 font-medium" style={{ color: 'var(--success)' }}>{Math.round(d.revenue).toLocaleString()} {CUR}</td>
                    <td className="py-3 px-4 text-white">{Math.round(d.ad_spend).toLocaleString()} {CUR}</td>
                    <td className="py-3 px-4 text-white">{Math.round(d.cogs).toLocaleString()} {CUR}</td>
                    <td className="py-3 px-4 font-bold" style={{ color: 'var(--success)' }}>{Math.round(d.net_profit).toLocaleString()} {CUR}</td>
                    <td className="py-3 px-4 text-white">{d.orders}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {snapshots.length === 0 && (
            <div className="text-center py-12" style={{ color: 'var(--text-dim)' }}>{t('accounting.subtitle')}</div>
          )}
        </div>
      )}

      {view === 'byProduct' && (
        <div className="p-12 text-center" style={CARD}>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{t('accounting.byProduct')} - {t('campaigns.noCampaigns')}</p>
        </div>
      )}

      {view === 'overview' && (
        <div className="p-5" style={CARD}>
          <h3 className="font-bold text-sm mb-4 text-white">{t('accounting.dailyPerformance')}</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData} margin={{ top: 5, right: 30, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
              <XAxis dataKey="date" tick={TICK} />
              <YAxis tick={TICK} />
              <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--accent-border)', borderRadius: 8 }} formatter={(v: number) => `${v.toLocaleString()} ${CUR}`} />
              <Bar dataKey="net_profit" fill="var(--accent)" radius={[3,3,0,0]} name={t('accounting.netProfit')} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
