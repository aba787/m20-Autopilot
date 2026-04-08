import { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n';
import { Crown, Zap, Building2, Check, ArrowRight } from 'lucide-react';
import { useAuth, authFetch } from '@/lib/useAuth';

const CARD = { background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '0.875rem', boxShadow: 'var(--card-shadow)' } as const;

const PLANS = [
  {
    id: 'free',
    icon: Zap,
    name: 'Free',
    price: 0,
    period: '/mo',
    description: 'Get started with basic campaign management',
    features: [
      'Up to 5 campaigns',
      '100 keywords tracked',
      '10 products',
      '20 AI queries/month',
      'Basic analytics',
      'Community support',
    ],
    color: '#64748b',
    gradient: 'linear-gradient(135deg, #475569, #64748b)',
  },
  {
    id: 'pro',
    icon: Crown,
    name: 'Pro',
    price: 49,
    period: '/mo',
    description: 'For serious sellers scaling their ads',
    popular: true,
    features: [
      'Up to 50 campaigns',
      '2,000 keywords tracked',
      '200 products',
      '500 AI queries/month',
      'Advanced analytics & reports',
      'Bulk operations',
      'Automation rules',
      'Priority email support',
    ],
    color: 'var(--accent)',
    gradient: 'var(--accent-gradient)',
  },
  {
    id: 'enterprise',
    icon: Building2,
    name: 'Enterprise',
    price: 199,
    period: '/mo',
    description: 'Unlimited power for agencies & large sellers',
    features: [
      'Unlimited campaigns',
      'Unlimited keywords',
      'Unlimited products',
      'Unlimited AI queries',
      'Custom automation rules',
      'API access',
      'White-label reports',
      'Dedicated account manager',
      'Priority phone & chat support',
    ],
    color: '#a78bfa',
    gradient: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
  },
];

export default function Subscriptions() {
  const { t } = useI18n();
  const { token } = useAuth();
  const af = authFetch(token);
  const [currentPlan, setCurrentPlan] = useState('free');
  const [upgrading, setUpgrading] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    af('/api/subscriptions').then(r => r.json()).then(data => {
      if (data.currentPlan?.plan) setCurrentPlan(data.currentPlan.plan);
    }).catch(() => {});
  }, [token]);

  const handleUpgrade = async (planId: string) => {
    if (planId === currentPlan) return;
    setUpgrading(planId);
    try {
      const res = await af('/api/subscriptions', {
        method: 'POST',
        body: JSON.stringify({ plan: planId }),
      });
      if (res.ok) setCurrentPlan(planId);
    } finally {
      setUpgrading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">{t('nav.subscriptions')}</h1>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Choose the plan that fits your business</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {PLANS.map(plan => {
          const isCurrent = plan.id === currentPlan;
          return (
            <div key={plan.id} className="relative flex flex-col p-5" style={{
              ...CARD,
              ...(plan.popular ? { border: `2px solid var(--accent)`, boxShadow: 'var(--accent-glow)' } : {}),
            }}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-xs font-bold"
                  style={{ background: 'var(--accent-gradient)', color: 'var(--btn-text)' }}>
                  Most Popular
                </div>
              )}

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: plan.gradient }}>
                  <plan.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white">{plan.name}</h3>
                  <p className="text-xs" style={{ color: 'var(--text-dim)' }}>{plan.description}</p>
                </div>
              </div>

              <div className="mb-5">
                <span className="text-3xl font-bold text-white">${plan.price}</span>
                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{plan.period}</span>
              </div>

              <div className="space-y-2.5 mb-6 flex-1">
                {plan.features.map(f => (
                  <div key={f} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: plan.color }} />
                    <span style={{ color: 'var(--text-secondary)' }}>{f}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => handleUpgrade(plan.id)}
                disabled={isCurrent || upgrading === plan.id}
                className="w-full py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all"
                style={isCurrent ? {
                  background: 'var(--input-bg)',
                  color: 'var(--text-dim)',
                  border: '1px solid var(--border-primary)',
                } : plan.popular ? {
                  background: 'var(--accent-gradient)',
                  color: 'var(--btn-text)',
                  boxShadow: 'var(--accent-glow)',
                } : {
                  background: 'transparent',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border-primary)',
                }}>
                {isCurrent ? 'Current Plan' : upgrading === plan.id ? 'Processing...' : (
                  <>Upgrade <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </div>
          );
        })}
      </div>

      <div className="p-5" style={CARD}>
        <h3 className="font-bold text-sm text-white mb-3">All plans include</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {['SSL encryption', 'Daily data sync', 'Multi-language UI', 'AI chatbot assistant'].map(f => (
            <div key={f} className="flex items-center gap-2 text-sm">
              <Check className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--success)' }} />
              <span style={{ color: 'var(--text-muted)' }}>{f}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
