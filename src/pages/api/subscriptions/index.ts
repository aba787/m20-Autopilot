import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAuth, optionalAuth } from '@/lib/auth';
import { db as adminDb } from '@/lib/supabaseAdmin';

const PLANS = {
  free: {
    name: 'Free',
    price: 0,
    max_campaigns: 5,
    max_keywords: 100,
    max_products: 10,
    ai_queries_limit: 20,
    features: { bulk_operations: false, advanced_ai: false, priority_support: false, custom_rules: false, api_access: false },
  },
  pro: {
    name: 'Pro',
    price: 49,
    max_campaigns: 50,
    max_keywords: 2000,
    max_products: 100,
    ai_queries_limit: 500,
    features: { bulk_operations: true, advanced_ai: true, priority_support: false, custom_rules: true, api_access: false },
  },
  enterprise: {
    name: 'Enterprise',
    price: 199,
    max_campaigns: -1,
    max_keywords: -1,
    max_products: -1,
    ai_queries_limit: -1,
    features: { bulk_operations: true, advanced_ai: true, priority_support: true, custom_rules: true, api_access: true },
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const auth = await optionalAuth(req);

    if (!auth) {
      return res.status(200).json({ plans: PLANS, currentPlan: null });
    }

    const { data: sub } = await adminDb
      .from('subscriptions')
      .select('*')
      .eq('user_id', auth.id)
      .single();

    return res.status(200).json({
      plans: PLANS,
      currentPlan: sub || { plan: 'free', status: 'active', ...PLANS.free },
    });
  }

  if (req.method === 'POST') {
    const auth = await requireAuth(req, res);
    if (!auth) return;

    const { plan } = req.body;
    if (!plan || !PLANS[plan as keyof typeof PLANS]) {
      return res.status(400).json({ error: 'Invalid plan' });
    }

    const planData = PLANS[plan as keyof typeof PLANS];

    const { data, error } = await adminDb
      .from('subscriptions')
      .upsert({
        user_id: auth.id,
        plan,
        status: 'active',
        max_campaigns: planData.max_campaigns,
        max_keywords: planData.max_keywords,
        max_products: planData.max_products,
        ai_queries_limit: planData.ai_queries_limit,
        ai_queries_used: 0,
        features: planData.features,
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      }, { onConflict: 'user_id' })
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });

    await adminDb
      .from('profiles')
      .update({ subscription_plan: plan, subscription_status: 'active' })
      .eq('id', auth.id);

    return res.status(200).json({ success: true, subscription: data });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
