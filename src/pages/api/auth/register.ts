import type { NextApiRequest, NextApiResponse } from 'next';
import { db as adminDb } from '@/lib/supabaseAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, password, full_name } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' });
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
        target_acos: 30,
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
      target_acos: 30,
      role: 'user',
      email_notifications: true,
    });

    return res.status(200).json({ success: true, userId, requiresOtp: true });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || 'Registration failed' });
  }
}
