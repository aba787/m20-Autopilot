import { useState } from 'react';
import { accounting } from '@/data/mock';
import { Calculator, TrendingUp, DollarSign, Package, Bot } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CARD = { background: 'rgba(0,217,255,0.04)', border: '1px solid rgba(0,217,255,0.12)', borderRadius: '0.875rem' } as const;
const TICK = { fill: '#8a94a6', fontSize: 10 };
const GRID_STROKE = 'rgba(0,217,255,0.08)';

export default function Accounting() {
  const [view, setView] = useState<'overview' | 'daily' | 'byProduct'>('overview');
  const s = accounting.summary;

  const tabs = [
    { k: 'overview', label: 'Overview' },
    { k: 'daily',    label: 'Daily'    },
    { k: 'byProduct',label: 'By Product'},
  ] as const;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Calculator className="w-5 h-5" style={{ color: '#00d9ff' }} /> Accounting
          </h1>
          <p className="text-sm" style={{ color: '#8a94a6' }}>Revenue, costs, and profit analysis</p>
        </div>
        <div className="flex items-center rounded-lg overflow-hidden text-sm" style={{ border: '1px solid rgba(0,217,255,0.15)' }}>
          {tabs.map(t => (
            <button key={t.k} onClick={() => setView(t.k)}
              className="px-3 py-1.5 font-medium transition-colors"
              style={view === t.k
                ? { background: 'rgba(0,217,255,0.15)', color: '#00d9ff' }
                : { color: '#8a94a6' }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <div className="p-4" style={CARD}>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4" style={{ color: '#10b981' }} />
            <span className="text-xs" style={{ color: '#8a94a6' }}>Revenue</span>
          </div>
          <p className="text-xl font-bold" style={{ color: '#10b981' }}>${s.revenue.toLocaleString()}</p>
        </div>
        <div className="p-4" style={CARD}>
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4" style={{ color: '#ef4444' }} />
            <span className="text-xs" style={{ color: '#8a94a6' }}>Ad Spend</span>
          </div>
          <p className="text-xl font-bold text-white">${s.adSpend.toLocaleString()}</p>
        </div>
        <div className="p-4" style={CARD}>
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-4 h-4" style={{ color: '#00d9ff' }} />
            <span className="text-xs" style={{ color: '#8a94a6' }}>Product Cost</span>
          </div>
          <p className="text-xl font-bold text-white">${s.productCost.toLocaleString()}</p>
        </div>
        <div className="p-4" style={{ ...CARD, border: '1px solid rgba(16,185,129,0.25)', background: 'rgba(16,185,129,0.05)' }}>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4" style={{ color: '#10b981' }} />
            <span className="text-xs" style={{ color: '#8a94a6' }}>Net Profit</span>
          </div>
          <p className="text-2xl font-bold" style={{ color: '#10b981' }}>${s.profit.toLocaleString()}</p>
          <p className="text-xs mt-0.5" style={{ color: '#10b981' }}>Margin {s.profitMargin}%</p>
        </div>
        <div className="p-4" style={CARD}>
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-4 h-4" style={{ color: '#8a94a6' }} />
            <span className="text-xs" style={{ color: '#8a94a6' }}>Units Sold</span>
          </div>
          <p className="text-xl font-bold text-white">{s.unitsSold.toLocaleString()}</p>
        </div>
        <div className="p-4" style={{ ...CARD, background: 'rgba(0,217,255,0.03)' }}>
          <div className="flex items-center gap-2 mb-2">
            <Bot className="w-4 h-4" style={{ color: '#00d9ff' }} />
            <span className="text-xs" style={{ color: '#8a94a6' }}>AI Insight</span>
          </div>
          <p className="text-xs leading-relaxed" style={{ color: '#a0aec0' }}>Profit margin is healthy. Cordless Vacuum ad spend is not profitable — consider pausing.</p>
        </div>
      </div>

      {/* Daily bar chart */}
      {view === 'daily' && (
        <div className="p-5" style={CARD}>
          <h3 className="font-bold text-sm mb-4 text-white">Daily Performance</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={accounting.daily} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
              <XAxis dataKey="date" tick={TICK} />
              <YAxis tick={TICK} />
              <Tooltip contentStyle={{ background: '#0d1628', border: '1px solid rgba(0,217,255,0.2)', borderRadius: 8 }} formatter={(v: number) => `$${v.toLocaleString()}`} />
              <Bar dataKey="revenue"  fill="#10b981" radius={[3,3,0,0]} name="Revenue"      />
              <Bar dataKey="adSpend"  fill="#ef4444" radius={[3,3,0,0]} name="Ad Spend"     />
              <Bar dataKey="profit"   fill="#00d9ff" radius={[3,3,0,0]} name="Net Profit"   />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Daily table */}
      {view === 'daily' && (
        <div style={{ ...CARD, overflow: 'hidden' }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead style={{ background: 'rgba(0,217,255,0.04)', borderBottom: '1px solid rgba(0,217,255,0.1)' }}>
                <tr>
                  {['Date', 'Revenue', 'Ad Spend', 'Product Cost', 'Net Profit', 'Orders'].map(h => (
                    <th key={h} className="text-left py-2.5 px-4 font-medium" style={{ color: '#8a94a6' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {accounting.daily.map((d, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(0,217,255,0.06)' }}>
                    <td className="py-3 px-4 font-medium text-white">{d.date}</td>
                    <td className="py-3 px-4 font-medium" style={{ color: '#10b981' }}>${d.revenue.toLocaleString()}</td>
                    <td className="py-3 px-4 text-white">${d.adSpend.toLocaleString()}</td>
                    <td className="py-3 px-4 text-white">${d.productCost.toLocaleString()}</td>
                    <td className="py-3 px-4 font-bold" style={{ color: '#10b981' }}>${d.profit.toLocaleString()}</td>
                    <td className="py-3 px-4 text-white">{d.orders}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* By Product table */}
      {view === 'byProduct' && (
        <div style={{ ...CARD, overflow: 'hidden' }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead style={{ background: 'rgba(0,217,255,0.04)', borderBottom: '1px solid rgba(0,217,255,0.1)' }}>
                <tr>
                  {['Product', 'Revenue', 'Ad Spend', 'Product Cost', 'Net Profit', 'Units'].map(h => (
                    <th key={h} className="text-left py-2.5 px-4 font-medium" style={{ color: '#8a94a6' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {accounting.byProduct.map((p, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(0,217,255,0.06)' }}>
                    <td className="py-3 px-4 font-medium text-white">{p.name}</td>
                    <td className="py-3 px-4 font-medium" style={{ color: '#10b981' }}>${p.revenue.toLocaleString()}</td>
                    <td className="py-3 px-4 text-white">${p.adSpend.toLocaleString()}</td>
                    <td className="py-3 px-4 text-white">${p.productCost.toLocaleString()}</td>
                    <td className="py-3 px-4 font-bold" style={{ color: '#10b981' }}>${p.profit.toLocaleString()}</td>
                    <td className="py-3 px-4 text-white">{p.units}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Overview chart */}
      {view === 'overview' && (
        <div className="p-5" style={CARD}>
          <h3 className="font-bold text-sm mb-4 text-white">Product Profit</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={accounting.byProduct} layout="vertical" margin={{ top: 5, right: 30, left: 130, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
              <XAxis type="number" tick={TICK} />
              <YAxis type="category" dataKey="name" tick={TICK} width={130}
                tickFormatter={v => v.length > 18 ? v.slice(0, 18) + '...' : v} />
              <Tooltip contentStyle={{ background: '#0d1628', border: '1px solid rgba(0,217,255,0.2)', borderRadius: 8 }} formatter={(v: number) => `$${v.toLocaleString()}`} />
              <Bar dataKey="profit" fill="#00d9ff" radius={[0,3,3,0]} name="Net Profit" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
