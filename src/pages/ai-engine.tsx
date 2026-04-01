import { useState } from 'react';
import { campaigns as mockCampaigns, products } from '@/data/mock';
import { Bot, TrendingUp, TrendingDown, AlertTriangle, Tag, CheckCircle2, X, Zap, Play, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import type { BotResult } from '@/lib/campaignBot';
import { useAuth, authFetch } from '@/lib/useAuth';
import { useI18n } from '@/lib/i18n';

type BotAction = 'pause' | 'scale' | 'decrease_bid' | 'add_negative' | 'keep';

const CARD = { background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '0.875rem', boxShadow: 'var(--card-shadow)' } as const;

const priorityStyle: Record<string, React.CSSProperties> = {
  critical: { background: 'rgba(239,68,68,0.12)',  color: 'var(--error)', border: '1px solid rgba(239,68,68,0.25)'  },
  high:     { background: 'rgba(245,158,11,0.12)', color: 'var(--warning)', border: '1px solid rgba(245,158,11,0.25)' },
  medium:   { background: 'var(--accent-bg-strong)',  color: 'var(--accent)',      border: '1px solid var(--accent-border)'  },
  low:      { background: 'rgba(100,116,139,0.12)',color: '#64748b', border: '1px solid rgba(100,116,139,0.25)'},
};

function toBotFormat(c: typeof mockCampaigns[0]) {
  return { id: c.id, name: c.name, spend: c.spend, sales: c.sales, clicks: c.clicks, impressions: c.impressions, orders: c.orders, acos: c.acos, roas: c.roas, ctr: c.ctr, budget: c.budget, status: c.status, target_acos: 30 };
}

export default function AiEngine() {
  const { t } = useI18n();
  const { token } = useAuth();
  const apiFetch = authFetch(token);
  const [results, setResults]     = useState<BotResult[]>([]);
  const [loading, setLoading]     = useState(false);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [error, setError]         = useState('');
  const [expanded, setExpanded]   = useState<number | null>(null);
  const [applied, setApplied]     = useState<number[]>([]);

  const actionConfig: Record<BotAction, { label: string; color: string; borderColor: string; icon: any }> = {
    pause:        { label: t('aiEngine.pause'),       color: 'var(--error)', borderColor: 'rgba(239,68,68,0.25)',    icon: X          },
    scale:        { label: t('aiEngine.scaleUp'),     color: 'var(--success)', borderColor: 'rgba(16,185,129,0.25)',   icon: TrendingUp  },
    decrease_bid: { label: t('aiEngine.decreaseBid'), color: 'var(--warning)', borderColor: 'rgba(245,158,11,0.25)',   icon: TrendingDown},
    add_negative: { label: t('aiEngine.addNegative'), color: 'var(--accent)',      borderColor: 'var(--accent-border)',    icon: Tag         },
    keep:         { label: t('aiEngine.keep'),        color: '#64748b', borderColor: 'rgba(100,116,139,0.25)',  icon: CheckCircle2},
  };

  const strongProducts = products.filter(p => p.acos <= 22 && p.profit > 5000).slice(0, 3);
  const weakProducts   = products.filter(p => p.status === 'poor' || p.status === 'weak').slice(0, 3);

  const runFullBot = async () => {
    setLoading(true); setError(''); setResults([]);
    try {
      const res  = await apiFetch('/api/bot-analyze', { method: 'POST', body: JSON.stringify({ campaigns: mockCampaigns.map(toBotFormat) }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Unknown error');
      setResults(data.results);
    } catch (e: unknown) { setError(e instanceof Error ? e.message : 'Unknown error'); }
    finally { setLoading(false); }
  };

  const analyzeOne = async (campaign: typeof mockCampaigns[0]) => {
    setLoadingId(campaign.id); setError('');
    try {
      const res  = await apiFetch('/api/bot-analyze', { method: 'POST', body: JSON.stringify({ singleCampaign: toBotFormat(campaign) }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error');
      setResults(prev => [data.result, ...prev.filter(r => r.campaign.id !== campaign.id)]);
      setExpanded(campaign.id);
    } catch (e: unknown) { setError(e instanceof Error ? e.message : 'Unknown error'); }
    finally { setLoadingId(null); }
  };

  const criticalCount = results.filter(r => r.ruleDecision.priority === 'critical').length;
  const scaleCount    = results.filter(r => r.ruleDecision.action === 'scale').length;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Bot className="w-5 h-5" style={{ color: 'var(--accent)' }} /> {t('aiEngine.title')}
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{t('aiEngine.subtitle')}</p>
        </div>
        <button onClick={runFullBot} disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-[#0a0612] transition-all"
          style={{ background: 'var(--accent-gradient)', opacity: loading ? 0.7 : 1, boxShadow: 'var(--accent-glow)' }}>
          {loading
            ? <><Loader2 className="w-4 h-4 animate-spin" /> {t('aiEngine.analyzing')}</>
            : <><Zap className="w-4 h-4" /> {t('aiEngine.analyzeAll')}</>}
        </button>
      </div>

      {error && (
        <div className="p-3 text-sm flex items-center gap-2 rounded-xl"
          style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: 'var(--error)' }}>
          <AlertTriangle className="w-4 h-4 flex-shrink-0" /> {error}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: t('aiEngine.campaignsAnalyzed'), value: results.length,  color: 'text-white'          },
          { label: t('aiEngine.criticalAction'), value: criticalCount, color: 'text-[#ef4444]'   },
          { label: t('aiEngine.readyToScale'),   value: scaleCount,    color: 'text-[#10b981]'       },
          { label: t('aiEngine.applied'),        value: applied.length, color: 'text-accent'      },
        ].map((s, i) => (
          <div key={i} className="p-4" style={CARD}>
            <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <div style={{ ...CARD, overflow: 'hidden' }}>
          <div className="px-4 py-3 flex items-center justify-between"
            style={{ borderBottom: '1px solid var(--border-primary)' }}>
            <h2 className="font-bold text-sm text-white">{t('campaigns.title')}</h2>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{mockCampaigns.length} {t('campaigns.count')}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead style={{ background: 'var(--hover-bg)' }}>
                <tr>
                  {[t('campaigns.campaign'), 'ACOS', 'ROAS', t('products.action')].map(h => (
                    <th key={h} className="text-left py-2 px-3 font-medium" style={{ color: 'var(--text-muted)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mockCampaigns.map(c => {
                  const result = results.find(r => r.campaign.id === c.id);
                  const action = result?.ruleDecision.action as BotAction | undefined;
                  const cfg    = action ? actionConfig[action] : null;
                  return (
                    <tr key={c.id}
                      className="transition-colors"
                      style={{ borderBottom: '1px solid var(--border-subtle)', background: expanded === c.id ? 'var(--hover-bg)' : 'transparent' }}>
                      <td className="py-2 px-3">
                        <p className="font-medium text-white truncate max-w-[130px]" title={c.name}>{c.name}</p>
                        <p style={{ color: 'var(--text-dim)' }}>{c.type.split(' ')[0]}</p>
                      </td>
                      <td className="py-2 px-3">
                        <span className="font-medium" style={{ color: c.acos <= 25 ? '#10b981' : c.acos <= 40 ? '#f59e0b' : '#ef4444' }}>{c.acos}%</span>
                      </td>
                      <td className="py-2 px-3">
                        <span style={{ color: c.roas >= 4 ? '#10b981' : c.roas >= 2 ? '#f59e0b' : '#ef4444' }}>{c.roas}</span>
                      </td>
                      <td className="py-2 px-3">
                        <div className="flex items-center gap-1">
                          {cfg && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded font-medium"
                              style={priorityStyle[result!.ruleDecision.priority]}>
                              {result!.ruleDecision.priority}
                            </span>
                          )}
                          <button
                            onClick={() => {
                              if (expanded === c.id) setExpanded(null);
                              else if (result) setExpanded(c.id);
                              else analyzeOne(c);
                            }}
                            disabled={loadingId === c.id}
                            className="p-1 rounded transition-colors"
                            style={{ color: 'var(--text-muted)' }}>
                            {loadingId === c.id
                              ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              : result
                                ? (expanded === c.id ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />)
                                : <Play className="w-3.5 h-3.5" style={{ color: 'var(--success)' }} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-3">
          {expanded !== null && results.find(r => r.campaign.id === expanded) && (() => {
            const r   = results.find(r => r.campaign.id === expanded)!;
            const cfg = actionConfig[r.ruleDecision.action as BotAction] ?? actionConfig.keep;
            const Icon = cfg.icon;
            return (
              <div className="p-4 rounded-xl" style={{ background: 'var(--card-bg)', border: `1px solid ${cfg.borderColor}` }}>
                <div className="flex items-center gap-2 mb-3">
                  <Icon className="w-5 h-5" style={{ color: cfg.color }} />
                  <h3 className="font-bold text-sm text-white flex-1 truncate">{r.campaign.name}</h3>
                  <span className="text-xs px-2 py-0.5 rounded font-medium" style={priorityStyle[r.ruleDecision.priority]}>
                    {r.ruleDecision.priority}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-3">
                  {[
                    { label: 'ACOS', value: `${r.metrics.acos.toFixed(1)}%`, color: r.metrics.acos <= 25 ? '#10b981' : r.metrics.acos <= 40 ? '#f59e0b' : '#ef4444' },
                    { label: 'ROAS', value: r.metrics.roas.toFixed(2),        color: r.metrics.roas >= 4 ? '#10b981' : r.metrics.roas >= 2 ? '#f59e0b' : '#ef4444' },
                    { label: 'CTR',  value: `${r.metrics.ctr.toFixed(2)}%`,   color: 'var(--text-secondary)' },
                  ].map(m => (
                    <div key={m.label} className="p-2 rounded text-center" style={{ background: 'var(--input-bg)' }}>
                      <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{m.label}</p>
                      <p className="font-bold text-sm" style={{ color: m.color }}>{m.value}</p>
                    </div>
                  ))}
                </div>

                <div className="mb-3 p-2.5 rounded" style={{ background: 'var(--hover-bg)' }}>
                  <p className="text-[10px] font-medium mb-1" style={{ color: 'var(--text-muted)' }}>{t('aiEngine.ruleDecision')}</p>
                  <p className="text-sm font-bold" style={{ color: cfg.color }}>{cfg.label}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{r.ruleDecision.reason}</p>
                  {r.ruleDecision.suggestedChange && (
                    <p className="text-xs mt-1" style={{ color: 'var(--text-dim)' }}>→ {r.ruleDecision.suggestedChange}</p>
                  )}
                </div>

                <div className="mb-3 p-2.5 rounded" style={{ background: 'var(--hover-bg)' }}>
                  <p className="text-[10px] font-medium mb-1 flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                    <Bot className="w-3 h-3" style={{ color: 'var(--accent)' }} /> {t('aiEngine.gptAnalysis')}
                  </p>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{r.aiAnalysis}</p>
                </div>

                {!applied.includes(r.campaign.id) ? (
                  <button onClick={() => setApplied(p => [...p, r.campaign.id])}
                    className="w-full flex items-center justify-center gap-1.5 text-xs py-2 rounded-lg font-semibold text-[#0a0612]"
                    style={{ background: 'var(--accent-gradient)' }}>
                    <CheckCircle2 className="w-3.5 h-3.5" /> {t('aiEngine.markApplied')}
                  </button>
                ) : (
                  <div className="w-full flex items-center justify-center gap-1.5 text-xs py-2 rounded-lg font-medium"
                    style={{ color: 'var(--success)', border: '1px solid rgba(16,185,129,0.25)', background: 'rgba(16,185,129,0.08)' }}>
                    <CheckCircle2 className="w-3.5 h-3.5" /> {t('aiEngine.applied')}
                  </div>
                )}
              </div>
            );
          })()}

          <div className="p-4" style={CARD}>
            <h3 className="font-bold text-sm mb-3 flex items-center gap-1.5" style={{ color: 'var(--success)' }}>
              <TrendingUp className="w-4 h-4" /> {t('aiEngine.topPerforming')}
            </h3>
            <div className="space-y-2">
              {strongProducts.map(p => (
                <div key={p.id} className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-white truncate">{p.name.split('-')[0].trim()}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>ACOS {p.acos}% · {p.units} {t('dash.units')}</p>
                  </div>
                  <span className="text-sm font-bold ml-2" style={{ color: 'var(--success)' }}>{p.profit.toLocaleString()} SAR</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4" style={CARD}>
            <h3 className="font-bold text-sm mb-3 flex items-center gap-1.5" style={{ color: 'var(--error)' }}>
              <AlertTriangle className="w-4 h-4" /> {t('aiEngine.needsAttention')}
            </h3>
            <div className="space-y-2">
              {weakProducts.map(p => (
                <div key={p.id} className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-white truncate">{p.name.split('-')[0].trim()}</p>
                    <p className="text-xs" style={{ color: 'var(--error)' }}>ACOS {p.acos}%</p>
                  </div>
                  <span className="text-sm font-bold ml-2" style={{ color: p.profit > 0 ? '#f59e0b' : '#ef4444' }}>
                    {p.profit.toLocaleString()} SAR
                  </span>
                </div>
              ))}
            </div>
          </div>

          {results.length === 0 && expanded === null && (
            <div className="p-8 text-center" style={CARD}>
              <Bot className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--text-dim)' }} />
              <p className="font-bold text-white mb-1">{t('aiEngine.startAnalysis')}</p>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{t('aiEngine.startDesc')}</p>
            </div>
          )}
        </div>
      </div>

      <div className="p-4" style={CARD}>
        <h3 className="font-bold text-sm mb-3 text-white">{t('aiEngine.howItWorks')}</h3>
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { step: '1', title: t('aiEngine.step1'),  desc: 'ACOS · ROAS · CTR · Conversion Rate' },
            { step: '2', title: t('aiEngine.step2'), desc: 'Fast deterministic logic: pause / scale / decrease bid' },
            { step: '3', title: t('aiEngine.step3'),  desc: 'AI adds context and explanation' },
          ].map(s => (
            <div key={s.step} className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 text-[#0a0612]"
                style={{ background: 'var(--accent-gradient)' }}>{s.step}</div>
              <div>
                <p className="font-medium text-sm text-white">{s.title}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
