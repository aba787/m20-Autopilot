import { db as adminDb } from './supabaseAdmin';

export const LOCKOUT_MAX_FAILURES = 5;
export const LOCKOUT_WINDOW_MIN = 15;
export const LOCKOUT_DURATION_MIN = 15;

export interface LockoutStatus {
  locked: boolean;
  failuresInWindow: number;
  retryAfterSeconds: number;
  lockedUntil: string | null;
}

export class LockoutCheckError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'LockoutCheckError';
  }
}

/**
 * Account-wide lockout check.
 * Counts only `success = false` rows in the window, so fake "success" telemetry
 * cannot reset the chain. Scope is per-email (account-wide) per Amazon Ads API
 * compliance requirements — not per IP.
 *
 * Fails CLOSED: throws LockoutCheckError on DB error so callers can deny login.
 */
export async function checkLockout(email: string): Promise<LockoutStatus> {
  const normalized = email.toLowerCase().trim();
  const windowStart = new Date(Date.now() - LOCKOUT_WINDOW_MIN * 60 * 1000).toISOString();

  const { data, error } = await adminDb
    .from('login_attempts')
    .select('created_at')
    .eq('email', normalized)
    .eq('success', false)
    .gte('created_at', windowStart)
    .order('created_at', { ascending: false })
    .limit(LOCKOUT_MAX_FAILURES);

  if (error) {
    throw new LockoutCheckError(error.message || 'lockout_query_failed');
  }

  if (!data || data.length < LOCKOUT_MAX_FAILURES) {
    return {
      locked: false,
      failuresInWindow: data?.length || 0,
      retryAfterSeconds: 0,
      lockedUntil: null,
    };
  }

  const lastFailureAt = new Date(data[0].created_at).getTime();
  const lockedUntilMs = lastFailureAt + LOCKOUT_DURATION_MIN * 60 * 1000;
  const remainingMs = lockedUntilMs - Date.now();

  if (remainingMs <= 0) {
    return {
      locked: false,
      failuresInWindow: data.length,
      retryAfterSeconds: 0,
      lockedUntil: null,
    };
  }

  return {
    locked: true,
    failuresInWindow: data.length,
    retryAfterSeconds: Math.ceil(remainingMs / 1000),
    lockedUntil: new Date(lockedUntilMs).toISOString(),
  };
}
