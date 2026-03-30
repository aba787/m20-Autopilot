import type { NextApiRequest, NextApiResponse } from 'next';
import { db as adminDb } from '@/lib/supabaseAdmin';

const TEST_USERS = [
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

async function trySet(id: string, col: string, val: any): Promise<boolean> {
  const { error } = await adminDb.from('profiles').update({ [col]: val }).eq('id', id);
  return !error;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ error: 'Seed endpoint is disabled in production' });
  }

  const results: string[] = [];

  for (const u of TEST_USERS) {
    const { data: existing } = await adminDb.auth.admin.listUsers();
    const found = existing?.users?.find((x: any) => x.email === u.email);

    let userId: string;

    if (found) {
      userId = found.id;
      results.push(`${u.email}: auth user exists (${userId})`);

      const { error: updateErr } = await adminDb.auth.admin.updateUserById(userId, {
        password: u.password,
        email_confirm: true,
      });
      results.push(updateErr ? `  → password update failed: ${updateErr.message}` : `  → password reset OK`);
    } else {
      const { data: created, error: createErr } = await adminDb.auth.admin.createUser({
        email: u.email,
        password: u.password,
        email_confirm: true,
        user_metadata: { full_name: u.full_name },
      });

      if (createErr) {
        results.push(`${u.email}: create FAILED — ${createErr.message}`);
        continue;
      }

      userId = created.user.id;
      results.push(`${u.email}: created auth user (${userId})`);
    }

    const { data: existingProfile } = await adminDb
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .single();

    if (existingProfile) {
      results.push(`  → profile exists`);
    } else {
      const { error: insErr } = await adminDb
        .from('profiles')
        .insert({ id: userId, email: u.email });

      if (insErr) {
        results.push(`  → profile insert failed: ${insErr.message}`);
        continue;
      }
      results.push(`  → profile created`);
    }

    const extras: Record<string, any> = {
      full_name: u.full_name,
      bot_mode: u.bot_mode,
      target_acos: u.target_acos,
      role: u.role,
    };

    const setCols: string[] = [];
    for (const [col, val] of Object.entries(extras)) {
      if (await trySet(userId, col, val)) {
        setCols.push(col);
      }
    }
    if (setCols.length > 0) {
      results.push(`  → set: ${setCols.join(', ')}`);
    }
  }

  return res.status(200).json({
    success: true,
    results,
    accounts: [
      { emoji: '👑', email: 'admin@test.com', password: 'Admin1234!', role: 'admin' },
      { emoji: '👤', email: 'test@example.com', password: 'Test1234!', role: 'user' },
      { emoji: '👤', email: 'user@test.com', password: 'User1234!', role: 'user' },
    ],
  });
}
