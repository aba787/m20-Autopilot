import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useI18n } from '@/lib/i18n';
import { Crown, Zap, Building2, Check, ArrowRight, ExternalLink, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth, authFetch } from '@/lib/useAuth';

const CARD = { background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '0.875rem', boxShadow: 'var(--card-shadow)' } as const;

const PLANS = [
  {
    id: 'free',
    icon: Zap,
    name: 'Free',
    nameAr: 'مجاني',
    price: 0,
    currency: 'SAR',
    period: '/mo',
    periodAr: '/شهر',
    description: 'Get started with basic campaign management',
    descriptionAr: 'ابدأ بإدارة الحملات الأساسية',
    features: [
      { en: 'Up to 5 campaigns', ar: 'حتى 5 حملات' },
      { en: '100 keywords tracked', ar: '100 كلمة مفتاحية' },
      { en: '10 products', ar: '10 منتجات' },
      { en: '20 AI queries/month', ar: '20 استفسار ذكاء اصطناعي/شهر' },
      { en: 'Basic analytics', ar: 'تحليلات أساسية' },
      { en: 'Community support', ar: 'دعم المجتمع' },
    ],
    color: '#64748b',
    gradient: 'linear-gradient(135deg, #475569, #64748b)',
  },
  {
    id: 'pro',
    icon: Crown,
    name: 'Pro',
    nameAr: 'احترافي',
    price: 49,
    currency: 'SAR',
    period: '/mo',
    periodAr: '/شهر',
    description: 'For serious sellers scaling their ads',
    descriptionAr: 'للبائعين الجادين الذين يوسّعون إعلاناتهم',
    popular: true,
    features: [
      { en: 'Up to 50 campaigns', ar: 'حتى 50 حملة' },
      { en: '2,000 keywords tracked', ar: '2,000 كلمة مفتاحية' },
      { en: '200 products', ar: '200 منتج' },
      { en: '500 AI queries/month', ar: '500 استفسار ذكاء اصطناعي/شهر' },
      { en: 'Advanced analytics & reports', ar: 'تحليلات وتقارير متقدمة' },
      { en: 'Bulk operations', ar: 'العمليات الجماعية' },
      { en: 'Automation rules', ar: 'قواعد الأتمتة' },
      { en: 'Priority email support', ar: 'دعم بريد إلكتروني أولوية' },
    ],
    color: 'var(--accent)',
    gradient: 'var(--accent-gradient)',
  },
  {
    id: 'enterprise',
    icon: Building2,
    name: 'Enterprise',
    nameAr: 'المؤسسات',
    price: 199,
    currency: 'SAR',
    period: '/mo',
    periodAr: '/شهر',
    description: 'Unlimited power for agencies & large sellers',
    descriptionAr: 'قوة لا محدودة للوكالات والبائعين الكبار',
    features: [
      { en: 'Unlimited campaigns', ar: 'حملات غير محدودة' },
      { en: 'Unlimited keywords', ar: 'كلمات مفتاحية غير محدودة' },
      { en: 'Unlimited products', ar: 'منتجات غير محدودة' },
      { en: 'Unlimited AI queries', ar: 'استفسارات ذكاء اصطناعي غير محدودة' },
      { en: 'Custom automation rules', ar: 'قواعد أتمتة مخصصة' },
      { en: 'API access', ar: 'وصول إلى API' },
      { en: 'White-label reports', ar: 'تقارير بعلامتك التجارية' },
      { en: 'Dedicated account manager', ar: 'مدير حساب مخصص' },
      { en: 'Priority phone & chat support', ar: 'دعم هاتف وشات أولوية' },
    ],
    color: '#a78bfa',
    gradient: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
  },
];

