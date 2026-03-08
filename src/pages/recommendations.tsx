import { useState } from 'react';
import { recommendations } from '@/data/mock';
import { TrendingDown, TrendingUp, PauseCircle, Plus, Settings, Zap, CheckCircle2, X, AlertTriangle } from 'lucide-react';

const typeLabels: Record<string, string> = {
  reduce_bid: 'تقليل العرض',
  increase_budget: 'زيادة الميزانية',
  pause_keyword: 'إيقاف كلمة مفتاحية',
  add_keyword: 'إضافة كلمة مفتاحية',
  improve_structure: 'تحسين الهيكل',
  increase_bid: 'زيادة العرض',
};

const typeColors: Record<string, string> = {
  reduce_bid: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  increase_budget: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  pause_keyword: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  add_keyword: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  improve_structure: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  increase_bid: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
};

const iconMap: Record<string, any> = {
  TrendingDown, TrendingUp, PauseCircle, Plus, Settings,
};

const priorityColors: Record<string, string> = {
  critical: 'badge-danger',
  high: 'badge-warning',
  medium: 'badge-info',
};

const priorityLabels: Record<string, string> = {
  critical: 'حرج',
  high: 'مرتفع',
  medium: 'متوسط',
};

export default function Recommendations() {
  const [applied, setApplied] = useState<number[]>([]);
  const [ignored, setIgnored] = useState<number[]>([]);

  const active = recommendations.filter(r => !applied.includes(r.id) && !ignored.includes(r.id));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">التوصيات الذكية</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">توصيات مدعومة بالذكاء الاصطناعي لتحسين أداء حملاتك</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="badge-info">{active.length} توصية نشطة</span>
          {applied.length > 0 && <span className="badge-success">{applied.length} تم تطبيقها</span>}
        </div>
      </div>

      {applied.length > 0 && (
        <div className="card p-4 border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
            <p className="text-sm font-medium">تم تطبيق {applied.length} توصية بنجاح</p>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {active.map(r => {
          const Icon = iconMap[r.icon] || Zap;
          return (
            <div key={r.id} className="card p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${typeColors[r.type]}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className={`text-xs px-2 py-0.5 rounded ${typeColors[r.type]}`}>{typeLabels[r.type]}</span>
                    <p className="font-bold mt-1">{r.campaign}</p>
                    {r.keyword && <p className="text-xs text-gray-500">الكلمة: {r.keyword}</p>}
                  </div>
                </div>
                <span className={priorityColors[r.priority]}>{priorityLabels[r.priority]}</span>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">{r.reason}</p>

              <div className="flex items-center gap-2 mb-4 p-2 rounded-lg bg-brand-50 dark:bg-brand-950/30">
                <TrendingUp className="w-4 h-4 text-brand-600" />
                <span className="text-sm text-brand-700 dark:text-brand-400 font-medium">التأثير المتوقع: {r.impact}</span>
              </div>

              <div className="flex gap-2">
                <button onClick={() => setApplied([...applied, r.id])}
                  className="btn-success flex-1 text-sm flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> تطبيق
                </button>
                <button onClick={() => setIgnored([...ignored, r.id])}
                  className="btn-secondary flex-1 text-sm flex items-center justify-center gap-1">
                  <X className="w-4 h-4" /> تجاهل
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {active.length === 0 && (
        <div className="card p-12 text-center">
          <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold mb-2">تم تطبيق جميع التوصيات!</h3>
          <p className="text-gray-500 dark:text-gray-400">سيتم تحليل حملاتك بشكل مستمر وإرسال توصيات جديدة عند توفرها.</p>
        </div>
      )}
    </div>
  );
}
