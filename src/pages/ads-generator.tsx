import { useState } from 'react';
import { Sparkles, Search, Tag, FileText, Target, Loader2, AlertTriangle, Copy, Check, RotateCcw } from 'lucide-react';

const CARD  = { background: 'rgba(0,217,255,0.04)', border: '1px solid rgba(0,217,255,0.12)', borderRadius: '0.875rem' } as const;
const INPUT: React.CSSProperties = {
  background: 'rgba(0,217,255,0.06)', border: '1px solid rgba(0,217,255,0.15)',
  borderRadius: '0.5rem', color: '#e2e8f0', padding: '0.5rem 0.75rem',
  outline: 'none', fontSize: '0.875rem', width: '100%',
};
const CYAN = '#00d9ff';

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
      const res  = await fetch('/api/ad-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
    { key: 'keywords',    label: 'Keywords',    icon: Tag       },
    { key: 'headlines',   label: 'Headlines',   icon: FileText  },
    { key: 'description', label: 'Description', icon: Search    },
    { key: 'targeting',   label: 'Targeting',   icon: Target    },
  ] as const;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5" style={{ color: CYAN }} /> Ad Generator
        </h1>
        <p className="text-sm" style={{ color: '#8a94a6' }}>AI-powered Amazon ad content — keywords, headlines, description & targeting</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Input form */}
        <div className="space-y-4">
          <div className="p-4" style={CARD}>
            <h3 className="font-bold text-sm mb-4 text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" style={{ color: CYAN }} /> Product Details
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: '#a0aec0' }}>Product Name *</label>
                <input type="text" value={productName} onChange={e => setProductName(e.target.value)}
                  placeholder="e.g. Wireless Noise-Cancelling Headphones"
                  style={INPUT}
                  onKeyDown={e => e.key === 'Enter' && generate()} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: '#a0aec0' }}>Category <span style={{ color: '#4a5568' }}>(optional)</span></label>
                <input type="text" value={category} onChange={e => setCategory(e.target.value)}
                  placeholder="e.g. Electronics, Beauty, Home"
                  style={INPUT} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: '#a0aec0' }}>Brand <span style={{ color: '#4a5568' }}>(optional)</span></label>
                <input type="text" value={brand} onChange={e => setBrand(e.target.value)}
                  placeholder="e.g. SoundMax"
                  style={INPUT} />
              </div>

              <button onClick={generate} disabled={!productName.trim() || loading}
                className="w-full py-2.5 rounded-lg font-semibold text-sm text-[#0a0612] flex items-center justify-center gap-2 transition-all"
                style={{
                  background: productName.trim() && !loading ? 'linear-gradient(135deg,#00d9ff,#00f0ff)' : 'rgba(0,217,255,0.2)',
                  boxShadow: productName.trim() && !loading ? '0 0 16px rgba(0,217,255,0.3)' : 'none',
                  cursor: productName.trim() && !loading ? 'pointer' : 'not-allowed',
                }}>
                {loading
                  ? <><Loader2 className="w-4 h-4 animate-spin text-[#0a0612]" /> Generating...</>
                  : <><Sparkles className="w-4 h-4" /> Generate Ad Content</>}
              </button>
            </div>
          </div>

          {/* How it works */}
          <div className="p-4" style={CARD}>
            <h3 className="font-bold text-sm mb-3 text-white">What You Get</h3>
            <div className="space-y-2">
              {[
                { icon: Tag,      text: '10 buyer-intent keywords' },
                { icon: FileText, text: '5 high-converting headlines' },
                { icon: Search,   text: '1 professional description' },
                { icon: Target,   text: 'Targeting strategy & bid guidance' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-sm" style={{ color: '#a0aec0' }}>
                  <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: CYAN }} />
                  {text}
                </div>
              ))}
            </div>
          </div>

          {/* History */}
          {history.length > 0 && (
            <div style={{ ...CARD, overflow: 'hidden' }}>
              <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(0,217,255,0.08)' }}>
                <h3 className="font-bold text-sm text-white">Recent</h3>
              </div>
              {history.map((item, i) => (
                <button key={i} onClick={() => loadHistory(item)}
                  className="w-full text-left px-4 py-3 transition-colors"
                  style={{ borderBottom: i < history.length - 1 ? '1px solid rgba(0,217,255,0.06)' : 'none', display: 'block' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(0,217,255,0.04)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                  <p className="text-sm font-medium text-white truncate">{item.productName}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#4a5568' }}>{item.generatedAt}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Results panel */}
        <div className="lg:col-span-2">
          {error && (
            <div className="p-3 text-sm flex items-center gap-2 rounded-xl mb-4"
              style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#ef4444' }}>
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
              {error.toLowerCase().includes('quota') && (
                <a href="https://platform.openai.com/billing" target="_blank" rel="noreferrer"
                  className="ml-auto underline whitespace-nowrap" style={{ color: '#ef4444' }}>Add billing →</a>
              )}
            </div>
          )}

          {!result && !loading && !error && (
            <div className="flex flex-col items-center justify-center h-80" style={CARD}>
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: 'rgba(0,217,255,0.08)', border: '1px solid rgba(0,217,255,0.2)' }}>
                <Sparkles className="w-8 h-8" style={{ color: CYAN }} />
              </div>
              <p className="font-bold text-white mb-1">Enter a Product Name</p>
              <p className="text-sm text-center max-w-xs" style={{ color: '#8a94a6' }}>
                Fill in the product details on the left and click Generate to get AI-powered ad content.
              </p>
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center h-80" style={CARD}>
              <Loader2 className="w-10 h-10 animate-spin mb-4" style={{ color: CYAN }} />
              <p className="font-bold text-white mb-1">Generating Ad Content</p>
              <p className="text-sm" style={{ color: '#8a94a6' }}>GPT-4o mini is working on it…</p>
            </div>
          )}

          {result && (
            <div style={{ ...CARD, overflow: 'hidden' }}>
              {/* Tab bar */}
              <div className="flex items-center overflow-x-auto" style={{ borderBottom: '1px solid rgba(0,217,255,0.12)' }}>
                {tabs.map(t => {
                  const Icon = t.icon;
                  return (
                    <button key={t.key} onClick={() => setActiveTab(t.key)}
                      className="flex items-center gap-1.5 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors"
                      style={activeTab === t.key
                        ? { color: CYAN, borderBottom: `2px solid ${CYAN}` }
                        : { color: '#8a94a6', borderBottom: '2px solid transparent' }}>
                      <Icon className="w-3.5 h-3.5" /> {t.label}
                    </button>
                  );
                })}
                <div className="ml-auto px-3 flex items-center gap-2">
                  <span className="text-xs" style={{ color: '#4a5568' }}>
                    {productName}{brand ? ` · ${brand}` : ''}
                  </span>
                  <button onClick={() => { setResult(null); setProductName(''); setCategory(''); setBrand(''); }}
                    title="Reset" className="p-1 rounded transition-colors" style={{ color: '#4a5568' }}>
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Keywords */}
              {activeTab === 'keywords' && (
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                      <Tag className="w-4 h-4" style={{ color: CYAN }} /> Keywords ({result.keywords?.length ?? 0})
                    </h3>
                    <CopyButton text={result.keywords?.join(', ') ?? ''} />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(result.keywords ?? []).map((kw, i) => (
                      <span key={i}
                        className="text-sm px-3 py-1.5 rounded-full font-medium cursor-pointer transition-all"
                        style={{ background: 'rgba(0,217,255,0.08)', color: CYAN, border: '1px solid rgba(0,217,255,0.2)' }}
                        onClick={() => navigator.clipboard.writeText(kw)}>
                        {kw}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs mt-4" style={{ color: '#4a5568' }}>Click any keyword to copy it individually</p>
                </div>
              )}

              {/* Headlines */}
              {activeTab === 'headlines' && (
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                      <FileText className="w-4 h-4" style={{ color: CYAN }} /> Headlines ({result.headlines?.length ?? 0})
                    </h3>
                    <CopyButton text={result.headlines?.join('\n') ?? ''} />
                  </div>
                  <div className="space-y-2">
                    {(result.headlines ?? []).map((h, i) => (
                      <div key={i}
                        className="flex items-center justify-between p-3 rounded-xl"
                        style={{ background: 'rgba(0,217,255,0.04)', border: '1px solid rgba(0,217,255,0.1)' }}>
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <span className="text-xs font-bold flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[#0a0612]"
                            style={{ background: 'linear-gradient(135deg,#00d9ff,#00f0ff)' }}>{i + 1}</span>
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

              {/* Description */}
              {activeTab === 'description' && (
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                      <Search className="w-4 h-4" style={{ color: CYAN }} /> Product Description
                    </h3>
                    <CopyButton text={result.description ?? ''} />
                  </div>
                  <div className="p-4 rounded-xl text-sm leading-relaxed whitespace-pre-wrap"
                    style={{ background: 'rgba(0,217,255,0.04)', border: '1px solid rgba(0,217,255,0.1)', color: '#e2e8f0' }}>
                    {result.description}
                  </div>
                  <p className="text-xs mt-2" style={{ color: '#4a5568' }}>
                    {result.description?.length ?? 0} characters — optimized for Amazon search
                  </p>
                </div>
              )}

              {/* Targeting */}
              {activeTab === 'targeting' && (
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                      <Target className="w-4 h-4" style={{ color: CYAN }} /> Targeting Strategy
                    </h3>
                    <CopyButton text={result.targeting ?? ''} />
                  </div>
                  <div className="p-4 rounded-xl text-sm leading-relaxed"
                    style={{ background: 'rgba(0,217,255,0.04)', border: '1px solid rgba(0,217,255,0.1)', color: '#e2e8f0' }}>
                    {result.targeting}
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
