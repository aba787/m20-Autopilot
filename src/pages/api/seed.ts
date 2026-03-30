import type { NextApiRequest, NextApiResponse } from 'next';
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
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ error: 'Seed endpoint is disabled in production' });
  }

  const results: string[] = [];
  let failures = 0;

  const { data: existing } = await adminDb.auth.admin.listUsers({ perPage: 1000 });
  const existingUsers = existing?.users ?? [];

  for (const u of TEST_USERS) {
    const found = existingUsers.find((x) => x.email === u.email);

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
        if (createErr.message?.includes('already') || createErr.message?.includes('duplicate')) {
          results.push(`${u.email}: already exists (duplicate), skipping`);
          continue;
        }
        results.push(`${u.email}: create FAILED — ${createErr.message}`);
        failures++;
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

    if (!existingProfile) {
      const { error: insErr } = await adminDb
        .from('profiles')
        .insert({ id: userId, email: u.email, full_name: u.full_name, role: u.role });

      if (insErr) {
        results.push(`  → profile insert failed: ${insErr.message}`);
        failures++;
        continue;
      }
      results.push(`  → profile created`);
    } else {
      const { error: updErr } = await adminDb
        .from('profiles')
        .update({ full_name: u.full_name, role: u.role })
        .eq('id', userId);

      if (updErr) {
        results.push(`  → profile update failed: ${updErr.message}`);
        failures++;
        continue;
      }
      results.push(`  → profile updated`);
    }

    const optionalFields: Record<string, string | number> = {
      bot_mode: u.bot_mode,
      target_acos: u.target_acos,
    };

    const setOptional: string[] = [];
    for (const [col, val] of Object.entries(optionalFields)) {
      const { error } = await adminDb.from('profiles').update({ [col]: val }).eq('id', userId);
      if (!error) setOptional.push(col);
    }
    if (setOptional.length > 0) {
      results.push(`  → optional fields set: ${setOptional.join(', ')}`);
    }
  }

  const status = failures > 0 ? 207 : 200;
  return res.status(status).json({
    success: failures === 0,
    results,
    accounts: [
      { label: 'admin', email: 'admin@test.com', password: 'Admin1234!', role: 'admin' },
      { label: 'user1', email: 'test@example.com', password: 'Test1234!', role: 'user' },
      { label: 'user2', email: 'user@test.com', password: 'User1234!', role: 'user' },
    ],
  });
}
