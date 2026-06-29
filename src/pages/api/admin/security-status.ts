import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAdmin } from '@/lib/auth';
import { db as adminDb } from '@/lib/supabaseAdmin';

/**
 * Admin diagnostic: verifies that the Supabase Before-Sign-In lockout hook
 * function exists in the database. (Whether it's actually enabled in the
 * Supabase dashboard cannot be queried via SQL — operators must enable it
 * manually; see SECURITY.md and supabase/auth-hooks.sql.)
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const admin = await requireAdmin(req, res);
  if (!admin) return;

  const checks: Record<string, { ok: boolean; detail?: string }> = {};

  try {
    const probeEmail = `__probe_${Date.now()}_${Math.random().toString(36).slice(2, 10)}@security-status.invalid`;
    const { data, error } = await adminDb.rpc('auth_hook_before_signin', {
      event: { user: { email: probeEmail } },
    });
    if (error) {
      checks.lockout_hook_function = { ok: false, detail: error.message };
    } else {
      const decision = (data as any)?.decision;
      // Function exists and executed successfully if we got any valid decision.
      // (`reject` is still a valid execution; `continue` is expected for a fresh probe email.)
      const ok = decision === 'continue' || decision === 'reject';
      checks.lockout_hook_function = {
        ok,
        detail: `Function present and executed. Probe decision=${decision}.`,
      };
    }
  } catch (e: any) {
    checks.lockout_hook_function = { ok: false, detail: e?.message || 'unknown' };
  }

  try {
    const { error } = await adminDb.from('login_attempts').select('id').limit(1);
    checks.login_attempts_readable = { ok: !error, detail: error?.message };
  } catch (e: any) {
    checks.login_attempts_readable = { ok: false, detail: e?.message || 'unknown' };
  }

  const envChecks = {
    ENCRYPTION_KEY: !!process.env.ENCRYPTION_KEY,
    SESSION_SECRET: !!process.env.SESSION_SECRET,
    SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
  };

  const allOk =
    Object.values(checks).every((c) => c.ok) &&
    Object.values(envChecks).every(Boolean);

  return res.status(allOk ? 200 : 503).json({
    overall: allOk ? 'ok' : 'attention_required',
    checks,
    envChecks,
    notes: [
      'lockout_hook_function.ok=true means the SQL function exists. You MUST also enable it in Supabase dashboard → Authentication → Hooks → Before User Sign In, otherwise direct gotrue calls bypass lockout.',
    ],
  });
}
