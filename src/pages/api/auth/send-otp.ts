import type { NextApiRequest, NextApiResponse } from 'next';
import { db as adminDb } from '@/lib/supabaseAdmin';
import { sendOtpEmail } from '@/lib/email';

function generateOtp(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, userId } = req.body;
  if (!email || !userId) return res.status(400).json({ error: 'Email and userId are required' });

  try {
    const { data: profile } = await adminDb
      .from('profiles')
      .select('full_name')
      .eq('id', userId)
      .single();

    await adminDb.from('password_reset_tokens')
      .update({ used: true })
      .eq('user_id', userId)
      .eq('used', false);

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    await adminDb.from('password_reset_tokens').insert({
      user_id: userId,
      token: `signup_${otp}`,
      expires_at: expiresAt,
    });

    await sendOtpEmail(email, profile?.full_name || 'User', otp, 'signup');

    return res.status(200).json({ success: true });
  } catch {
    return res.status(500).json({ error: 'Failed to send verification code' });
  }
}