export default function Subscriptions() {
  const { t, lang } = useI18n();
  const { token } = useAuth();
  const router = useRouter();
  const af = authFetch(token);
  const isAr = lang === 'ar';

  const [currentPlan, setCurrentPlan] = useState('free');
  const [subStatus, setSubStatus] = useState<string>('active');
  const [hasStripeCustomer, setHasStripeCustomer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionPlan, setActionPlan] = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);

  const { success, canceled } = router.query;

  useEffect(() => {
    if (!token) return;
    af('/api/subscriptions')
      .then(r => r.json())
      .then(data => {
        if (data.currentPlan?.plan) setCurrentPlan(data.currentPlan.plan);
        if (data.currentPlan?.status) setSubStatus(data.currentPlan.status);
        if (data.currentPlan?.stripe_customer_id) setHasStripeCustomer(true);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  const handleUpgrade = async (planId: string) => {
    if (planId === 'free') return;
    if (planId === currentPlan) return;
    setActionPlan(planId);
    try {
      const res = await af('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setActionPlan(null);
    }
  };

  const handlePortal = async () => {
    setPortalLoading(true);
    try {
      const res = await af('/api/stripe/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
    } finally {
      setPortalLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {isAr ? 'خطط الاشتراك' : 'Subscription Plans'}
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {isAr ? 'اختر الخطة المناسبة لعملك' : 'Choose the plan that fits your business'}
          </p>
        </div>
        {hasStripeCustomer && (
          <button
            onClick={handlePortal}
            disabled={portalLoading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold"
            style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', color: 'var(--text-secondary)', cursor: 'pointer' }}
          >
            <ExternalLink className="w-4 h-4" />
            {portalLoading ? (isAr ? 'جاري التحميل...' : 'Loading...') : (isAr ? 'إدارة الفاتورة' : 'Manage Billing')}
          </button>
        )}
      </div>

      {success && (
        <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)' }}>
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: '#22c55e' }} />
          <div>
            <p className="font-semibold text-sm" style={{ color: '#22c55e' }}>
              {isAr ? 'تم الاشتراك بنجاح!' : 'Subscription activated!'}
            </p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {isAr ? 'تم تفعيل خطتك الجديدة. قد يستغرق التحديث لحظة.' : 'Your plan is now active. It may take a moment to reflect.'}
            </p>
          </div>
        </div>
      )}

      {canceled && (
        <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
          <AlertCircle className="w-5 h-5 flex-shrink-0" style={{ color: '#ef4444' }} />
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {isAr ? 'تم إلغاء عملية الدفع. لم يتم خصم أي مبلغ.' : 'Payment canceled. You were not charged.'}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {PLANS.map(plan => {
          const isCurrent = plan.id === currentPlan;
          const isProcessing = actionPlan === plan.id;
          const isPaid = plan.id !== 'free';

          return (
            <div key={plan.id} className="relative flex flex-col p-5" style={{
              ...CARD,
              ...(plan.popular ? { border: `2px solid var(--accent)`, boxShadow: 'var(--accent-glow)' } : {}),
              opacity: loading ? 0.6 : 1,
            }}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-xs font-bold"
                  style={{ background: 'var(--accent-gradient)', color: 'var(--btn-text)' }}>
                  {isAr ? 'الأكثر شيوعاً' : 'Most Popular'}
                </div>
              )}

              {isCurrent && (
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-xs font-bold"
                  style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)' }}>
                  {isAr ? 'خطتك الحالية' : 'Current'}
                </div>
              )}

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: plan.gradient }}>
                  <plan.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>
                    {isAr ? plan.nameAr : plan.name}
                  </h3>
                  <p className="text-xs" style={{ color: 'var(--text-dim)' }}>
                    {isAr ? plan.descriptionAr : plan.description}
                  </p>
                </div>
              </div>

              <div className="mb-5">
                <span className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  {plan.price === 0 ? (isAr ? 'مجاناً' : 'Free') : `${plan.price} ${isAr ? 'ر.س' : 'SAR'}`}
                </span>
                {plan.price > 0 && (
                  <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    {isAr ? plan.periodAr : plan.period}
                  </span>
                )}
              </div>

              <div className="space-y-2.5 mb-6 flex-1">
                {plan.features.map((f, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: plan.color }} />
                    <span style={{ color: 'var(--text-secondary)' }}>{isAr ? f.ar : f.en}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => isPaid && !isCurrent ? handleUpgrade(plan.id) : undefined}
                disabled={isCurrent || isProcessing || !isPaid}
                className="w-full py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all"
                style={isCurrent ? {
                  background: 'var(--input-bg)',
                  color: '#22c55e',
                  border: '1px solid rgba(34,197,94,0.3)',
                  cursor: 'default',
                } : !isPaid ? {
                  background: 'var(--input-bg)',
                  color: 'var(--text-dim)',
                  border: '1px solid var(--border-primary)',
                  cursor: 'default',
                } : plan.popular ? {
                  background: isProcessing ? 'var(--input-bg)' : 'var(--accent-gradient)',
                  color: isProcessing ? 'var(--text-dim)' : 'var(--btn-text)',
                  boxShadow: isProcessing ? 'none' : 'var(--accent-glow)',
                  cursor: isProcessing ? 'not-allowed' : 'pointer',
                  border: 'none',
                } : {
                  background: isProcessing ? 'var(--input-bg)' : 'transparent',
                  color: isProcessing ? 'var(--text-dim)' : 'var(--text-secondary)',
                  border: '1px solid var(--border-primary)',
                  cursor: isProcessing ? 'not-allowed' : 'pointer',
                }}>
                {isCurrent ? (
                  <><CheckCircle2 className="w-4 h-4" /> {isAr ? 'خطتك الحالية' : 'Current Plan'}</>
                ) : isProcessing ? (
                  isAr ? 'جاري التوجيه...' : 'Redirecting...'
                ) : !isPaid ? (
                  isAr ? 'مجاني دائماً' : 'Always Free'
                ) : (
                  <>{isAr ? 'الترقية الآن' : 'Upgrade Now'} <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </div>
          );
        })}
      </div>

      <div className="p-5" style={CARD}>
        <h3 className="font-bold text-sm mb-3" style={{ color: 'var(--text-primary)' }}>
          {isAr ? 'جميع الخطط تشمل' : 'All plans include'}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { en: 'SSL encryption', ar: 'تشفير SSL' },
            { en: 'Daily data sync', ar: 'مزامنة يومية للبيانات' },
            { en: 'Multi-language UI', ar: 'واجهة متعددة اللغات' },
            { en: 'AI chatbot assistant', ar: 'مساعد ذكاء اصطناعي' },
          ].map((f, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <Check className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--success)' }} />
              <span style={{ color: 'var(--text-muted)' }}>{isAr ? f.ar : f.en}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 rounded-xl text-sm text-center" style={{ background: 'var(--bg-secondary)', color: 'var(--text-dim)' }}>
        {isAr
          ? 'المدفوعات معالجة بأمان عبر Stripe · يمكنك إلغاء الاشتراك في أي وقت'
          : 'Payments securely processed by Stripe · Cancel anytime from Manage Billing'}
      </div>
    </div>
  );
}
