import { useState } from 'react';
import { products } from '@/data/mock';
import { Search, ShieldOff, X, Tag, AlertTriangle } from 'lucide-react';

const brands = ['All', ...Array.from(new Set(products.map(p => p.brand)))];

const CARD = { background: 'rgba(0,217,255,0.04)', border: '1px solid rgba(0,217,255,0.12)', borderRadius: '0.875rem' } as const;

const statusLabel: Record<string, string> = { active: 'Active', weak: 'Weak', poor: 'Poor' };
const statusStyle: Record<string, React.CSSProperties> = {
  active: { background: 'rgba(16,185,129,0.12)',  color: '#10b981', border: '1px solid rgba(16,185,129,0.25)'  },
  weak:   { background: 'rgba(245,158,11,0.12)',   color: '#f59e0b', border: '1px solid rgba(245,158,11,0.25)'  },
  poor:   { background: 'rgba(239,68,68,0.12)',    color: '#ef4444', border: '1px solid rgba(239,68,68,0.25)'   },
};

export default function Products() {
  const [search, setSearch]             = useState('');
  const [brandFilter, setBrandFilter]   = useState('All');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null);
  const [blacklisted, setBlacklisted]   = useState<number[]>([]);

  const filtered = products.filter(p => {
    if (blacklisted.includes(p.id)) return false;
    const ms  = p.name.toLowerCase().includes(search.toLowerCase()) || p.asin.includes(search);
    const mb  = brandFilter === 'All' || p.brand === brandFilter;
    const mst = statusFilter === 'all' || p.status === statusFilter;
    return ms && mb && mst;
  });

  const handleBlacklist = (id: number) => {
    setBlacklisted(prev => [...prev, id]);
    if (selectedProduct?.id === id) setSelectedProduct(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Products & Keywords</h1>
          <p className="text-sm" style={{ color: '#8a94a6' }}>{filtered.length} products</p>
        </div>
        <a href="/blacklist" className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg transition-colors"
          style={{ color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.05)' }}>
          <ShieldOff className="w-4 h-4" /> Blacklist ({blacklisted.length})
        </a>
      </div>

      {/* Filters */}
      <div className="p-3 flex flex-wrap gap-2 items-center" style={CARD}>
        <div className="flex items-center gap-2 rounded-lg px-3 py-1.5 flex-1 min-w-48"
          style={{ background: 'rgba(0,217,255,0.06)', border: '1px solid rgba(0,217,255,0.1)' }}>
          <Search className="w-4 h-4 flex-shrink-0" style={{ color: '#4a5568' }} />
          <input type="text" placeholder="Search by name or ASIN..." value={search} onChange={e => setSearch(e.target.value)}
            className="bg-transparent border-none outline-none text-sm w-full text-white placeholder-[#4a5568]" />
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs" style={{ color: '#8a94a6' }}>Brand:</span>
          <select value={brandFilter} onChange={e => setBrandFilter(e.target.value)}
            className="rounded-lg px-3 py-1.5 text-sm outline-none text-white"
            style={{ background: 'rgba(0,217,255,0.06)', border: '1px solid rgba(0,217,255,0.15)' }}>
            {brands.map(b => <option key={b}>{b}</option>)}
          </select>
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="rounded-lg px-3 py-1.5 text-sm outline-none text-white"
          style={{ background: 'rgba(0,217,255,0.06)', border: '1px solid rgba(0,217,255,0.15)' }}>
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="weak">Weak</option>
          <option value="poor">Poor</option>
        </select>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Table */}
        <div className={`${selectedProduct ? 'lg:col-span-2' : 'lg:col-span-3'}`}
          style={{ ...CARD, overflow: 'hidden' }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead style={{ background: 'rgba(0,217,255,0.04)', borderBottom: '1px solid rgba(0,217,255,0.1)' }}>
                <tr>
                  {['Product', 'ASIN', 'Sales', 'Profit', 'ACOS', 'Status', 'Action'].map(h => (
                    <th key={h} className="text-left py-2.5 px-3 font-medium" style={{ color: '#8a94a6' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id}
                    onClick={() => setSelectedProduct(selectedProduct?.id === p.id ? null : p)}
                    className="cursor-pointer transition-colors"
                    style={{
                      borderBottom: '1px solid rgba(0,217,255,0.06)',
                      background: selectedProduct?.id === p.id ? 'rgba(0,217,255,0.05)' : 'transparent',
                    }}
                    onMouseEnter={e => { if (selectedProduct?.id !== p.id) (e.currentTarget as HTMLTableRowElement).style.background = 'rgba(0,217,255,0.03)'; }}
                    onMouseLeave={e => { if (selectedProduct?.id !== p.id) (e.currentTarget as HTMLTableRowElement).style.background = 'transparent'; }}>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0 text-xs font-bold"
                          style={{ background: 'rgba(0,217,255,0.1)', color: '#00d9ff' }}>
                          {p.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-white leading-snug" style={{ maxWidth: selectedProduct ? '200px' : '280px' }}>
                            {p.name}
                          </p>
                          <p className="text-xs" style={{ color: '#4a5568' }}>{p.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono text-xs" style={{ color: '#4a5568' }}>{p.asin}</td>
                    <td className="py-3 px-3 font-medium" style={{ color: '#10b981' }}>${p.sales.toLocaleString()}</td>
                    <td className="py-3 px-3 font-medium" style={{ color: p.profit > 0 ? '#10b981' : '#ef4444' }}>${p.profit.toLocaleString()}</td>
                    <td className="py-3 px-3">
                      <span style={{ color: p.acos <= 25 ? '#10b981' : p.acos <= 35 ? '#f59e0b' : '#ef4444' }}>{p.acos}%</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                        style={statusStyle[p.status]}>{statusLabel[p.status]}</span>
                    </td>
                    <td className="py-3 px-3">
                      <button onClick={e => { e.stopPropagation(); handleBlacklist(p.id); }}
                        className="flex items-center gap-1 text-xs px-2 py-1 rounded transition-colors"
                        style={{ color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.05)' }}>
                        <ShieldOff className="w-3 h-3" /> Exclude
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail panel */}
        {selectedProduct && (
          <div className="p-4 sticky top-6 self-start" style={CARD}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm text-white">Product Details</h3>
              <button onClick={() => setSelectedProduct(null)} className="p-1 rounded"
                style={{ color: '#4a5568' }}>
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-xs mb-1" style={{ color: '#8a94a6' }}>Product Name</p>
                <p className="text-sm font-medium text-white leading-snug">{selectedProduct.name}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Sales',  value: `$${selectedProduct.sales.toLocaleString()}`,  color: '#10b981' },
                  { label: 'Profit', value: `$${selectedProduct.profit.toLocaleString()}`, color: selectedProduct.profit > 0 ? '#10b981' : '#ef4444' },
                  { label: 'Cost',   value: `$${selectedProduct.cost.toLocaleString()}`,   color: '#e2e8f0' },
                  { label: 'Units',  value: String(selectedProduct.units),                  color: '#e2e8f0' },
                ].map(item => (
                  <div key={item.label} className="p-2 rounded" style={{ background: 'rgba(0,217,255,0.06)' }}>
                    <p className="text-[10px]" style={{ color: '#8a94a6' }}>{item.label}</p>
                    <p className="font-bold text-sm" style={{ color: item.color }}>{item.value}</p>
                  </div>
                ))}
              </div>

              <div>
                <p className="text-xs font-medium mb-1.5 flex items-center gap-1" style={{ color: '#00d9ff' }}>
                  <Tag className="w-3 h-3" /> Keywords
                </p>
                <div className="flex flex-wrap gap-1">
                  {selectedProduct.keywords.length > 0 ? selectedProduct.keywords.map((kw, i) => (
                    <span key={i} className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(0,217,255,0.08)', color: '#00d9ff', border: '1px solid rgba(0,217,255,0.2)' }}>{kw}</span>
                  )) : <span className="text-xs" style={{ color: '#4a5568' }}>None</span>}
                </div>
              </div>

              {selectedProduct.negKeywords.length > 0 && (
                <div>
                  <p className="text-xs font-medium mb-1.5 flex items-center gap-1" style={{ color: '#ef4444' }}>
                    <AlertTriangle className="w-3 h-3" /> Negative Keywords
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {selectedProduct.negKeywords.map((kw, i) => (
                      <span key={i} className="text-xs px-2 py-0.5 rounded-full"
                        style={{ background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>{kw}</span>
                    ))}
                  </div>
                </div>
              )}

              <button onClick={() => handleBlacklist(selectedProduct.id)}
                className="w-full flex items-center justify-center gap-1.5 text-sm py-2 rounded-lg transition-colors"
                style={{ color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.05)' }}>
                <ShieldOff className="w-4 h-4" /> Move to Blacklist
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
