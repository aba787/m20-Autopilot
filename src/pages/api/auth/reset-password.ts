import type { NextApiRequest, NextApiResponse } from 'next';
import { db as adminDb } from '@/lib/supabaseAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json({ error: 'Token and new password are required' });
  }

  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' });
  }

  try {
    const { data: resetToken, error: tokenError } = await adminDb
      .from('password_reset_tokens')
      .select('*')
      .eq('token', token)
      .eq('used', false)
      .single();

    if (tokenError || !resetToken) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    if (new Date(resetToken.expires_at) < new Date()) {
      await adminDb.from('password_reset_tokens').update({ used: true }).eq('id', resetToken.id);
      return res.status(400).json({ error: 'Reset token has expired. Please request a new one.' });
    }

    const { error: updateError } = await adminDb.auth.admin.updateUserById(resetToken.user_id, {
      password,
    });

    if (updateError) {
      return res.status(500).json({ error: 'Failed to update password. Please try again.' });
    }

    await adminDb.from('password_reset_tokens').update({ used: true }).eq('id', resetToken.id);

    await adminDb.from('password_reset_tokens')
      .update({ used: true })
      .eq('user_id', resetToken.user_id)
      .eq('used', false);

    return res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch {
    return res.status(500).json({ error: 'An error occurred. Please try again.' });
  }
}
