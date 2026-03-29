import { useState } from 'react';
import { campaigns } from '@/data/mock';
import { Search, ChevronUp, ChevronDown } from 'lucide-react';

type SortKey = 'spend' | 'sales' | 'roas' | 'acos' | 'ctr';

const CARD = { background: 'rgba(0,217,255,0.04)', border: '1px solid rgba(0,217,255,0.12)', borderRadius: '0.875rem' } as const;

export default function Campaigns() {
  const [search, setSearch]           = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter]   = useState('all');
  const [sortKey, setSortKey]         = useState<SortKey>('sales');
  const [sortDir, setSortDir]         = useState<'asc' | 'desc'>('desc');

  const types = ['all', ...Array.from(new Set(campaigns.map(c => c.type)))];

  const filtered = campaigns
    .filter(c => {
      const ms  = c.name.toLowerCase().includes(search.toLowerCase());
      const mst = statusFilter === 'all' || c.status === statusFilter;
      const mt  = typeFilter === 'all' || c.type === typeFilter;
      return ms && mst && mt;
    })
    .sort((a, b) => sortDir === 'desc' ? b[sortKey] - a[sortKey] : a[sortKey] - b[sortKey]);

  const toggleSort = (k: SortKey) => {
    if (sortKey === k) setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    else { setSortKey(k); setSortDir('desc'); }
  };

  const Th = ({ label, k }: { label: string; k: SortKey }) => (
    <th className="text-left py-2.5 px-3 font-medium cursor-pointer whitespace-nowrap"
      style={{ color: '#8a94a6' }}
      onClick={() => toggleSort(k)}>
      <div className="flex items-center gap-1">
        {label}
        {sortKey === k
          ? (sortDir === 'desc' ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />)
          : <ChevronDown className="w-3 h-3 opacity-30" />}
      </div>
    </th>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Campaigns</h1>
          <p className="text-sm" style={{ color: '#8a94a6' }}>{filtered.length} campaigns</p>
        </div>
      </div>

      {/* Filters */}
      <div className="p-3 flex flex-wrap gap-2" style={CARD}>
        <div className="flex items-center gap-2 rounded-lg px-3 py-1.5 flex-1 min-w-48"
          style={{ background: 'rgba(0,217,255,0.06)', border: '1px solid rgba(0,217,255,0.1)' }}>
          <Search className="w-4 h-4 flex-shrink-0" style={{ color: '#4a5568' }} />
          <input type="text" placeholder="Search campaigns..." value={search} onChange={e => setSearch(e.target.value)}
            className="bg-transparent border-none outline-none text-sm w-full text-white placeholder-[#4a5568]" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="rounded-lg px-3 py-1.5 text-sm outline-none text-white"
          style={{ background: 'rgba(0,217,255,0.06)', border: '1px solid rgba(0,217,255,0.15)' }}>
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
        </select>
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
          className="rounded-lg px-3 py-1.5 text-sm outline-none text-white"
          style={{ background: 'rgba(0,217,255,0.06)', border: '1px solid rgba(0,217,255,0.15)' }}>
          {types.map(t => <option key={t} value={t}>{t === 'all' ? 'All Types' : t}</option>)}
        </select>
      </div>

      {/* Table */}
      <div style={{ ...CARD, overflow: 'hidden' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead style={{ background: 'rgba(0,217,255,0.04)', borderBottom: '1px solid rgba(0,217,255,0.1)' }}>
              <tr>
                <th className="text-left py-2.5 px-3 font-medium" style={{ color: '#8a94a6' }}>Campaign</th>
                <th className="text-left py-2.5 px-3 font-medium" style={{ color: '#8a94a6' }}>Status</th>
                <th className="text-left py-2.5 px-3 font-medium" style={{ color: '#8a94a6' }}>Budget</th>
                <Th label="Spend"  k="spend" />
                <Th label="Sales"  k="sales" />
                <Th label="ROAS"   k="roas"  />
                <Th label="ACOS"   k="acos"  />
                <Th label="CTR"    k="ctr"   />
                <th className="text-left py-2.5 px-3 font-medium" style={{ color: '#8a94a6' }}>Clicks</th>
                <th className="text-left py-2.5 px-3 font-medium" style={{ color: '#8a94a6' }}>Orders</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id}
                  className="transition-colors"
                  style={{ borderBottom: '1px solid rgba(0,217,255,0.06)' }}
                  onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = 'rgba(0,217,255,0.03)'}
                  onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = 'transparent'}>
                  <td className="py-3 px-3">
                    <p className="font-medium text-white">{c.name}</p>
                    <p className="text-xs" style={{ color: '#4a5568' }}>{c.type}</p>
                  </td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                      style={c.status === 'active'
                        ? { background: 'rgba(16,185,129,0.12)', color: '#10b981', border: '1px solid rgba(16,185,129,0.25)' }
                        : { background: 'rgba(100,116,139,0.12)', color: '#64748b', border: '1px solid rgba(100,116,139,0.25)' }}>
                      {c.status === 'active' ? '● Active' : '○ Paused'}
                    </span>
                  </td>
                  <td className="py-3 px-3" style={{ color: '#a0aec0' }}>${c.budget.toLocaleString()}</td>
                  <td className="py-3 px-3 text-white">${c.spend.toLocaleString()}</td>
                  <td className="py-3 px-3 font-medium" style={{ color: '#10b981' }}>${c.sales.toLocaleString()}</td>
                  <td className="py-3 px-3">
                    <span className="font-bold" style={{ color: c.roas >= 4 ? '#10b981' : c.roas >= 2 ? '#f59e0b' : '#ef4444' }}>{c.roas}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span style={{ color: c.acos <= 25 ? '#10b981' : c.acos <= 40 ? '#f59e0b' : '#ef4444' }}>{c.acos}%</span>
                  </td>
                  <td className="py-3 px-3 text-white">{c.ctr}%</td>
                  <td className="py-3 px-3 text-white">{c.clicks.toLocaleString()}</td>
                  <td className="py-3 px-3 text-white">{c.orders}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12" style={{ color: '#4a5568' }}>
            <p>No campaigns match your search</p>
          </div>
        )}
      </div>
    </div>
  );
}
