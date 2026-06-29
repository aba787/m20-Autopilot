import type { NextApiRequest, NextApiResponse } from 'next';
import { db as adminDb } from '@/lib/supabaseAdmin';
import { rateLimit, RateLimits } from '@/lib/rateLimit';

// Find an auth user by email, paginating through all pages so users beyond the
// first page are still detected as the user base grows.
async function findAuthUserByEmail(emailNorm: string) {
    const perPage = 200;
    for (let page = 1; page <= 50; page++) {
          const { data, error } = await adminDb.auth.admin.listUsers({ page, perPage });
          if (error) throw error;
          const users = data?.users ?? [];
          const match = users.find((u: any) => u.email?.toLowerCase() === emailNorm);
          if (match) return match;
          if (users.length < perPage) break;
    }
    return null;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    if (!rateLimit(req, res, { ...RateLimits.authStrict, keyPrefix: 'register' })) return;

  const { email, password, full_name } = req.body;

  if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
  }
    if (password.length < 12) {
          return res.status(400).json({ error: 'Password must be at least 12 characters' });
    }
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasDigit = /[0-9]/.test(password);
    const hasSymbol = /[^A-Za-z0-9]/.test(password);
    const complexity = [hasUpper, hasLower, hasDigit, hasSymbol].filter(Boolean).length;
    if (complexity < 3) {
          return res.status(400).json({
                  error: 'Password must include at least 3 of: uppercase, lowercase, digit, symbol',
          });
    }

  const emailNorm = email.toLowerCase().trim();
    const checkUnconfirmed = req.body._checkUnconfirmed === true;

  try {
        const existingAuthUser = await findAuthUserByEmail(emailNorm);

      if (existingAuthUser) {
              // Read-only probe used by the login flow. NEVER mutate the account here,
          // otherwise a probe with an attacker-supplied password could overwrite a
          // pending account's password (account takeover of unconfirmed accounts).
          if (checkUnconfirmed) {
                    return res.status(200).json({
                                confirmed: !!existingAuthUser.email_confirmed_at,
                                requiresOtp: !existingAuthUser.email_confirmed_at,
                                userId: existingAuthUser.id,
                    });
          }

          if (existingAuthUser.email_confirmed_at) {
                    return res.status(400).json({ error: 'An account with this email already exists. Please sign in.' });
          }

          // Genuine re-registration of an UNCONFIRMED account: allowed to reset the
          // pending password and re-send OTP.
          await adminDb.auth.admin.updateUserById(existingAuthUser.id, { password });

          await adminDb.from('profiles').upsert({
                    id: existingAuthUser.id,
                    email: emailNorm,
                    full_name: full_name?.trim() ?? null,
                    bot_mode: 'safe',
                    role: 'user',
                    email_notifications: true,
          });

          return res.status(200).json({ success: true, userId: existingAuthUser.id, requiresOtp: true });
      }

      if (checkUnconfirmed) return res.status(200).json({ confirmed: false, noAccount: true });

      const { data: authData, error: createError } = await adminDb.auth.admin.createUser({
              email: emailNorm,
              password,
              email_confirm: false,
              user_metadata: { full_name: full_name ?? '' },
      });

      if (createError || !authData.user) {
              return res.status(400).json({ error: createError?.message || 'Registration failed' });
      }

      const userId = authData.user.id;

      await adminDb.from('profiles').upsert({
              id: userId,
              email: emailNorm,
              full_name: full_name?.trim() ?? null,
              bot_mode: 'safe',
              role: 'user',
              email_notifications: true,
      });

      return res.status(200).json({ success: true, userId, requiresOtp: true });
  } catch (err: any) {
        return res.status(500).json({ error: err?.message || 'Registration failed' });
  }
}
