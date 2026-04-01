import { useState } from 'react';
import { accounting } from '@/data/mock';
import { Calculator, TrendingUp, DollarSign, Package, Bot } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useI18n } from '@/lib/i18n';

const CARD = { background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '0.875rem', boxShadow: 'var(--card-shadow)' } as const;
const TICK = { fill: 'var(--text-muted)', fontSize: 10 };
const GRID_STROKE = 'var(--accent-bg)';
const CUR = 'SAR';

export default function Accounting() {
  const { t } = useI18n();
  const [view, setView] = useState<'overview' | 'daily' | 'byProduct'>('overview');
  const s = accounting.summary;

  const tabs = [
    { k: 'overview',  label: t('accounting.overview') },
    { k: 'daily',     label: t('accounting.daily') },
    { k: 'byProduct', label: t('accounting.byProduct') },
  ] as const;

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
          <p className="text-xl font-bold" style={{ color: 'var(--success)' }}>{s.revenue.toLocaleString()} {CUR}</p>
        </div>
        <div className="p-4" style={CARD}>
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4" style={{ color: 'var(--error)' }} />
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{t('dash.adSpend')}</span>
          </div>
          <p className="text-xl font-bold text-white">{s.adSpend.toLocaleString()} {CUR}</p>
        </div>
        <div className="p-4" style={CARD}>
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-4 h-4" style={{ color: 'var(--accent)' }} />
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{t('accounting.productCost')}</span>
          </div>
          <p className="text-xl font-bold text-white">{s.productCost.toLocaleString()} {CUR}</p>
        </div>
        <div className="p-4" style={{ ...CARD, border: '1px solid rgba(16,185,129,0.25)', background: 'rgba(16,185,129,0.05)' }}>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4" style={{ color: 'var(--success)' }} />
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{t('accounting.netProfit')}</span>
          </div>
          <p className="text-2xl font-bold" style={{ color: 'var(--success)' }}>{s.profit.toLocaleString()} {CUR}</p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--success)' }}>{t('accounting.margin')} {s.profitMargin}%</p>
        </div>
        <div className="p-4" style={CARD}>
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{t('dash.unitsSold')}</span>
          </div>
          <p className="text-xl font-bold text-white">{s.unitsSold.toLocaleString()}</p>
        </div>
        <div className="p-4" style={{ ...CARD, background: 'var(--hover-bg)' }}>
          <div className="flex items-center gap-2 mb-2">
            <Bot className="w-4 h-4" style={{ color: 'var(--accent)' }} />
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{t('accounting.aiInsight')}</span>
          </div>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>Profit margin is healthy. Cordless Vacuum ad spend is not profitable — consider pausing.</p>
        </div>
      </div>

      {view === 'daily' && (
        <div className="p-5" style={CARD}>
          <h3 className="font-bold text-sm mb-4 text-white">{t('accounting.dailyPerformance')}</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={accounting.daily} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
              <XAxis dataKey="date" tick={TICK} />
              <YAxis tick={TICK} />
              <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--accent-border)', borderRadius: 8 }} formatter={(v: number) => `${v.toLocaleString()} ${CUR}`} />
              <Bar dataKey="revenue"  fill="#10b981" radius={[3,3,0,0]} name={t('accounting.revenue')}      />
              <Bar dataKey="adSpend"  fill="#ef4444" radius={[3,3,0,0]} name={t('dash.adSpend')}     />
              <Bar dataKey="profit"   fill="var(--accent)" radius={[3,3,0,0]} name={t('accounting.netProfit')}   />
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
                {accounting.daily.map((d, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td className="py-3 px-4 font-medium text-white">{d.date}</td>
                    <td className="py-3 px-4 font-medium" style={{ color: 'var(--success)' }}>{d.revenue.toLocaleString()} {CUR}</td>
                    <td className="py-3 px-4 text-white">{d.adSpend.toLocaleString()} {CUR}</td>
                    <td className="py-3 px-4 text-white">{d.productCost.toLocaleString()} {CUR}</td>
                    <td className="py-3 px-4 font-bold" style={{ color: 'var(--success)' }}>{d.profit.toLocaleString()} {CUR}</td>
                    <td className="py-3 px-4 text-white">{d.orders}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {view === 'byProduct' && (
        <div style={{ ...CARD, overflow: 'hidden' }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead style={{ background: 'var(--card-bg)', borderBottom: '1px solid var(--border-primary)' }}>
                <tr>
                  {[t('dash.product'), t('accounting.revenue'), t('dash.adSpend'), t('accounting.productCost'), t('accounting.netProfit'), t('dash.units')].map(h => (
                    <th key={h} className="text-left py-2.5 px-4 font-medium" style={{ color: 'var(--text-muted)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {accounting.byProduct.map((p, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td className="py-3 px-4 font-medium text-white">{p.name}</td>
                    <td className="py-3 px-4 font-medium" style={{ color: 'var(--success)' }}>{p.revenue.toLocaleString()} {CUR}</td>
                    <td className="py-3 px-4 text-white">{p.adSpend.toLocaleString()} {CUR}</td>
                    <td className="py-3 px-4 text-white">{p.productCost.toLocaleString()} {CUR}</td>
                    <td className="py-3 px-4 font-bold" style={{ color: 'var(--success)' }}>{p.profit.toLocaleString()} {CUR}</td>
                    <td className="py-3 px-4 text-white">{p.units}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {view === 'overview' && (
        <div className="p-5" style={CARD}>
          <h3 className="font-bold text-sm mb-4 text-white">{t('accounting.productProfit')}</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={accounting.byProduct} layout="vertical" margin={{ top: 5, right: 30, left: 130, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
              <XAxis type="number" tick={TICK} />
              <YAxis type="category" dataKey="name" tick={TICK} width={130}
                tickFormatter={v => v.length > 18 ? v.slice(0, 18) + '...' : v} />
              <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--accent-border)', borderRadius: 8 }} formatter={(v: number) => `${v.toLocaleString()} ${CUR}`} />
              <Bar dataKey="profit" fill="var(--accent)" radius={[0,3,3,0]} name={t('accounting.netProfit')} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
