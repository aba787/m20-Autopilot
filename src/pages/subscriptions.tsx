import { useState } from 'react';
import { subscriptionPlans } from '@/data/mock';
import { CheckCircle2, Crown, Zap } from 'lucide-react';

export default function Subscriptions() {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold flex items-center gap-2"><Crown className="w-5 h-5 text-amber-500" /> الاشتراكات</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">اختر الخطة المناسبة لحجم متجرك</p>
      </div>

      <div className="flex justify-center mb-2">
        <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden text-sm">
          <button onClick={() => setBilling('monthly')}
            className={`px-5 py-2 font-medium transition-colors ${billing === 'monthly' ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900' : 'text-gray-500'}`}>
            شهري
          </button>
          <button onClick={() => setBilling('yearly')}
            className={`px-5 py-2 font-medium transition-colors flex items-center gap-1.5 ${billing === 'yearly' ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900' : 'text-gray-500'}`}>
            سنوي <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">وفّر 17%</span>
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        {subscriptionPlans.map((plan, i) => (
          <div key={i} className={`card p-5 ${plan.current ? 'ring-2 ring-gray-900 dark:ring-white' : ''}`}>
            {plan.current && (
              <div className="flex items-center gap-1.5 text-xs font-medium text-green-700 dark:text-green-400 mb-3 bg-green-50 dark:bg-green-950/30 px-2 py-1 rounded-full w-fit">
                <Zap className="w-3 h-3" /> خطتك الحالية
              </div>
            )}

            <div className="mb-4">
              <h3 className="font-bold text-lg">{plan.nameAr}</h3>
              <p className="text-xs text-gray-400">{plan.name}</p>
            </div>

            <div className="mb-5">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold">
                  {billing === 'yearly' ? Math.round(plan.yearlyPrice / 12) : plan.monthlyPrice}
                </span>
                <span className="text-sm text-gray-500">ر.س/شهر</span>
              </div>
              {billing === 'yearly' && (
                <p className="text-xs text-green-600 mt-0.5">{plan.yearlyPrice.toLocaleString()} ر.س/سنة</p>
              )}
            </div>

            <ul className="space-y-2 mb-5">
              {plan.features.map((f, j) => (
                <li key={j} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="text-gray-600 dark:text-gray-400">{f}</span>
                </li>
              ))}
            </ul>

            <button className={`w-full py-2.5 rounded-lg font-medium text-sm transition-opacity hover:opacity-90 ${plan.current ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900' : 'border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
              {plan.current ? 'خطتك الحالية' : 'الترقية'}
            </button>
          </div>
        ))}
      </div>

      <div className="card p-4 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>جميع الخطط تتضمن: دعم فني، SSL، تحديثات مجانية</p>
        <p className="mt-0.5">للاستفسارات تواصل معنا: <a href="mailto:support@m20.ai" className="text-brand-600 hover:underline">support@m20.ai</a></p>
      </div>
    </div>
  );
}
