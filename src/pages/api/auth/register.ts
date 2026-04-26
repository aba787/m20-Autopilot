import type { NextApiRequest, NextApiResponse } from 'next';
import { db as adminDb } from '@/lib/supabaseAdmin';
import { sendOtpEmail } from '@/lib/email';

function generateOtp(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

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

  try {
    const { data: existing } = await adminDb
      .from('profiles')
      .select('id')
      .eq('email', emailNorm)
      .single();

    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists' });
    }

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

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    await adminDb.from('password_reset_tokens').insert({
      user_id: userId,
      token: `signup_${otp}`,
      expires_at: expiresAt,
    });

    sendOtpEmail(emailNorm, full_name || 'User', otp, 'signup').catch(() => {});

    return res.status(200).json({ success: true, userId, requiresOtp: true });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || 'Registration failed' });
  }
}
