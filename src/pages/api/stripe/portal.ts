import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAuth } from '@/lib/auth';
import { stripe } from '@/lib/stripe';
import { db as adminDb } from '@/lib/supabaseAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const auth = await requireAuth(req, res);
  if (!auth) return;

  const { data: sub } = await adminDb
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('user_id', auth.id)
    .single();

  if (!sub?.stripe_customer_id) {
    return res.status(400).json({ error: 'No active subscription found' });
  }

  const baseUrl = process.env.REPLIT_DEV_DOMAIN
    ? `https://${process.env.REPLIT_DEV_DOMAIN}`
    : 'http://localhost:5000';

  const session = await stripe.billingPortal.sessions.create({
    customer: sub.stripe_customer_id,
    return_url: `${baseUrl}/subscriptions`,
  });

  return res.status(200).json({ url: session.url });
}
