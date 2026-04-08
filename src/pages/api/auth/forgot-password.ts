import type { NextApiRequest, NextApiResponse } from 'next';
import { db as adminDb } from '@/lib/supabaseAdmin';
import { sendPasswordResetEmail } from '@/lib/email';
import crypto from 'crypto';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  const safeResponse = { success: true, message: 'If this email exists, a reset link has been sent.' };

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

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();

    await adminDb.from('password_reset_tokens').insert({
      user_id: profile.id,
      token,
      expires_at: expiresAt,
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || `https://${process.env.REPLIT_DEV_DOMAIN || 'm20autopilot.replit.app'}`;
    const resetLink = `${appUrl}/login?reset=true&token=${token}`;

    await sendPasswordResetEmail(
      profile.email,
      profile.full_name || 'User',
      resetLink,
    );

    return res.status(200).json(safeResponse);
  } catch {
    return res.status(200).json(safeResponse);
  }
}
