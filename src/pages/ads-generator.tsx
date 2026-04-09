import { useState } from 'react';
import { Sparkles, Search, Tag, FileText, Target, Loader2, AlertTriangle, Copy, Check, RotateCcw } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { useAuth, authFetch } from '@/lib/useAuth';
import ReactMarkdown from 'react-markdown';

const CARD  = { background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '0.875rem', boxShadow: 'var(--card-shadow)' } as const;
const INPUT: React.CSSProperties = {
  background: 'var(--input-bg)', border: '1px solid var(--input-border)',
  borderRadius: '0.5rem', color: 'var(--text-secondary)', padding: '0.5rem 0.75rem',
  outline: 'none', fontSize: '0.875rem', width: '100%',
};

interface AdResult {
  keywords: string[];
  headlines: string[];
  description: string;
  targeting: string;
}

interface HistoryItem {
  productName: string;
  category?: string;
  brand?: string;
  result: AdResult;
  generatedAt: string;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button onClick={copy} className="p-1.5 rounded transition-colors" style={{ color: copied ? '#10b981' : '#4a5568' }}>
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

export default function AdsGenerator() {
  const { t } = useI18n();
  const { token } = useAuth();
  const af = authFetch(token);
  const [productName, setProductName] = useState('');
  const [category,    setCategory]    = useState('');
  const [brand,       setBrand]       = useState('');
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState('');
  const [result,      setResult]      = useState<AdResult | null>(null);
  const [history,     setHistory]     = useState<HistoryItem[]>([]);
  const [activeTab,   setActiveTab]   = useState<'keywords' | 'headlines' | 'description' | 'targeting'>('keywords');

  const generate = async () => {
    if (!productName.trim()) return;
    setLoading(true); setError(''); setResult(null);
    try {
      const res  = await af('/api/ad-generator', {
        method: 'POST',
        body: JSON.stringify({ productName: productName.trim(), category: category.trim() || undefined, brand: brand.trim() || undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Generation failed');
      setResult(data.result);
      setHistory(prev => [{
        productName: productName.trim(),
        category: category.trim() || undefined,
        brand: brand.trim() || undefined,
        result: data.result,
        generatedAt: new Date().toLocaleString(),
      }, ...prev.slice(0, 4)]);
      setActiveTab('keywords');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const loadHistory = (item: HistoryItem) => {
    setProductName(item.productName);
    setCategory(item.category ?? '');
    setBrand(item.brand ?? '');
    setResult(item.result);
    setActiveTab('keywords');
  };

  const tabs = [
    { key: 'keywords',    label: t('adGen.keywords'),    icon: Tag       },
    { key: 'headlines',   label: t('adGen.headlines'),   icon: FileText  },
    { key: 'description', label: t('adGen.description'), icon: Search    },
    { key: 'targeting',   label: t('adGen.targeting'),   icon: Target    },
  ] as const;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5" style={{ color: 'var(--accent)' }} /> {t('adGen.title')}
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{t('adGen.subtitle')}</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="space-y-4">
          <div className="p-4" style={CARD}>
            <h3 className="font-bold text-sm mb-4 text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" style={{ color: 'var(--accent)' }} /> {t('adGen.productDetails')}
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>{t('adGen.productName')}</label>
                <input type="text" value={productName} onChange={e => setProductName(e.target.value)}
                  placeholder={t('adGen.namePlaceholder')}
                  style={INPUT}
                  onKeyDown={e => e.key === 'Enter' && generate()} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>{t('adGen.category')}</label>
                <input type="text" value={category} onChange={e => setCategory(e.target.value)}
                  style={INPUT} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>{t('adGen.brand')}</label>
                <input type="text" value={brand} onChange={e => setBrand(e.target.value)}
                  style={INPUT} />
              </div>

              <button onClick={generate} disabled={!productName.trim() || loading}
                className="w-full py-2.5 rounded-lg font-semibold text-sm text-[#0a0612] flex items-center justify-center gap-2 transition-all"
                style={{
                  background: productName.trim() && !loading ? 'var(--accent-gradient)' : 'var(--accent-gradient-dim)',
                  boxShadow: productName.trim() && !loading ? 'var(--accent-glow)' : 'none',
                  cursor: productName.trim() && !loading ? 'pointer' : 'not-allowed',
                }}>
                {loading
                  ? <><Loader2 className="w-4 h-4 animate-spin text-[#0a0612]" /> {t('adGen.generating')}</>
                  : <><Sparkles className="w-4 h-4" /> {t('adGen.generate')}</>}
              </button>
            </div>
          </div>

          {history.length > 0 && (
            <div style={{ ...CARD, overflow: 'hidden' }}>
              <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <h3 className="font-bold text-sm text-white">Recent</h3>
              </div>
              {history.map((item, i) => (
                <button key={i} onClick={() => loadHistory(item)}
                  className="w-full text-left px-4 py-3 transition-colors"
                  style={{ borderBottom: i < history.length - 1 ? '1px solid var(--border-subtle)' : 'none', display: 'block' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--hover-bg)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                  <p className="text-sm font-medium text-white truncate">{item.productName}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-dim)' }}>{item.generatedAt}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          {error && (
            <div className="p-3 text-sm flex items-center gap-2 rounded-xl mb-4"
              style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: 'var(--error)' }}>
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!result && !loading && !error && (
            <div className="flex flex-col items-center justify-center h-80" style={CARD}>
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: 'var(--accent-bg)', border: '1px solid var(--accent-border)' }}>
                <Sparkles className="w-8 h-8" style={{ color: 'var(--accent)' }} />
              </div>
              <p className="font-bold text-white mb-1">{t('adGen.productName').replace(' *', '')}</p>
              <p className="text-sm text-center max-w-xs" style={{ color: 'var(--text-muted)' }}>
                {t('adGen.subtitle')}
              </p>
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center h-80" style={CARD}>
              <Loader2 className="w-10 h-10 animate-spin mb-4" style={{ color: 'var(--accent)' }} />
              <p className="font-bold text-white mb-1">{t('adGen.generating')}</p>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>GPT-4o mini</p>
            </div>
          )}

          {result && (
            <div style={{ ...CARD, overflow: 'hidden' }}>
              <div className="flex items-center overflow-x-auto" style={{ borderBottom: '1px solid var(--border-primary)' }}>
                {tabs.map(tb => {
                  const Icon = tb.icon;
                  return (
                    <button key={tb.key} onClick={() => setActiveTab(tb.key)}
                      className="flex items-center gap-1.5 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors"
                      style={activeTab === tb.key
                        ? { color: 'var(--accent)', borderBottom: '2px solid var(--accent)' }
                        : { color: 'var(--text-muted)', borderBottom: '2px solid transparent' }}>
                      <Icon className="w-3.5 h-3.5" /> {tb.label}
                    </button>
                  );
                })}
                <div className="ml-auto px-3 flex items-center gap-2">
                  <span className="text-xs" style={{ color: 'var(--text-dim)' }}>
                    {productName}{brand ? ` · ${brand}` : ''}
                  </span>
                  <button onClick={() => { setResult(null); setProductName(''); setCategory(''); setBrand(''); }}
                    title="Reset" className="p-1 rounded transition-colors" style={{ color: 'var(--text-dim)' }}>
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {activeTab === 'keywords' && (
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                      <Tag className="w-4 h-4" style={{ color: 'var(--accent)' }} /> {t('adGen.keywords')} ({result.keywords?.length ?? 0})
                    </h3>
                    <CopyButton text={result.keywords?.join(', ') ?? ''} />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(result.keywords ?? []).map((kw, i) => (
                      <span key={i}
                        className="text-sm px-3 py-1.5 rounded-full font-medium cursor-pointer transition-all"
                        style={{ background: 'var(--accent-bg)', color: 'var(--accent)', border: '1px solid var(--accent-border)' }}
                        onClick={() => navigator.clipboard.writeText(kw)}>
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'headlines' && (
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                      <FileText className="w-4 h-4" style={{ color: 'var(--accent)' }} /> {t('adGen.headlines')} ({result.headlines?.length ?? 0})
                    </h3>
                    <CopyButton text={result.headlines?.join('\n') ?? ''} />
                  </div>
                  <div className="space-y-2">
                    {(result.headlines ?? []).map((h, i) => (
                      <div key={i}
                        className="flex items-center justify-between p-3 rounded-xl"
                        style={{ background: 'var(--card-bg)', border: '1px solid var(--border-primary)' }}>
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <span className="text-xs font-bold flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[#0a0612]"
                            style={{ background: 'var(--accent-gradient)' }}>{i + 1}</span>
                          <p className="text-sm font-medium text-white truncate">{h}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-xs" style={{ color: h.length > 50 ? '#f59e0b' : '#10b981' }}>
                            {h.length} chars
                          </span>
                          <CopyButton text={h} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'description' && (
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                      <Search className="w-4 h-4" style={{ color: 'var(--accent)' }} /> {t('adGen.description')}
                    </h3>
                    <CopyButton text={result.description ?? ''} />
                  </div>
                  <div className="p-4 rounded-xl text-sm leading-relaxed whitespace-pre-wrap"
                    style={{ background: 'var(--card-bg)', border: '1px solid var(--border-primary)', color: 'var(--text-secondary)' }}>
                    {result.description}
                  </div>
                </div>
              )}

              {activeTab === 'targeting' && (
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                      <Target className="w-4 h-4" style={{ color: 'var(--accent)' }} /> {t('adGen.targeting')}
                    </h3>
                    <CopyButton text={result.targeting ?? ''} />
                  </div>
                  <div className="p-4 rounded-xl text-sm leading-relaxed page-markdown"
                    style={{ background: 'var(--card-bg)', border: '1px solid var(--border-primary)', color: 'var(--text-secondary)' }}>
                    <ReactMarkdown>{result.targeting}</ReactMarkdown>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
