import { useState } from 'react';
import { reportsData } from '@/data/mock';
import { FileText, Download } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

type Period = 'daily' | 'weekly' | 'monthly';

const CARD = { background: 'rgba(0,217,255,0.04)', border: '1px solid rgba(0,217,255,0.12)', borderRadius: '0.875rem' } as const;
const TICK = { fill: '#8a94a6', fontSize: 10 };
const GRID = 'rgba(0,217,255,0.08)';
const TT   = { background: '#0d1628', border: '1px solid rgba(0,217,255,0.2)', borderRadius: 8 };

export default function Reports() {
  const [period, setPeriod] = useState<Period>('daily');
  const data = reportsData[period];

  const download = () => {
    const csv = ['Period,Spend,Sales,ROAS,ACOS,Orders',
      ...data.map(d => `${d.date},${d.spend},${d.sales},${d.roas},${d.acos},${d.orders}`)
    ].join('\n');
    const link = document.createElement('a');
    link.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    link.download = `m20-report-${period}.csv`;
    link.click();
  };

  const totalSales   = data.reduce((s, d) => s + d.sales,  0);
  const totalSpend   = data.reduce((s, d) => s + d.spend,  0);
  const totalOrders  = data.reduce((s, d) => s + d.orders, 0);
  const avgRoas      = (data.reduce((s, d) => s + d.roas, 0) / data.length).toFixed(1);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5" style={{ color: '#00d9ff' }} /> Reports
          </h1>
          <p className="text-sm" style={{ color: '#8a94a6' }}>Performance & spend reports</p>
        </div>
        <button onClick={download}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
          style={{ border: '1px solid rgba(0,217,255,0.2)', color: '#00d9ff', background: 'rgba(0,217,255,0.05)' }}>
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* Period toggle */}
      <div className="flex items-center rounded-lg overflow-hidden text-sm w-fit"
        style={{ border: '1px solid rgba(0,217,255,0.15)' }}>
        {(['daily', 'weekly', 'monthly'] as Period[]).map(p => (
          <button key={p} onClick={() => setPeriod(p)}
            className="px-4 py-1.5 font-medium transition-colors"
            style={period === p ? { background: 'rgba(0,217,255,0.15)', color: '#00d9ff' } : { color: '#8a94a6' }}>
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>

      {/* KPI summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Sales',    value: `$${totalSales.toLocaleString()}`,  color: '#10b981' },
          { label: 'Total Spend',    value: `$${totalSpend.toLocaleString()}`,  color: '#e2e8f0' },
          { label: 'Avg ROAS',       value: avgRoas,                             color: '#10b981' },
          { label: 'Total Orders',   value: totalOrders.toLocaleString(),        color: '#e2e8f0' },
        ].map((k, i) => (
          <div key={i} className="p-4" style={CARD}>
            <p className="text-xs mb-1" style={{ color: '#8a94a6' }}>{k.label}</p>
            <p className="text-xl font-bold" style={{ color: k.color }}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Line Chart */}
      <div className="p-5" style={CARD}>
        <h3 className="font-bold text-sm mb-4 text-white">Sales & Spend</h3>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={GRID} />
            <XAxis dataKey="date" tick={TICK} />
            <YAxis tick={TICK} />
            <Tooltip contentStyle={TT} formatter={(v: number) => `$${v.toLocaleString()}`} />
            <Line type="monotone" dataKey="sales" stroke="#10b981" strokeWidth={2} dot={false} name="Sales" />
            <Line type="monotone" dataKey="spend" stroke="#00d9ff" strokeWidth={2} dot={false} name="Spend" strokeDasharray="4 2" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ROAS bar chart */}
      <div className="p-5" style={CARD}>
        <h3 className="font-bold text-sm mb-4 text-white">ROAS Over Time</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={GRID} />
            <XAxis dataKey="date" tick={TICK} />
            <YAxis tick={TICK} />
            <Tooltip contentStyle={TT} />
            <Bar dataKey="roas" fill="#00d9ff" radius={[3,3,0,0]} name="ROAS" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Table */}
      <div style={{ ...CARD, overflow: 'hidden' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead style={{ background: 'rgba(0,217,255,0.04)', borderBottom: '1px solid rgba(0,217,255,0.1)' }}>
              <tr>
                {['Period', 'Spend', 'Sales', 'ROAS', 'ACOS%', 'Orders'].map(h => (
                  <th key={h} className="text-left py-2.5 px-4 font-medium" style={{ color: '#8a94a6' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((d, i) => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(0,217,255,0.06)' }}>
                  <td className="py-3 px-4 font-medium text-white">{d.date}</td>
                  <td className="py-3 px-4 text-white">${d.spend.toLocaleString()}</td>
                  <td className="py-3 px-4 font-medium" style={{ color: '#10b981' }}>${d.sales.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <span className="font-bold" style={{ color: d.roas >= 4 ? '#10b981' : '#f59e0b' }}>{d.roas}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span style={{ color: d.acos <= 25 ? '#10b981' : '#f59e0b' }}>{d.acos}%</span>
                  </td>
                  <td className="py-3 px-4 text-white">{d.orders}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
