import type { NextApiRequest, NextApiResponse } from 'next';
import { stripe } from '@/lib/stripe';
import { db as adminDb } from '@/lib/supabaseAdmin';
import Stripe from 'stripe';

export const config = { api: { bodyParser: false } };

async function getRawBody(req: NextApiRequest): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk: Buffer) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

const PLAN_LIMITS = {
  pro: {
    plan: 'pro',
    max_campaigns: 50,
    max_keywords: 2000,
    max_products: 100,
    ai_queries_limit: 500,
    features: { bulk_operations: true, advanced_ai: true, priority_support: false, custom_rules: true, api_access: false },
  },
  enterprise: {
    plan: 'enterprise',
    max_campaigns: -1,
    max_keywords: -1,
    max_products: -1,
    ai_queries_limit: -1,
    features: { bulk_operations: true, advanced_ai: true, priority_support: true, custom_rules: true, api_access: true },
  },
  free: {
    plan: 'free',
    max_campaigns: 5,
    max_keywords: 100,
    max_products: 10,
    ai_queries_limit: 20,
    features: { bulk_operations: false, advanced_ai: false, priority_support: false, custom_rules: false, api_access: false },
  },
};

async function activatePlan(userId: string, plan: string, stripeSubId: string, stripeCustomerId: string) {
  const limits = PLAN_LIMITS[plan as keyof typeof PLAN_LIMITS] || PLAN_LIMITS.free;
  await adminDb.from('subscriptions').upsert({
    user_id: userId,
    stripe_customer_id: stripeCustomerId,
    stripe_subscription_id: stripeSubId,
    status: 'active',
    ...limits,
    current_period_start: new Date().toISOString(),
    current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  }, { onConflict: 'user_id' });

  await adminDb.from('profiles').update({
    subscription_plan: plan,
    subscription_status: 'active',
  }).eq('id', userId);
}

async function deactivatePlan(userId: string) {
  await adminDb.from('subscriptions').upsert({
    user_id: userId,
    plan: 'free',
    status: 'canceled',
    ...PLAN_LIMITS.free,
    current_period_end: new Date().toISOString(),
  }, { onConflict: 'user_id' });

  await adminDb.from('profiles').update({
    subscription_plan: 'free',
    subscription_status: 'inactive',
  }).eq('id', userId);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const sig = req.headers['stripe-signature'];
  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return res.status(400).json({ error: 'Missing signature or webhook secret' });
  }

  const rawBody = await getRawBody(req);
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err: any) {
    return res.status(400).json({ error: `Webhook signature failed: ${err.message}` });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.user_id;
        const plan = session.metadata?.plan;
        if (!userId || !plan) break;

        const subId = session.subscription as string;
        const customerId = session.customer as string;
        await activatePlan(userId, plan, subId, customerId);
        break;
      }

      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription;
        const userId = sub.metadata?.user_id;
        const plan = sub.metadata?.plan;
        if (!userId || !plan) break;

        if (sub.status === 'active') {
          await activatePlan(userId, plan, sub.id, sub.customer as string);
        } else if (['canceled', 'unpaid', 'past_due'].includes(sub.status)) {
          await deactivatePlan(userId);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription;
        const userId = sub.metadata?.user_id;
        if (!userId) break;
        await deactivatePlan(userId);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const subId = (invoice as any).subscription as string | null;
        if (!subId) break;

        const stripeSub = await stripe.subscriptions.retrieve(subId);
        const userId = stripeSub.metadata?.user_id;
        if (!userId) break;

        await adminDb.from('subscriptions')
          .update({ status: 'past_due' })
          .eq('user_id', userId);
        break;
      }
    }
  } catch (err: any) {
    console.error('Webhook handler error:', err.message);
    return res.status(500).end();
  }

  return res.status(200).json({ received: true });
}
