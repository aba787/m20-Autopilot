import type { NextApiRequest, NextApiResponse } from 'next';
import { db as adminDb } from '@/lib/supabaseAdmin';
import { rateLimit, RateLimits } from '@/lib/rateLimit';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!rateLimit(req, res, { ...RateLimits.authStrict, keyPrefix: 'register' })) return;

  const { email, password, full_name } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  if (password.length < 10) {
    return res.status(400).json({ error: 'Password must be at least 10 characters' });
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
    const { data: userList } = await adminDb.auth.admin.listUsers();
    const existingAuthUser = userList?.users?.find(
      (u: any) => u.email?.toLowerCase() === emailNorm
    );

    if (existingAuthUser) {
      if (existingAuthUser.email_confirmed_at) {
        if (checkUnconfirmed) return res.status(200).json({ confirmed: true });
        return res.status(400).json({ error: 'An account with this email already exists. Please sign in.' });
      }

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
