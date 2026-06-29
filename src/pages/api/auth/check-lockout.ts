import type { NextApiRequest, NextApiResponse } from 'next';
import { rateLimit, RateLimits } from '@/lib/rateLimit';
import { checkLockout } from '@/lib/lockout';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!rateLimit(req, res, { ...RateLimits.authStrict, keyPrefix: 'check-lockout' })) return;

  const { email } = req.body || {};
  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Email is required' });
  }

  let status;
  try {
    status = await checkLockout(email);
  } catch {
    return res.status(503).json({ error: 'Service temporarily unavailable' });
  }

  if (status.locked) {
    res.setHeader('Retry-After', String(status.retryAfterSeconds));
    return res.status(423).json({
      locked: true,
      retryAfterSeconds: status.retryAfterSeconds,
      message: 'Too many failed attempts. Please try again later.',
    });
  }
  return res.status(200).json({ locked: false });
}
