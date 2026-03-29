import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { db as supabaseAdmin } from '@/lib/supabaseAdmin';
import { signToken, setAuthCookie } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, password } = req.body as { email?: string; password?: string };
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

  const { data: profile, error } = await supabaseAdmin
    .from('profiles')
    .select('id, email, password_hash, full_name, bot_mode, target_acos')
    .eq('email', email.toLowerCase().trim())
    .single();

  if (error || !profile) return res.status(401).json({ error: 'Invalid email or password' });

  const valid = await bcrypt.compare(password, profile.password_hash ?? '');
  if (!valid) return res.status(401).json({ error: 'Invalid email or password' });

  const token = signToken({ sub: profile.id, email: profile.email });
  setAuthCookie(res, token);

  return res.status(200).json({
    token,
    user: { id: profile.id, email: profile.email, full_name: profile.full_name, bot_mode: profile.bot_mode, target_acos: profile.target_acos },
  });
}
