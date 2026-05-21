import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { rateLimit, RateLimits, getClientIp } from '@/lib/rateLimit';
import { checkLockout, LOCKOUT_DURATION_MIN } from '@/lib/lockout';
import { db as adminDb } from '@/lib/supabaseAdmin';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const anonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabaseAuth = createClient(url, anonKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function logAttempt(
  email: string,
  ip: string,
  userAgent: string,
  success: boolean,
  reason?: string,
) {
  try {
    await adminDb.from('login_attempts').insert({
      email: email.toLowerCase().trim(),
      ip_address: ip,
      user_agent: userAgent,
      success,
      failure_reason: success ? null : (reason || 'unspecified'),
    });
  } catch {
    // best-effort logging
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!rateLimit(req, res, { ...RateLimits.authStrict, keyPrefix: 'login' })) return;

  const { email, password } = req.body || {};
  if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const ip = getClientIp(req);
  const userAgent = String(req.headers['user-agent'] || 'unknown');

  let lockoutStatus;
  try {
    lockoutStatus = await checkLockout(email);
  } catch {
    return res.status(503).json({ error: 'Authentication service temporarily unavailable. Please try again shortly.' });
  }

  if (lockoutStatus.locked) {
    res.setHeader('Retry-After', String(lockoutStatus.retryAfterSeconds));
    return res.status(423).json({
      locked: true,
      retryAfterSeconds: lockoutStatus.retryAfterSeconds,
      message: `Too many failed attempts. Please try again in ${Math.ceil(lockoutStatus.retryAfterSeconds / 60)} minutes.`,
    });
  }

  const { data, error } = await supabaseAuth.auth.signInWithPassword({ email, password });

  if (error || !data?.session) {
    await logAttempt(email, ip, userAgent, false, error?.message || 'invalid_credentials');

    let postCheck;
    try {
      postCheck = await checkLockout(email);
    } catch {
      postCheck = null;
    }
    if (postCheck?.locked) {
      res.setHeader('Retry-After', String(postCheck.retryAfterSeconds));
      return res.status(423).json({
        locked: true,
        retryAfterSeconds: postCheck.retryAfterSeconds,
        message: `Account locked due to repeated failed attempts. Try again in ${LOCKOUT_DURATION_MIN} minutes.`,
      });
    }
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  await logAttempt(email, ip, userAgent, true);

  return res.status(200).json({
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
    expires_at: data.session.expires_at,
    user: { id: data.user.id, email: data.user.email },
  });
}
