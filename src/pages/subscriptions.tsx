import { useState } from 'react';
import { subscriptionPlans } from '@/data/mock';
import { Check, Crown } from 'lucide-react';

export default function Subscriptions() {
  const [yearly, setYearly] = useState(false);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">الاشتراكات</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">اختر الخطة المناسبة لاحتياجاتك</p>
      </div>

      <div className="flex items-center justify-center gap-3">
        <span className={`text-sm font-medium ${!yearly ? 'text-brand-600' : 'text-gray-500'}`}>شهري</span>
        <button onClick={() => setYearly(!yearly)}
          className={`w-12 h-6 rounded-full transition-colors relative ${yearly ? 'bg-brand-600' : 'bg-gray-300 dark:bg-gray-600'}`}>
          <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${yearly ? 'right-0.5' : 'right-[26px]'}`} />
        </button>
        <span className={`text-sm font-medium ${yearly ? 'text-brand-600' : 'text-gray-500'}`}>سنوي</span>
        {yearly && <span className="badge-success text-xs">وفر 17%</span>}
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {subscriptionPlans.map((plan, i) => (
          <div key={i} className={`card p-6 relative ${plan.current ? 'border-2 border-brand-500 shadow-lg shadow-brand-100 dark:shadow-brand-900/20' : ''}`}>
            {plan.current && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-600 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
                <Crown className="w-3 h-3" /> خطتك الحالية
              </div>
            )}
            <div className="text-center mb-6">
              <h3 className="text-lg font-bold">{plan.nameAr}</h3>
              <p className="text-xs text-gray-500">{plan.name}</p>
              <div className="mt-4">
                <span className="text-4xl font-bold">{yearly ? plan.yearlyPrice : plan.monthlyPrice}</span>
                <span className="text-gray-500 mr-1">ر.س / {yearly ? 'سنة' : 'شهر'}</span>
              </div>
            </div>
            <ul className="space-y-3 mb-6">
              {plan.features.map((f, j) => (
                <li key={j} className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            {plan.current ? (
              <button className="w-full py-2.5 rounded-lg border-2 border-brand-600 text-brand-600 font-medium text-sm">خطتك الحالية</button>
            ) : (
              <button className="w-full btn-primary py-2.5 text-sm">ترقية الآن</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
