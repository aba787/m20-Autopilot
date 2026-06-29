import type { NextApiRequest, NextApiResponse } from 'next';
import { optionalAuth } from '@/lib/auth';
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

  return res.status(405).json({ error: 'Method not allowed' });
}
