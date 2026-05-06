import type { NextApiRequest, NextApiResponse } from 'next';

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

const MAX_BUCKETS = 10000;

function pruneIfNeeded() {
  if (buckets.size <= MAX_BUCKETS) return;
  const now = Date.now();
  buckets.forEach((b, key) => {
    if (b.resetAt < now) buckets.delete(key);
  });
}

export interface RateLimitOptions {
  windowMs: number;
  max: number;
  keyPrefix?: string;
}

export function getClientIp(req: NextApiRequest): string {
  const xff = req.headers['x-forwarded-for'];
  if (typeof xff === 'string' && xff.length > 0) return xff.split(',')[0].trim();
  if (Array.isArray(xff) && xff.length > 0) return xff[0];
  const real = req.headers['x-real-ip'];
  if (typeof real === 'string') return real;
  return req.socket.remoteAddress || 'unknown';
}

export function rateLimit(
  req: NextApiRequest,
  res: NextApiResponse,
  opts: RateLimitOptions,
): boolean {
  const ip = getClientIp(req);
  const key = `${opts.keyPrefix || 'global'}:${ip}`;
  const now = Date.now();

  let bucket = buckets.get(key);
  if (!bucket || bucket.resetAt < now) {
    bucket = { count: 0, resetAt: now + opts.windowMs };
    buckets.set(key, bucket);
    pruneIfNeeded();
  }

  bucket.count += 1;

  const remaining = Math.max(0, opts.max - bucket.count);
  res.setHeader('X-RateLimit-Limit', String(opts.max));
  res.setHeader('X-RateLimit-Remaining', String(remaining));
  res.setHeader('X-RateLimit-Reset', String(Math.ceil(bucket.resetAt / 1000)));

  if (bucket.count > opts.max) {
    const retryAfter = Math.ceil((bucket.resetAt - now) / 1000);
    res.setHeader('Retry-After', String(retryAfter));
    res.status(429).json({
      error: 'Too many requests. Please slow down and try again later.',
      retryAfter,
    });
    return false;
  }

  return true;
}

export const RateLimits = {
  authStrict: { windowMs: 15 * 60 * 1000, max: 10 },
  authNormal: { windowMs: 15 * 60 * 1000, max: 30 },
  ai: { windowMs: 60 * 1000, max: 20 },
  general: { windowMs: 60 * 1000, max: 60 },
} as const;
