import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAuth, type AuthUser } from './auth';
import { db as adminDb } from './supabaseAdmin';

interface SubscriptionLimits {
  plan: string;
  max_campaigns: number;
  max_keywords: number;
  max_products: number;
  ai_queries_limit: number;
  ai_queries_used: number;
  features: Record<string, boolean>;
}

const DEFAULT_LIMITS: SubscriptionLimits = {
  plan: 'free',
  max_campaigns: 5,
  max_keywords: 100,
  max_products: 10,
  ai_queries_limit: 20,
  ai_queries_used: 0,
  features: { bulk_operations: false, advanced_ai: false, priority_support: false, custom_rules: false, api_access: false },
};

async function getSubscriptionLimits(userId: string): Promise<SubscriptionLimits> {
  const { data } = await adminDb
    .from('subscriptions')
    .select('plan, max_campaigns, max_keywords, max_products, ai_queries_limit, ai_queries_used, features')
    .eq('user_id', userId)
    .single();

  if (!data) return DEFAULT_LIMITS;
  return data as SubscriptionLimits;
}

export async function requireFeature(
  req: NextApiRequest,
  res: NextApiResponse,
  feature: string,
): Promise<AuthUser | null> {
  const user = await requireAuth(req, res);
  if (!user) return null;

  const limits = await getSubscriptionLimits(user.id);
  if (limits.features[feature] !== true && limits.plan !== 'enterprise') {
    res.status(403).json({
      error: 'Feature not available',
      message: `The "${feature}" feature requires a Pro or Enterprise subscription.`,
      upgrade_required: true,
      current_plan: limits.plan,
    });
    return null;
  }

  return user;
}

export async function checkAIQueryLimit(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<AuthUser | null> {
  const user = await requireAuth(req, res);
  if (!user) return null;

  const limits = await getSubscriptionLimits(user.id);

  if (limits.ai_queries_limit !== -1 && limits.ai_queries_used >= limits.ai_queries_limit) {
    res.status(429).json({
      error: 'AI query limit reached',
      message: `You have used all ${limits.ai_queries_limit} AI queries for this period. Upgrade your plan for more.`,
      upgrade_required: true,
      current_plan: limits.plan,
      used: limits.ai_queries_used,
      limit: limits.ai_queries_limit,
    });
    return null;
  }

  return user;
}

export async function incrementAIQueryCount(userId: string): Promise<void> {
  const { data: existing } = await adminDb
    .from('subscriptions')
    .select('id')
    .eq('user_id', userId)
    .single();

  if (!existing) {
    await adminDb.from('subscriptions').insert({
      user_id: userId,
      plan: 'free',
      status: 'active',
      max_campaigns: DEFAULT_LIMITS.max_campaigns,
      max_keywords: DEFAULT_LIMITS.max_keywords,
      max_products: DEFAULT_LIMITS.max_products,
      ai_queries_limit: DEFAULT_LIMITS.ai_queries_limit,
      ai_queries_used: 1,
      features: DEFAULT_LIMITS.features,
    });
    return;
  }

  const { error: rpcError } = await adminDb.rpc('increment_ai_queries_used', { p_user_id: userId });

  if (rpcError) {
    const { data } = await adminDb
      .from('subscriptions')
      .select('ai_queries_used')
      .eq('user_id', userId)
      .single();
    await adminDb
      .from('subscriptions')
      .update({ ai_queries_used: (data?.ai_queries_used ?? 0) + 1 })
      .eq('user_id', userId);
  }
}

export async function checkResourceLimit(
  userId: string,
  resource: 'campaigns' | 'keywords' | 'products',
): Promise<{ allowed: boolean; current: number; limit: number; plan: string }> {
  const limits = await getSubscriptionLimits(userId);

  const limitKey = `max_${resource}` as keyof SubscriptionLimits;
  const maxLimit = limits[limitKey] as number;

  if (maxLimit === -1) {
    return { allowed: true, current: 0, limit: -1, plan: limits.plan };
  }

  const { count } = await adminDb
    .from(resource)
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId);

  const current = count ?? 0;

  return {
    allowed: current < maxLimit,
    current,
    limit: maxLimit,
    plan: limits.plan,
  };
}
