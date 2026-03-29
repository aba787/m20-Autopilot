import { useState } from 'react';
import { campaigns as mockCampaigns, products } from '@/data/mock';
import { Bot, TrendingUp, TrendingDown, AlertTriangle, Tag, CheckCircle2, X, Zap, Play, RotateCcw, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import type { BotResult } from '@/lib/campaignBot';

type BotAction = 'pause' | 'scale' | 'decrease_bid' | 'add_negative' | 'keep';

const actionConfig: Record<BotAction, { label: string; color: string; bg: string; icon: any }> = {
  pause:         { label: 'إيقاف',         color: 'text-red-600',    bg: 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800',    icon: X },
  scale:         { label: 'توسيع',          color: 'text-green-600',  bg: 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800', icon: TrendingUp },
  decrease_bid:  { label: 'خفض العرض',     color: 'text-amber-600',  bg: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800', icon: TrendingDown },
  add_negative:  { label: 'كلمة سلبية',    color: 'text-blue-600',   bg: 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800',   icon: Tag },
  keep:          { label: 'استمرار',        color: 'text-gray-600',   bg: 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700',   icon: CheckCircle2 },
};

const priorityBadge: Record<string, string> = {
  critical: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  high:     'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  medium:   'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  low:      'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
};
const priorityLabel: Record<string, string> = { critical: 'حرج', high: 'مرتفع', medium: 'متوسط', low: 'منخفض' };

// Build CampaignData format expected by bot
function toBotFormat(c: typeof mockCampaigns[0]) {
  return {
    id: c.id,
    name: c.name,
    spend: c.spend,
    sales: c.sales,
    clicks: c.clicks,
    impressions: c.impressions,
    orders: c.orders,
    acos: c.acos,
    roas: c.roas,
    ctr: c.ctr,
    budget: c.budget,
    status: c.status,
    target_acos: 30,
  };
}

export default function AiEngine() {
  const [results, setResults] = useState<BotResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState<number | null>(null);
  const [applied, setApplied] = useState<number[]>([]);

  const strongProducts = products.filter(p => p.acos <= 22 && p.profit > 5000).slice(0, 3);
  const weakProducts = products.filter(p => p.status === 'poor' || p.status === 'weak').slice(0, 3);

  // Run full bot on all campaigns
  const runFullBot = async () => {
    setLoading(true);
    setError('');
    setResults([]);
    try {
      const res = await fetch('/api/bot-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaigns: mockCampaigns.map(toBotFormat) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'خطأ غير معروف');
      setResults(data.results);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // Analyze single campaign
  const analyzeOne = async (campaign: typeof mockCampaigns[0]) => {
    setLoadingId(campaign.id);
    setError('');
    try {
      const res = await fetch('/api/bot-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ singleCampaign: toBotFormat(campaign) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'خطأ');
      setResults(prev => {
        const filtered = prev.filter(r => r.campaign.id !== campaign.id);
        return [data.result, ...filtered];
      });
      setExpanded(campaign.id);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoadingId(null);
    }
  };

  const criticalCount = results.filter(r => r.ruleDecision.priority === 'critical').length;
  const scaleCount = results.filter(r => r.ruleDecision.action === 'scale').length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Bot className="w-5 h-5 text-green-600" /> المحرك الذكي
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">تحليل ذكي للحملات بالقواعد + GPT-4o mini</p>
        </div>
        <button onClick={runFullBot} disabled={loading}
          className="flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-60">
          {loading
            ? <><Loader2 className="w-4 h-4 animate-spin" /> جارٍ التحليل...</>
            : <><Zap className="w-4 h-4" /> تحليل جميع الحملات</>}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="card p-3 border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 text-sm flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" /> {error}
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="card p-4">
          <p className="text-xs text-gray-500 mb-1">حملات محللة</p>
          <p className="text-2xl font-bold">{results.length}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-gray-500 mb-1">حرجة تحتاج تدخل</p>
          <p className="text-2xl font-bold text-red-500">{criticalCount}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-gray-500 mb-1">قابلة للتوسيع</p>
          <p className="text-2xl font-bold text-green-600">{scaleCount}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-gray-500 mb-1">تم تطبيقه</p>
          <p className="text-2xl font-bold text-blue-600">{applied.length}</p>
        </div>
      </div>

      {/* Two-column: Campaigns list + Results */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Left: Campaigns table with per-row analyze */}
        <div className="card overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <h2 className="font-bold text-sm">الحملات</h2>
            <span className="text-xs text-gray-500">{mockCampaigns.length} حملة</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-gray-50 dark:bg-gray-800/50">
                <tr>
                  <th className="text-right py-2 px-3 font-medium text-gray-500">الحملة</th>
                  <th className="text-right py-2 px-3 font-medium text-gray-500">ACOS</th>
                  <th className="text-right py-2 px-3 font-medium text-gray-500">ROAS</th>
                  <th className="text-right py-2 px-3 font-medium text-gray-500">تحليل</th>
                </tr>
              </thead>
              <tbody>
                {mockCampaigns.map(c => {
                  const result = results.find(r => r.campaign.id === c.id);
                  const action = result?.ruleDecision.action as BotAction | undefined;
                  const cfg = action ? actionConfig[action] : null;
                  return (
                    <tr key={c.id} className={`border-b border-gray-100 dark:border-gray-800/50 transition-colors ${expanded === c.id ? 'bg-gray-50 dark:bg-gray-800/30' : 'hover:bg-gray-50/50 dark:hover:bg-gray-800/20'}`}>
                      <td className="py-2 px-3">
                        <p className="font-medium truncate max-w-[130px]" title={c.name}>{c.name}</p>
                        <p className="text-gray-400">{c.type.split(' ')[0]}</p>
                      </td>
                      <td className="py-2 px-3">
                        <span className={c.acos <= 25 ? 'text-green-600 font-medium' : c.acos <= 40 ? 'text-amber-600 font-medium' : 'text-red-500 font-bold'}>{c.acos}%</span>
                      </td>
                      <td className="py-2 px-3">
                        <span className={c.roas >= 4 ? 'text-green-600 font-medium' : c.roas >= 2 ? 'text-amber-600' : 'text-red-500'}>{c.roas}</span>
                      </td>
                      <td className="py-2 px-3">
                        <div className="flex items-center gap-1">
                          {cfg && (
                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${priorityBadge[result!.ruleDecision.priority]}`}>
                              {priorityLabel[result!.ruleDecision.priority]}
                            </span>
                          )}
                          <button
                            onClick={() => {
                              if (expanded === c.id) setExpanded(null);
                              else if (result) setExpanded(c.id);
                              else analyzeOne(c);
                            }}
                            disabled={loadingId === c.id}
                            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-40 text-gray-500">
                            {loadingId === c.id
                              ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              : result
                                ? (expanded === c.id ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />)
                                : <Play className="w-3.5 h-3.5 text-green-600" />}
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

        {/* Right: Result detail OR product analysis */}
        <div className="space-y-3">
          {/* Expanded result card */}
          {expanded !== null && results.find(r => r.campaign.id === expanded) && (() => {
            const r = results.find(r => r.campaign.id === expanded)!;
            const cfg = actionConfig[r.ruleDecision.action as BotAction] ?? actionConfig.keep;
            const Icon = cfg.icon;
            return (
              <div className={`card p-4 border ${cfg.bg}`}>
                <div className="flex items-center gap-2 mb-3">
                  <Icon className={`w-5 h-5 ${cfg.color}`} />
                  <h3 className="font-bold text-sm flex-1 truncate">{r.campaign.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded font-medium ${priorityBadge[r.ruleDecision.priority]}`}>
                    {priorityLabel[r.ruleDecision.priority]}
                  </span>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="p-2 rounded bg-white dark:bg-gray-900 text-center">
                    <p className="text-[10px] text-gray-500">ACOS</p>
                    <p className={`font-bold text-sm ${r.metrics.acos <= 25 ? 'text-green-600' : r.metrics.acos <= 40 ? 'text-amber-600' : 'text-red-500'}`}>{r.metrics.acos.toFixed(1)}%</p>
                  </div>
                  <div className="p-2 rounded bg-white dark:bg-gray-900 text-center">
                    <p className="text-[10px] text-gray-500">ROAS</p>
                    <p className={`font-bold text-sm ${r.metrics.roas >= 4 ? 'text-green-600' : r.metrics.roas >= 2 ? 'text-amber-600' : 'text-red-500'}`}>{r.metrics.roas.toFixed(2)}</p>
                  </div>
                  <div className="p-2 rounded bg-white dark:bg-gray-900 text-center">
                    <p className="text-[10px] text-gray-500">CTR</p>
                    <p className="font-bold text-sm">{r.metrics.ctr.toFixed(2)}%</p>
                  </div>
                </div>

                {/* Rule decision */}
                <div className="mb-3 p-2.5 rounded bg-white dark:bg-gray-900">
                  <p className="text-[10px] font-medium text-gray-500 mb-1">قرار القواعد</p>
                  <p className={`text-sm font-bold ${cfg.color}`}>{cfg.label}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">{r.ruleDecision.reason}</p>
                  {r.ruleDecision.suggestedChange && (
                    <p className="text-xs text-gray-500 mt-1">→ {r.ruleDecision.suggestedChange}</p>
                  )}
                </div>

                {/* AI Analysis */}
                <div className="mb-3 p-2.5 rounded bg-white dark:bg-gray-900">
                  <p className="text-[10px] font-medium text-gray-500 mb-1 flex items-center gap-1">
                    <Bot className="w-3 h-3 text-green-600" /> تحليل GPT-4o mini
                  </p>
                  <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">{r.aiAnalysis}</p>
                </div>

                {/* Actions */}
                {!applied.includes(r.campaign.id) ? (
                  <button onClick={() => setApplied(p => [...p, r.campaign.id])}
                    className="w-full flex items-center justify-center gap-1.5 text-xs bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-2 rounded-lg font-medium hover:opacity-90">
                    <CheckCircle2 className="w-3.5 h-3.5" /> تم التطبيق
                  </button>
                ) : (
                  <div className="w-full flex items-center justify-center gap-1.5 text-xs text-green-600 py-2 rounded-lg border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/30 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" /> تم التطبيق
                  </div>
                )}
              </div>
            );
          })()}

          {/* Product analysis panels */}
          <div className="card p-4">
            <h3 className="font-bold text-sm mb-3 text-green-600 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4" /> منتجات عالية الأداء
            </h3>
            <div className="space-y-2">
              {strongProducts.map(p => (
                <div key={p.id} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{p.name.split('-')[0].trim()}</p>
                    <p className="text-xs text-gray-500">ACOS {p.acos}% · {p.units} وحدة</p>
                  </div>
                  <span className="text-sm font-bold text-green-600 mr-2">{p.profit.toLocaleString()} ر.س</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-4">
            <h3 className="font-bold text-sm mb-3 text-red-600 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" /> منتجات تحتاج انتباه
            </h3>
            <div className="space-y-2">
              {weakProducts.map(p => (
                <div key={p.id} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{p.name.split('-')[0].trim()}</p>
                    <p className="text-xs text-red-500">ACOS {p.acos}%</p>
                  </div>
                  <span className={`text-sm font-bold mr-2 ${p.profit > 0 ? 'text-amber-600' : 'text-red-500'}`}>
                    {p.profit.toLocaleString()} ر.س
                  </span>
                </div>
              ))}
            </div>
          </div>

          {results.length === 0 && expanded === null && (
            <div className="card p-8 text-center">
              <Bot className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="font-bold mb-1">ابدأ التحليل</p>
              <p className="text-sm text-gray-500">اضغط "تحليل جميع الحملات" أو زر ▶ بجانب أي حملة لتحليلها منفردة.</p>
            </div>
          )}
        </div>
      </div>

      {/* How it works */}
      <div className="card p-4">
        <h3 className="font-bold text-sm mb-3">كيف يعمل المحرك؟</h3>
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { step: '1', title: 'حساب المؤشرات', desc: 'ACOS · ROAS · CTR · معدل التحويل لكل حملة' },
            { step: '2', title: 'قواعد القرار', desc: 'منطق ثابت وسريع: إيقاف / توسيع / خفض العرض بناءً على الأرقام' },
            { step: '3', title: 'تحسين بـ GPT-4o', desc: 'الذكاء الاصطناعي يشرح ويضيف سياقاً — القرار النهائي للبائع' },
          ].map(s => (
            <div key={s.step} className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 flex items-center justify-center text-xs font-bold flex-shrink-0">{s.step}</div>
              <div>
                <p className="font-medium text-sm">{s.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
