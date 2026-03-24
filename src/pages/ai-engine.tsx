import { useState } from 'react';
import { aiSuggestions, products } from '@/data/mock';
import { Bot, TrendingUp, TrendingDown, AlertTriangle, Tag, DollarSign, CheckCircle2, X, Zap } from 'lucide-react';

const typeConfig: Record<string, { icon: any; color: string; bg: string; label: string }> = {
  keyword: { icon: Tag, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800', label: 'كلمة مفتاحية' },
  warning: { icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800', label: 'تحذير' },
  budget: { icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800', label: 'ميزانية' },
  negative: { icon: TrendingDown, color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800', label: 'كلمة سلبية' },
};

const priorityBadge: Record<string, string> = {
  critical: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  high: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  medium: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
};
const priorityLabel: Record<string, string> = { critical: 'حرج', high: 'مرتفع', medium: 'متوسط' };

export default function AiEngine() {
  const [applied, setApplied] = useState<number[]>([]);
  const [ignored, setIgnored] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  const active = aiSuggestions.filter(s => !applied.includes(s.id) && !ignored.includes(s.id));
  const strongProducts = products.filter(p => p.acos <= 22 && p.profit > 5000).slice(0, 3);
  const weakProducts = products.filter(p => p.status === 'poor' || p.status === 'weak').slice(0, 3);

  const runAnalysis = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2"><Bot className="w-5 h-5 text-green-600" /> المحرك الذكي</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">تحليل يومي آلي للمنتجات والكلمات المفتاحية</p>
        </div>
        <button onClick={runAnalysis} disabled={loading}
          className="flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-60">
          {loading ? <><span className="w-4 h-4 border-2 border-white/30 dark:border-black/30 border-t-white dark:border-t-black rounded-full animate-spin" /> جارٍ التحليل...</> : <><Zap className="w-4 h-4" /> تشغيل التحليل</>}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="card p-4">
          <p className="text-xs text-gray-500 mb-1">توصيات نشطة</p>
          <p className="text-2xl font-bold text-amber-600">{active.length}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-gray-500 mb-1">تم تطبيقها</p>
          <p className="text-2xl font-bold text-green-600">{applied.length}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-gray-500 mb-1">منتجات قوية</p>
          <p className="text-2xl font-bold text-green-600">{strongProducts.length}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-gray-500 mb-1">منتجات ضعيفة</p>
          <p className="text-2xl font-bold text-red-500">{weakProducts.length}</p>
        </div>
      </div>

      {/* Recommendations */}
      <div>
        <h2 className="font-bold mb-3">التوصيات ({active.length})</h2>
        {active.length === 0 ? (
          <div className="card p-10 text-center">
            <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-3" />
            <p className="font-bold">تم تطبيق جميع التوصيات</p>
            <p className="text-sm text-gray-500 mt-1">سيقوم النظام بتحليل جديد غداً وإرسال توصيات محدثة.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-3">
            {active.map(s => {
              const cfg = typeConfig[s.type];
              const Icon = cfg.icon;
              return (
                <div key={s.id} className={`card p-4 border ${cfg.bg}`}>
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-white dark:bg-gray-900 flex-shrink-0`}>
                      <Icon className={`w-4 h-4 ${cfg.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        <span className="text-xs font-medium text-gray-500">{cfg.label}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${priorityBadge[s.priority]}`}>{priorityLabel[s.priority]}</span>
                      </div>
                      <p className="font-bold text-sm">{s.title}</p>
                      <p className="text-xs text-gray-500">{s.product}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 leading-relaxed">{s.suggestion}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950/30 px-2 py-1 rounded">
                      📈 {s.impact}
                    </span>
                    <div className="flex gap-1.5">
                      <button onClick={() => setApplied([...applied, s.id])}
                        className="flex items-center gap-1 text-xs bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-3 py-1.5 rounded font-medium hover:opacity-90">
                        <CheckCircle2 className="w-3.5 h-3.5" /> تطبيق
                      </button>
                      <button onClick={() => setIgnored([...ignored, s.id])}
                        className="flex items-center gap-1 text-xs border border-gray-200 dark:border-gray-700 px-3 py-1.5 rounded font-medium hover:bg-gray-100 dark:hover:bg-gray-800">
                        <X className="w-3.5 h-3.5" /> تجاهل
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Product Analysis */}
      <div className="grid md:grid-cols-2 gap-5">
        <div className="card p-4">
          <h3 className="font-bold text-sm mb-3 text-green-600 flex items-center gap-1.5"><TrendingUp className="w-4 h-4" /> منتجات عالية الأداء</h3>
          <div className="space-y-2">
            {strongProducts.map(p => (
              <div key={p.id} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{p.name.split('-')[0].trim()}</p>
                  <p className="text-xs text-gray-500">ACOS {p.acos}%</p>
                </div>
                <span className="text-sm font-bold text-green-600 mr-2">{p.sales.toLocaleString()} ر.س</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-4">
          <h3 className="font-bold text-sm mb-3 text-red-600 flex items-center gap-1.5"><AlertTriangle className="w-4 h-4" /> منتجات تحتاج انتباه</h3>
          <div className="space-y-2">
            {weakProducts.map(p => (
              <div key={p.id} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{p.name.split('-')[0].trim()}</p>
                  <p className="text-xs text-red-500">ACOS {p.acos}%</p>
                </div>
                <span className={`text-sm font-bold mr-2 ${p.profit > 0 ? 'text-amber-600' : 'text-red-500'}`}>{p.profit.toLocaleString()} ر.س</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
