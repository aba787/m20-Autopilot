import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-05-28.basil',
});

export const STRIPE_PLANS = {
  pro: {
    name: 'Pro',
    monthlyPriceId: process.env.STRIPE_PRO_PRICE_ID || '',
  },
  enterprise: {
    name: 'Enterprise',
    monthlyPriceId: process.env.STRIPE_ENTERPRISE_PRICE_ID || '',
  },
};
