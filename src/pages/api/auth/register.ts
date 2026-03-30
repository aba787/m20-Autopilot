import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { db as supabaseAdmin } from '@/lib/supabaseAdmin';
import { signToken, setAuthCookie } from '@/lib/auth';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function mapSupabaseError(err: { code?: string; message?: string }): string {
  const msg = err.message ?? '';
  const code = err.code ?? '';

  if (code === '23505' || msg.includes('duplicate') || msg.includes('already'))
    return 'Email already in use';
  if (code === 'PGRST204' || msg.includes('schema cache') || msg.includes('column'))
    return 'Database is not set up yet. Please run the schema migration first.';
  if (code === '42P01' || msg.includes('does not exist'))
    return 'Database table not found. Please run the schema migration.';
  if (msg.includes('password') || msg.includes('Password'))
    return 'Password must be at least 8 characters';

  return msg || 'Something went wrong. Please try again.';
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, password, full_name } = req.body as {
    email?: string; password?: string; full_name?: string;
  };

  if (!full_name?.trim())
    return res.status(400).json({ error: 'Full name is required' });

  if (!email?.trim())
    return res.status(400).json({ error: 'Email is required' });

  if (!EMAIL_RE.test(email.trim()))
    return res.status(400).json({ error: 'Invalid email format' });

  if (!password)
    return res.status(400).json({ error: 'Password is required' });

  if (password.length < 8)
    return res.status(400).json({ error: 'Password must be at least 8 characters' });

  const emailLower = email.toLowerCase().trim();

  try {
    const { data: existing } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('email', emailLower)
      .single();

    if (existing)
      return res.status(409).json({ error: 'Email already in use' });
  } catch (lookupErr) {
    console.error('Register lookup error:', lookupErr);
  }

  const password_hash = await bcrypt.hash(password, 12);

  const { data: profile, error } = await supabaseAdmin
    .from('profiles')
    .insert({ id: undefined, email: emailLower, password_hash, full_name: full_name.trim(), bot_mode: 'safe', target_acos: 30 })
    .select('id, email, full_name, bot_mode, target_acos')
    .single();

  if (error || !profile) {
    console.error('REGISTER ERROR:', JSON.stringify(error, null, 2));
    const userMessage = error ? mapSupabaseError(error) : 'Failed to create account. Please try again.';
    const isDuplicate = error?.code === '23505' || (error?.message ?? '').includes('duplicate') || (error?.message ?? '').includes('already');
    return res.status(isDuplicate ? 409 : 500).json({ error: userMessage });
  }

  const token = signToken({ sub: profile.id, email: profile.email });
  setAuthCookie(res, token);

  return res.status(201).json({
    token,
    user: { id: profile.id, email: profile.email, full_name: profile.full_name, bot_mode: profile.bot_mode, target_acos: profile.target_acos },
  });
}
