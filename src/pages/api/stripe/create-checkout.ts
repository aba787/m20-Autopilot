import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAuth } from '@/lib/auth';
import { stripe } from '@/lib/stripe';
import { db as adminDb } from '@/lib/supabaseAdmin';

const PLAN_PRICES: Record<string, { amount: number; name: string }> = {
  pro:        { amount: 4900,  name: 'M20 Autopilot — Pro Plan' },
  enterprise: { amount: 19900, name: 'M20 Autopilot — Enterprise Plan' },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const auth = await requireAuth(req, res);
  if (!auth) return;

  const { plan } = req.body;
  if (!plan || !PLAN_PRICES[plan]) {
    return res.status(400).json({ error: 'Invalid plan. Must be "pro" or "enterprise".' });
  }

  const planData = PLAN_PRICES[plan];

  const { data: sub } = await adminDb
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('user_id', auth.id)
    .single();

  const { data: profile } = await adminDb
    .from('profiles')
    .select('email, full_name')
    .eq('id', auth.id)
    .single();

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL
  || (process.env.REPLIT_DEV_DOMAIN ? 'https://' + process.env.REPLIT_DEV_DOMAIN : 'http://localhost:5000');

  let customerId = sub?.stripe_customer_id || null;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: profile?.email || auth.email,
      name: profile?.full_name || undefined,
      metadata: { supabase_user_id: auth.id },
    });
    customerId = customer.id;

    await adminDb
      .from('subscriptions')
      .upsert({ user_id: auth.id, stripe_customer_id: customerId }, { onConflict: 'user_id' });
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    line_items: [
      {
        price_data: {
          currency: 'sar',
          product_data: { name: planData.name },
          unit_amount: planData.amount,
          recurring: { interval: 'month' },
        },
        quantity: 1,
      },
    ],
    metadata: { user_id: auth.id, plan },
    success_url: `${baseUrl}/subscriptions?success=1&plan=${plan}`,
    cancel_url: `${baseUrl}/subscriptions?canceled=1`,
    subscription_data: {
      metadata: { user_id: auth.id, plan },
    },
  });

  return res.status(200).json({ url: session.url });
}
