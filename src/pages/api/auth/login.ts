import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { db as supabaseAdmin } from '@/lib/supabaseAdmin';
import { signToken, setAuthCookie } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, password } = req.body as { email?: string; password?: string };
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

  const emailLower = email.toLowerCase().trim();
  const { data: profile, error } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('email', emailLower)
    .single();

  if (error) {
    console.error('LOGIN DB ERROR:', JSON.stringify(error));
    if (error.message?.includes('schema cache') || error.message?.includes('column')) {
      return res.status(500).json({ error: 'Database is not set up yet. Please run supabase/fix-and-seed.sql in Supabase SQL Editor.' });
    }
  }

  if (error || !profile) return res.status(401).json({ error: 'Invalid email or password' });

  if (!profile.password_hash) {
    return res.status(500).json({ error: 'Database schema incomplete — password_hash column missing. Please run supabase/fix-and-seed.sql in Supabase SQL Editor.' });
  }

  const valid = await bcrypt.compare(password, profile.password_hash);
  if (!valid) return res.status(401).json({ error: 'Invalid email or password' });

  const role = profile.role ?? 'user';
  const token = signToken({ sub: profile.id, email: profile.email, role });
  setAuthCookie(res, token);

  return res.status(200).json({
    token,
    user: { id: profile.id, email: profile.email, full_name: profile.full_name, bot_mode: profile.bot_mode, target_acos: profile.target_acos, role },
  });
}
