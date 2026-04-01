import { useState } from 'react';
import { products } from '@/data/mock';
import { Search, ShieldOff, X, Tag, AlertTriangle } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

const brands = ['All', ...Array.from(new Set(products.map(p => p.brand)))];

const CARD = { background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '0.875rem', boxShadow: 'var(--card-shadow)' } as const;

const statusStyle: Record<string, React.CSSProperties> = {
  active: { background: 'rgba(16,185,129,0.12)',  color: 'var(--success)', border: '1px solid rgba(16,185,129,0.25)'  },
  weak:   { background: 'rgba(245,158,11,0.12)',   color: 'var(--warning)', border: '1px solid rgba(245,158,11,0.25)'  },
  poor:   { background: 'rgba(239,68,68,0.12)',    color: 'var(--error)', border: '1px solid rgba(239,68,68,0.25)'   },
};

export default function Products() {
  const { t } = useI18n();
  const [search, setSearch]             = useState('');
  const [brandFilter, setBrandFilter]   = useState('All');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null);
  const [blacklisted, setBlacklisted]   = useState<number[]>([]);

  const statusLabel: Record<string, string> = {
    active: t('products.active'),
    weak: t('products.weak'),
    poor: t('products.poor'),
  };

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
          <h1 className="text-2xl font-bold text-white">{t('products.title')}</h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{filtered.length} {t('dash.product').toLowerCase()}</p>
        </div>
        <a href="/blacklist" className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg transition-colors"
          style={{ color: 'var(--error)', border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.05)' }}>
          <ShieldOff className="w-4 h-4" /> {t('nav.blacklist')} ({blacklisted.length})
        </a>
      </div>

      <div className="p-3 flex flex-wrap gap-2 items-center" style={CARD}>
        <div className="flex items-center gap-2 rounded-lg px-3 py-1.5 flex-1 min-w-48"
          style={{ background: 'var(--input-bg)', border: '1px solid var(--border-primary)' }}>
          <Search className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--text-dim)' }} />
          <input type="text" placeholder={t('products.search')} value={search} onChange={e => setSearch(e.target.value)}
            className="bg-transparent border-none outline-none text-sm w-full text-white placeholder-[#4a5568]" />
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{t('products.brand')}</span>
          <select value={brandFilter} onChange={e => setBrandFilter(e.target.value)}
            className="rounded-lg px-3 py-1.5 text-sm outline-none text-white"
            style={{ background: 'var(--input-bg)', border: '1px solid var(--input-border)' }}>
            {brands.map(b => <option key={b}>{b}</option>)}
          </select>
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="rounded-lg px-3 py-1.5 text-sm outline-none text-white"
          style={{ background: 'var(--input-bg)', border: '1px solid var(--input-border)' }}>
          <option value="all">{t('products.allStatus')}</option>
          <option value="active">{t('products.active')}</option>
          <option value="weak">{t('products.weak')}</option>
          <option value="poor">{t('products.poor')}</option>
        </select>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className={`${selectedProduct ? 'lg:col-span-2' : 'lg:col-span-3'}`}
          style={{ ...CARD, overflow: 'hidden' }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead style={{ background: 'var(--card-bg)', borderBottom: '1px solid var(--border-primary)' }}>
                <tr>
                  {[t('dash.product'), 'ASIN', t('dash.sales'), t('dash.spend'), t('dash.profit'), t('dash.acos'), 'TACoS', t('products.allStatus').replace('كل الحالات', 'Status').replace('All Status', 'Status'), 'Action'].map(h => (
                    <th key={h} className="text-left py-2.5 px-3 font-semibold text-sm" style={{ color: 'var(--text-muted)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id}
                    onClick={() => setSelectedProduct(selectedProduct?.id === p.id ? null : p)}
                    className="cursor-pointer transition-colors"
                    style={{
                      borderBottom: '1px solid var(--border-subtle)',
                      background: selectedProduct?.id === p.id ? 'var(--hover-bg)' : 'transparent',
                    }}
                    onMouseEnter={e => { if (selectedProduct?.id !== p.id) (e.currentTarget as HTMLTableRowElement).style.background = 'var(--hover-bg)'; }}
                    onMouseLeave={e => { if (selectedProduct?.id !== p.id) (e.currentTarget as HTMLTableRowElement).style.background = 'transparent'; }}>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <img src={p.image} alt={p.name}
                          className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                          onError={(e) => {
                            const el = e.target as HTMLImageElement;
                            el.style.display = 'none';
                            const fallback = el.nextElementSibling as HTMLElement;
                            if (fallback) fallback.style.display = 'flex';
                          }} />
                        <div className="w-10 h-10 rounded-lg items-center justify-center flex-shrink-0 text-xs font-bold hidden"
                          style={{ background: 'var(--accent-bg-strong)', color: 'var(--accent)' }}>
                          {p.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-white leading-snug text-sm"
                            style={{ maxWidth: selectedProduct ? '180px' : '260px', wordWrap: 'break-word', whiteSpace: 'normal', lineHeight: '1.4' }}>
                            {p.name}
                          </p>
                          <p className="text-xs" style={{ color: 'var(--text-dim)' }}>{p.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono text-xs" style={{ color: 'var(--text-dim)' }}>{p.asin}</td>
                    <td className="py-3 px-3 font-semibold" style={{ color: 'var(--success)' }}>{p.sales.toLocaleString()} SAR</td>
                    <td className="py-3 px-3" style={{ color: 'var(--text-muted)' }}>{p.spend.toLocaleString()} SAR</td>
                    <td className="py-3 px-3 font-semibold" style={{ color: p.profit > 0 ? '#10b981' : '#ef4444' }}>{p.profit.toLocaleString()} SAR</td>
                    <td className="py-3 px-3">
                      <span style={{ color: p.acos <= 25 ? '#10b981' : p.acos <= 35 ? '#f59e0b' : '#ef4444' }}>{p.acos}%</span>
                    </td>
                    <td className="py-3 px-3">
                      <span style={{ color: p.tacos <= 20 ? '#10b981' : p.tacos <= 30 ? '#f59e0b' : '#ef4444' }}>{p.tacos}%</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                        style={statusStyle[p.status]}>{statusLabel[p.status]}</span>
                    </td>
                    <td className="py-3 px-3">
                      <button onClick={e => { e.stopPropagation(); handleBlacklist(p.id); }}
                        className="flex items-center gap-1 text-xs px-2 py-1 rounded transition-colors"
                        style={{ color: 'var(--error)', border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.05)' }}>
                        <ShieldOff className="w-3 h-3" /> {t('products.exclude')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {selectedProduct && (
          <div className="p-4 sticky top-6 self-start" style={CARD}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-base text-white">{t('products.details')}</h3>
              <button onClick={() => setSelectedProduct(null)} className="p-1 rounded"
                style={{ color: 'var(--text-dim)' }}>
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex justify-center mb-3">
                <img src={selectedProduct.image} alt={selectedProduct.name}
                  className="w-24 h-24 rounded-xl object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              </div>
              <div>
                <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>{t('dash.product')}</p>
                <p className="text-sm font-semibold text-white leading-snug" style={{ wordWrap: 'break-word', whiteSpace: 'normal' }}>{selectedProduct.name}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: t('dash.sales'),  value: `${selectedProduct.sales.toLocaleString()} SAR`,  color: 'var(--success)' },
                  { label: t('dash.profit'), value: `${selectedProduct.profit.toLocaleString()} SAR`, color: selectedProduct.profit > 0 ? '#10b981' : '#ef4444' },
                  { label: t('dash.spend'),  value: `${selectedProduct.spend.toLocaleString()} SAR`,  color: 'var(--text-secondary)' },
                  { label: t('dash.acos'),   value: `${selectedProduct.acos}%`,                    color: selectedProduct.acos <= 25 ? '#10b981' : selectedProduct.acos <= 35 ? '#f59e0b' : '#ef4444' },
                  { label: 'TACoS',          value: `${selectedProduct.tacos}%`,                   color: selectedProduct.tacos <= 20 ? '#10b981' : selectedProduct.tacos <= 30 ? '#f59e0b' : '#ef4444' },
                  { label: t('dash.units'),  value: String(selectedProduct.units),                 color: 'var(--text-secondary)' },
                ].map(item => (
                  <div key={item.label} className="p-2.5 rounded-lg" style={{ background: 'var(--input-bg)' }}>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{item.label}</p>
                    <p className="font-bold text-base" style={{ color: item.color }}>{item.value}</p>
                  </div>
                ))}
              </div>

              <div>
                <p className="text-xs font-medium mb-1.5 flex items-center gap-1" style={{ color: 'var(--accent)' }}>
                  <Tag className="w-3 h-3" /> {t('products.keywords')}
                </p>
                <div className="flex flex-wrap gap-1">
                  {selectedProduct.keywords.length > 0 ? selectedProduct.keywords.map((kw, i) => (
                    <span key={i} className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background: 'var(--accent-bg)', color: 'var(--accent)', border: '1px solid var(--accent-border)' }}>{kw}</span>
                  )) : <span className="text-xs" style={{ color: 'var(--text-dim)' }}>None</span>}
                </div>
              </div>

              {selectedProduct.negKeywords.length > 0 && (
                <div>
                  <p className="text-xs font-medium mb-1.5 flex items-center gap-1" style={{ color: 'var(--error)' }}>
                    <AlertTriangle className="w-3 h-3" /> {t('products.negKeywords')}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {selectedProduct.negKeywords.map((kw, i) => (
                      <span key={i} className="text-xs px-2 py-0.5 rounded-full"
                        style={{ background: 'rgba(239,68,68,0.08)', color: 'var(--error)', border: '1px solid rgba(239,68,68,0.2)' }}>{kw}</span>
                    ))}
                  </div>
                </div>
              )}

              <button onClick={() => handleBlacklist(selectedProduct.id)}
                className="w-full flex items-center justify-center gap-1.5 text-sm py-2 rounded-lg transition-colors"
                style={{ color: 'var(--error)', border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.05)' }}>
                <ShieldOff className="w-4 h-4" /> {t('products.moveBlacklist')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
