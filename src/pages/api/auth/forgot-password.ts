import type { NextApiRequest, NextApiResponse } from 'next';
import { db as adminDb } from '@/lib/supabaseAdmin';
import { sendOtpEmail } from '@/lib/email';

function generateOtp(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  const safeResponse = { success: true, message: 'If this email exists, a reset code has been sent.' };

  try {
    await adminDb.from('login_attempts').insert({
      email,
      ip_address: (req.headers['x-forwarded-for'] as string)?.split(',')[0] || req.socket.remoteAddress || 'unknown',
      user_agent: req.headers['user-agent'] || 'unknown',
      success: true,
      failure_reason: 'password_reset_request',
    });

    const { data: profile } = await adminDb
      .from('profiles')
      .select('id, email, full_name')
      .eq('email', email.toLowerCase().trim())
      .single();

    if (!profile) {
      return res.status(200).json(safeResponse);
    }

    await adminDb.from('password_reset_tokens')
      .update({ used: true })
      .eq('user_id', profile.id)
      .eq('used', false);

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    await adminDb.from('password_reset_tokens').insert({
      user_id: profile.id,
      token: otp,
      expires_at: expiresAt,
    });

    await sendOtpEmail(profile.email, profile.full_name || 'User', otp, 'recovery');

    return res.status(200).json(safeResponse);
  } catch {
    return res.status(200).json(safeResponse);
  }
}
