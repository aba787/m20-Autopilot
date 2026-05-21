-- ============================================================
-- Supabase Auth Hook: Before-Sign-In Lockout Enforcement
-- ============================================================
-- This hook is the AUTHORITATIVE lockout boundary. It runs inside the
-- Supabase Auth service BEFORE password verification, so even direct
-- gotrue API calls (bypassing our /api/auth/login endpoint) are gated.
--
-- DEPLOYMENT:
--   1. Run this file once in the Supabase SQL editor.
--   2. In the Supabase dashboard:
--        Authentication → Hooks → Before User Sign In
--        → Hook type: Postgres function
--        → Schema: public
--        → Function: auth_hook_before_signin
--   3. Click "Enable hook".
--
-- BEHAVIOR:
--   - 5 consecutive failed login_attempts within 15 minutes for the same
--     email → reject sign-in with HTTP 423 for the next 15 minutes.
--   - Counts only success=false rows, so spoofed success events cannot
--     reset the chain.
--
-- COMPLIANCE: Amazon Ads API account-protection requirement.
-- ============================================================

CREATE OR REPLACE FUNCTION public.auth_hook_before_signin(event jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_email     text;
  v_failures  int;
  v_last_fail timestamptz;
  v_locked_until timestamptz;
BEGIN
  v_email := lower(trim(coalesce(event->'user'->>'email', '')));
  IF v_email = '' THEN
    RETURN jsonb_build_object('decision', 'continue');
  END IF;

  SELECT count(*), max(created_at)
  INTO v_failures, v_last_fail
  FROM public.login_attempts
  WHERE email = v_email
    AND success = false
    AND created_at >= (now() - interval '15 minutes');

  IF v_failures >= 5 AND v_last_fail IS NOT NULL THEN
    v_locked_until := v_last_fail + interval '15 minutes';
    IF now() < v_locked_until THEN
      RETURN jsonb_build_object(
        'decision', 'reject',
        'message',  'Account temporarily locked due to repeated failed login attempts. Please try again later.'
      );
    END IF;
  END IF;

  RETURN jsonb_build_object('decision', 'continue');
END;
$$;

-- Grant Supabase Auth (supabase_auth_admin) permission to invoke the hook.
GRANT EXECUTE ON FUNCTION public.auth_hook_before_signin(jsonb) TO supabase_auth_admin;
-- service_role is granted EXECUTE solely so the admin diagnostic endpoint
-- (GET /api/admin/security-status) can probe function presence. The function
-- is read-only and idempotent; it never mutates data.
GRANT EXECUTE ON FUNCTION public.auth_hook_before_signin(jsonb) TO service_role;
REVOKE EXECUTE ON FUNCTION public.auth_hook_before_signin(jsonb) FROM authenticated, anon, public;
GRANT SELECT ON public.login_attempts TO supabase_auth_admin;
