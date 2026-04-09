import { useState, useEffect, useCallback } from 'react';
import { Search, ShieldOff, X, Tag, AlertTriangle, Package, Loader2 } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { useAuth, authFetch } from '@/lib/useAuth';

interface Product {
  id: number;
  name: string;
  brand?: string;
  asin?: string;
  image?: string;
  status: string;
  sales: number;
  spend: number;
  profit: number;
  acos: number;
  tacos?: number;
  units?: number;
  keywords?: string[];
  negKeywords?: string[];
}

const CARD = { background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '0.875rem', boxShadow: 'var(--card-shadow)' } as const;

const statusStyle: Record<string, React.CSSProperties> = {
  active: { background: 'rgba(16,185,129,0.12)',  color: 'var(--success)', border: '1px solid rgba(16,185,129,0.25)'  },
  weak:   { background: 'rgba(245,158,11,0.12)',   color: 'var(--warning)', border: '1px solid rgba(245,158,11,0.25)'  },
  poor:   { background: 'rgba(239,68,68,0.12)',    color: 'var(--error)', border: '1px solid rgba(239,68,68,0.25)'   },
};

export default function Products() {
  const { t } = useI18n();
  const { token } = useAuth();
  const af = authFetch(token);
  const [products, setProducts] = useState<Product[]>([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [search, setSearch]             = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [blacklisted, setBlacklisted]   = useState<number[]>([]);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await af('/api/products');
      const data = await res.json();
      if (res.ok) {
        setProducts(data.products ?? data ?? []);
        setFetchError(null);
      } else {
        setFetchError(data.error || 'Failed to load products');
      }
    } catch {
      setFetchError('Failed to connect to server');
    } finally {
      setFetchLoading(false);
    }
  }, [token]);

  useEffect(() => { if (token) fetchProducts(); else setFetchLoading(false); }, [token]);

  const statusLabel: Record<string, string> = {
    active: t('products.active'),
    weak: t('products.weak'),
    poor: t('products.poor'),
  };

  const filtered = products.filter(p => {
    if (blacklisted.includes(p.id)) return false;
    const ms  = p.name.toLowerCase().includes(search.toLowerCase()) || (p.asin ?? '').includes(search);
    const mst = statusFilter === 'all' || p.status === statusFilter;
    return ms && mst;
  });

  const handleBlacklist = (id: number) => {
    setBlacklisted(prev => [...prev, id]);
    if (selectedProduct?.id === id) setSelectedProduct(null);
  };

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--accent)' }} />
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="p-12 text-center" style={CARD}>
        <Package className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--error)' }} />
        <p className="text-sm mb-3" style={{ color: 'var(--error)' }}>{fetchError}</p>
        <button onClick={() => { setFetchLoading(true); setFetchError(null); fetchProducts(); }}
          className="text-sm px-4 py-2 rounded-lg" style={{ color: 'var(--accent)', border: '1px solid var(--accent-border)' }}>
          {t('common.retry') || 'Retry'}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{t('products.title')}</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{filtered.length} {t('dash.product').toLowerCase()}</p>
        </div>
        <a href="/blacklist" className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg transition-colors"
          style={{ color: 'var(--error)', border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.05)' }}>
          <ShieldOff className="w-5 h-5" /> {t('nav.blacklist')} ({blacklisted.length})
        </a>
      </div>

      <div className="p-3 flex flex-wrap gap-2 items-center" style={CARD}>
        <div className="flex items-center gap-2 rounded-lg px-3 py-1.5 flex-1 min-w-48"
          style={{ background: 'var(--input-bg)', border: '1px solid var(--border-primary)' }}>
          <Search className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--text-dim)' }} />
          <input type="text" placeholder={t('products.search')} value={search} onChange={e => setSearch(e.target.value)}
            className="bg-transparent border-none outline-none text-sm w-full placeholder-[#4a5568]"
            style={{ color: 'var(--text-primary)' }} />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="rounded-lg px-3 py-1.5 text-sm outline-none"
          style={{ background: 'var(--input-bg)', border: '1px solid var(--input-border)', color: 'var(--text-primary)' }}>
          <option value="all">{t('products.allStatus')}</option>
          <option value="active">{t('products.active')}</option>
          <option value="weak">{t('products.weak')}</option>
          <option value="poor">{t('products.poor')}</option>
        </select>
      </div>

      {products.length === 0 ? (
        <div className="p-12 text-center" style={CARD}>
          <Package className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--text-dim)' }} />
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{t('campaigns.noCampaigns')}</p>
        </div>
      ) : (
        <div className="flex gap-5">
          <div className={`flex-1 ${selectedProduct ? 'max-w-[calc(100%-340px)]' : ''}`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map(p => (
                <div key={p.id}
                  onClick={() => setSelectedProduct(selectedProduct?.id === p.id ? null : p)}
                  className="cursor-pointer transition-all duration-200 overflow-hidden group"
                  style={{
                    ...CARD,
                    ...(selectedProduct?.id === p.id ? { borderColor: 'var(--accent-border)', boxShadow: '0 0 16px rgba(0,217,255,0.12)' } : {}),
                  }}
                  onMouseEnter={e => { if (selectedProduct?.id !== p.id) (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--accent-border)'; }}
                  onMouseLeave={e => { if (selectedProduct?.id !== p.id) (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--card-border)'; }}>
                  {p.image && (
                    <div className="relative h-40 overflow-hidden" style={{ background: 'var(--input-bg)' }}>
                      <img src={p.image} alt={p.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      <div className="absolute top-2 right-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold"
                          style={statusStyle[p.status] ?? statusStyle.active}>{statusLabel[p.status] ?? p.status}</span>
                      </div>
                      {p.asin && (
                        <div className="absolute top-2 left-2">
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                            style={{ background: 'rgba(0,0,0,0.6)', color: '#fff' }}>{p.asin}</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="p-3.5">
                    {!p.image && (
                      <div className="flex items-center justify-between mb-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold"
                          style={statusStyle[p.status] ?? statusStyle.active}>{statusLabel[p.status] ?? p.status}</span>
                        {p.asin && <span className="text-[10px] font-mono" style={{ color: 'var(--text-dim)' }}>{p.asin}</span>}
                      </div>
                    )}
                    {p.brand && <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-dim)' }}>{p.brand}</p>}
                    <p className="text-sm font-semibold leading-snug mb-3" style={{ color: 'var(--text-primary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {p.name}
                    </p>

                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <div className="text-center p-1.5 rounded-lg" style={{ background: 'rgba(16,185,129,0.08)' }}>
                        <p className="text-[10px] font-medium" style={{ color: 'var(--text-dim)' }}>{t('dash.sales')}</p>
                        <p className="text-xs font-bold" style={{ color: '#10b981' }}>{Math.round(p.sales).toLocaleString()}</p>
                      </div>
                      <div className="text-center p-1.5 rounded-lg" style={{ background: p.profit > 0 ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)' }}>
                        <p className="text-[10px] font-medium" style={{ color: 'var(--text-dim)' }}>{t('dash.profit')}</p>
                        <p className="text-xs font-bold" style={{ color: p.profit > 0 ? '#22c55e' : '#ef4444' }}>{Math.round(p.profit).toLocaleString()}</p>
                      </div>
                      <div className="text-center p-1.5 rounded-lg" style={{ background: p.acos <= 25 ? 'rgba(16,185,129,0.08)' : p.acos <= 35 ? 'rgba(245,158,11,0.08)' : 'rgba(239,68,68,0.08)' }}>
                        <p className="text-[10px] font-medium" style={{ color: 'var(--text-dim)' }}>ACOS</p>
                        <p className="text-xs font-bold" style={{ color: p.acos <= 25 ? '#10b981' : p.acos <= 35 ? '#f59e0b' : '#ef4444' }}>{p.acos}%</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      {p.units != null && <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{p.units} {t('dash.units')}</span>}
                      <button onClick={e => { e.stopPropagation(); handleBlacklist(p.id); }}
                        className="flex items-center gap-1 text-xs px-2 py-1 rounded transition-colors"
                        style={{ color: 'var(--error)', border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.05)' }}>
                        <ShieldOff className="w-3 h-3" /> {t('products.exclude')}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filtered.length === 0 && products.length > 0 && (
              <div className="text-center py-16" style={CARD}>
                <Package className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--text-dim)' }} />
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{t('common.noResults')}</p>
              </div>
            )}
          </div>

          {selectedProduct && (
            <div className="w-[320px] flex-shrink-0 hidden lg:block">
              <div className="p-5 sticky top-6" style={CARD}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>{t('products.details')}</h3>
                  <button onClick={() => setSelectedProduct(null)} className="p-1 rounded"
                    style={{ color: 'var(--text-dim)' }}>
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-4">
                  {selectedProduct.image && (
                    <div className="flex justify-center">
                      <img src={selectedProduct.image} alt={selectedProduct.name}
                        className="w-full h-40 rounded-xl object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    </div>
                  )}
                  <div>
                    <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>{t('dash.product')}</p>
                    <p className="text-sm font-semibold leading-snug" style={{ color: 'var(--text-primary)', wordWrap: 'break-word', whiteSpace: 'normal' }}>{selectedProduct.name}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    {[
                      { label: t('dash.sales'),  value: `${Math.round(selectedProduct.sales).toLocaleString()} SAR`,  color: '#10b981' },
                      { label: t('dash.profit'), value: `${Math.round(selectedProduct.profit).toLocaleString()} SAR`, color: selectedProduct.profit > 0 ? '#22c55e' : '#ef4444' },
                      { label: t('dash.spend'),  value: `${Math.round(selectedProduct.spend).toLocaleString()} SAR`,  color: 'var(--text-secondary)' },
                      { label: t('dash.acos'),   value: `${selectedProduct.acos}%`,                    color: selectedProduct.acos <= 25 ? '#10b981' : selectedProduct.acos <= 35 ? '#f59e0b' : '#ef4444' },
                      ...(selectedProduct.tacos != null ? [{ label: 'TACoS', value: `${selectedProduct.tacos}%`, color: (selectedProduct.tacos ?? 0) <= 20 ? '#10b981' : (selectedProduct.tacos ?? 0) <= 30 ? '#f59e0b' : '#ef4444' }] : []),
                      ...(selectedProduct.units != null ? [{ label: t('dash.units'), value: String(selectedProduct.units), color: 'var(--text-secondary)' }] : []),
                    ].map(item => (
                      <div key={item.label} className="p-2.5 rounded-lg" style={{ background: 'var(--input-bg)' }}>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{item.label}</p>
                        <p className="font-bold text-base" style={{ color: item.color }}>{item.value}</p>
                      </div>
                    ))}
                  </div>

                  {selectedProduct.keywords && selectedProduct.keywords.length > 0 && (
                    <div>
                      <p className="text-xs font-medium mb-1.5 flex items-center gap-1" style={{ color: 'var(--accent)' }}>
                        <Tag className="w-4 h-4" /> {t('products.keywords')}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {selectedProduct.keywords.map((kw, i) => (
                          <span key={i} className="text-xs px-2 py-0.5 rounded-full"
                            style={{ background: 'var(--accent-bg)', color: 'var(--accent)', border: '1px solid var(--accent-border)' }}>{kw}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedProduct.negKeywords && selectedProduct.negKeywords.length > 0 && (
                    <div>
                      <p className="text-xs font-medium mb-1.5 flex items-center gap-1" style={{ color: 'var(--error)' }}>
                        <AlertTriangle className="w-4 h-4" /> {t('products.negKeywords')}
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
                    className="w-full flex items-center justify-center gap-1.5 text-sm py-2.5 rounded-lg transition-colors"
                    style={{ color: 'var(--error)', border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.05)' }}>
                    <ShieldOff className="w-5 h-5" /> {t('products.moveBlacklist')}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
