import type { NextApiRequest, NextApiResponse } from 'next';
import type { User } from '@supabase/supabase-js';
import { db as adminDb } from '@/lib/supabaseAdmin';

interface TestUser {
  email: string;
  password: string;
  full_name: string;
  bot_mode: string;
  target_acos: number;
  role: string;
}

const TEST_USERS: TestUser[] = [
  {
    email: 'admin@test.com',
    password: 'Admin1234!',
    full_name: 'Admin User',
    bot_mode: 'auto',
    target_acos: 25,
    role: 'admin',
  },
  {
    email: 'test@example.com',
    password: 'Test1234!',
    full_name: 'Test User',
    bot_mode: 'safe',
    target_acos: 30,
    role: 'user',
  },
  {
    email: 'user@test.com',
    password: 'User1234!',
    full_name: 'Regular User',
    bot_mode: 'safe',
    target_acos: 30,
    role: 'user',
  },
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (process.env.NODE_ENV === 'production' && process.env.ENABLE_SEED !== 'true') {
    return res.status(404).json({ error: 'Not found' });
  }

  const provided = req.headers['x-seed-secret'];
  const expected = process.env.SESSION_SECRET;
  if (!expected || provided !== expected) {
    return res.status(403).json({ error: 'Forbidden — valid x-seed-secret header required' });
  }

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const results: any[] = [];

  for (const u of TEST_USERS) {
    try {
      const { data: list } = await adminDb.auth.admin.listUsers();
      const existing = list?.users?.find((x: User) => x.email?.toLowerCase() === u.email.toLowerCase());

      let userId = existing?.id;
      if (!userId) {
        const { data, error } = await adminDb.auth.admin.createUser({
          email: u.email,
          password: u.password,
          email_confirm: true,
          user_metadata: { full_name: u.full_name },
        });
        if (error) throw error;
        userId = data.user!.id;
      }

      await adminDb.from('profiles').upsert({
        id: userId,
        email: u.email,
        full_name: u.full_name,
        bot_mode: u.bot_mode,
        role: u.role,
      });

      results.push({ email: u.email, status: 'ok', userId });
    } catch (err: any) {
      results.push({ email: u.email, status: 'error', error: err.message });
    }
  }

  return res.status(200).json({ results });
}
