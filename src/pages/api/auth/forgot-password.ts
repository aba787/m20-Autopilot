import type { NextApiRequest, NextApiResponse } from 'next';
import { db as adminDb } from '@/lib/supabaseAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  try {
    await adminDb.from('login_attempts').insert({
      email,
      ip_address: (req.headers['x-forwarded-for'] as string)?.split(',')[0] || req.socket.remoteAddress || 'unknown',
      user_agent: req.headers['user-agent'] || 'unknown',
      success: true,
      failure_reason: 'password_reset_request',
    });

    const { error } = await adminDb.auth.resetPasswordForEmail(email, {
      redirectTo: `${req.headers.origin || 'https://m20autopilot.replit.app'}/login?reset=true`,
    });

    if (error) {
      return res.status(200).json({ success: true, message: 'If this email exists, a reset link has been sent.' });
    }

    return res.status(200).json({ success: true, message: 'If this email exists, a reset link has been sent.' });
  } catch {
    return res.status(200).json({ success: true, message: 'If this email exists, a reset link has been sent.' });
  }
}
