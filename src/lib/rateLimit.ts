import type { NextApiRequest, NextApiResponse } from 'next';

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

const MAX_BUCKETS = 10000;
const SWEEP_INTERVAL_MS = 60 * 1000;

let lastSweep = Date.now();

function sweep(now: number) {
  const expiredKeys: string[] = [];
  buckets.forEach((b, key) => {
    if (b.resetAt < now) expiredKeys.push(key);
  });
  for (const k of expiredKeys) buckets.delete(k);

  if (buckets.size > MAX_BUCKETS) {
    const sorted: Array<[string, Bucket]> = [];
    buckets.forEach((b, k) => sorted.push([k, b]));
    sorted.sort((a, b) => a[1].resetAt - b[1].resetAt);
    const toDrop = buckets.size - Math.floor(MAX_BUCKETS * 0.8);
    for (let i = 0; i < toDrop && i < sorted.length; i++) {
      buckets.delete(sorted[i][0]);
    }
  }
}

function maybeSweep(now: number) {
  if (now - lastSweep < SWEEP_INTERVAL_MS && buckets.size <= MAX_BUCKETS) return;
  lastSweep = now;
  sweep(now);
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
  const now = Date.now();
  maybeSweep(now);

  const ip = getClientIp(req);
  const key = `${opts.keyPrefix || 'global'}:${ip}`;

  let bucket = buckets.get(key);
  if (!bucket || bucket.resetAt < now) {
    bucket = { count: 0, resetAt: now + opts.windowMs };
    buckets.set(key, bucket);
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
