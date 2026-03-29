import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { db as supabaseAdmin } from '@/lib/supabaseAdmin';
import { signToken, setAuthCookie } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, password, full_name } = req.body as {
    email?: string; password?: string; full_name?: string;
  };

  if (!email?.trim() || !password)
    return res.status(400).json({ error: 'Email and password are required' });

  if (password.length < 8)
    return res.status(400).json({ error: 'Password must be at least 8 characters' });

  const emailLower = email.toLowerCase().trim();

  const { data: existing } = await supabaseAdmin
    .from('profiles')
    .select('id')
    .eq('email', emailLower)
    .single();

  if (existing) return res.status(409).json({ error: 'Email already registered' });

  const password_hash = await bcrypt.hash(password, 12);

  const { data: profile, error } = await supabaseAdmin
    .from('profiles')
    .insert({ id: undefined, email: emailLower, password_hash, full_name: full_name?.trim() || null, bot_mode: 'safe', target_acos: 30 })
    .select('id, email, full_name, bot_mode, target_acos')
    .single();

  if (error || !profile) {
    console.error('Register error:', error);
    return res.status(500).json({ error: 'Failed to create account' });
  }

  const token = signToken({ sub: profile.id, email: profile.email });
  setAuthCookie(res, token);

  return res.status(201).json({
    token,
    user: { id: profile.id, email: profile.email, full_name: profile.full_name, bot_mode: profile.bot_mode, target_acos: profile.target_acos },
  });
}
