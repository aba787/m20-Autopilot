import type { NextApiRequest, NextApiResponse } from 'next';
import { db as adminDb } from '@/lib/supabaseAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { otp, userId, email, type } = req.body;

  if (!otp || !type || (!userId && !email)) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (!['signup', 'recovery'].includes(type)) {
    return res.status(400).json({ error: 'Invalid type' });
  }

  try {
    let resolvedUserId = userId;

    if (type === 'recovery' && !userId && email) {
      const { data: profile } = await adminDb
        .from('profiles')
        .select('id')
        .eq('email', email.toLowerCase().trim())
        .single();
      if (!profile) return res.status(400).json({ error: 'Invalid or expired code' });
      resolvedUserId = profile.id;
    }

    const storedToken = type === 'signup' ? `signup_${otp}` : otp;

    const { data: record, error } = await adminDb
      .from('password_reset_tokens')
      .select('*')
      .eq('user_id', resolvedUserId)
      .eq('token', storedToken)
      .eq('used', false)
      .single();

    if (error || !record) {
      return res.status(400).json({ error: 'Invalid or expired code' });
    }

    if (new Date(record.expires_at) < new Date()) {
      await adminDb.from('password_reset_tokens').update({ used: true }).eq('id', record.id);
      return res.status(400).json({ error: 'Code has expired. Please request a new one.' });
    }

    if (type === 'signup') {
      const { error: confirmError } = await adminDb.auth.admin.updateUserById(resolvedUserId, {
        email_confirm: true,
      });
      if (confirmError) {
        return res.status(500).json({ error: 'Failed to verify account' });
      }
    }

    await adminDb.from('password_reset_tokens').update({ used: true }).eq('id', record.id);

    return res.status(200).json({ success: true, token: otp });
  } catch {
    return res.status(500).json({ error: 'Verification failed. Please try again.' });
  }
}
