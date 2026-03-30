import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const results: string[] = [];

  try {
    const mgmtRes = await fetch(`${url}/rest/v1/rpc/exec_setup_migration`, {
      method: 'POST',
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });

    if (mgmtRes.status === 404) {
      results.push('Setup function not found — need to create it first via SQL Editor');
      results.push('Please copy and paste the contents of supabase/fix-and-seed.sql into Supabase SQL Editor and run it');
      return res.status(200).json({
        success: false,
        needsManualSetup: true,
        results,
        instructions: [
          '1. Go to https://supabase.com/dashboard',
          '2. Open your project',
          '3. Click "SQL Editor" in the left sidebar',
          '4. Click "New Query"',
          '5. Copy ALL contents from supabase/fix-and-seed.sql',
          '6. Paste and click "Run"',
          '7. Come back and try logging in again',
        ],
      });
    }

    const text = await mgmtRes.text();
    results.push(`Migration: ${mgmtRes.status} - ${text}`);
  } catch (err) {
    results.push(`Error: ${err}`);
  }

  const db = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });

  const { data: cols } = await db.from('profiles').select('*').limit(1);
  const columnList = cols?.[0] ? Object.keys(cols[0]) : [];
  results.push(`Current columns: ${columnList.join(', ')}`);

  if (!columnList.includes('password_hash')) {
    results.push('MISSING: password_hash column — run supabase/fix-and-seed.sql in SQL Editor');
    return res.status(200).json({ success: false, needsManualSetup: true, results });
  }

  const testHash = await bcrypt.hash('Test1234!', 10);
  const adminHash = await bcrypt.hash('Admin1234!', 10);
  const userHash = await bcrypt.hash('User1234!', 10);

  for (const u of [
    { email: 'test@example.com', hash: testHash, name: 'Test User', mode: 'safe', acos: 30, role: 'user' },
    { email: 'admin@test.com', hash: adminHash, name: 'Admin User', mode: 'auto', acos: 25, role: 'admin' },
    { email: 'user@test.com', hash: userHash, name: 'Regular User', mode: 'safe', acos: 30, role: 'user' },
  ]) {
    const { data: existing } = await db.from('profiles').select('id').eq('email', u.email).single();
    if (existing) {
      const { error } = await db.from('profiles').update({
        password_hash: u.hash, full_name: u.name, target_acos: u.acos, role: u.role,
      }).eq('email', u.email);
      results.push(error ? `${u.email} update FAILED: ${error.message}` : `${u.email} updated OK`);
    } else {
      const { error } = await db.from('profiles').insert({
        email: u.email, password_hash: u.hash, full_name: u.name,
        bot_mode: u.mode, target_acos: u.acos, role: u.role,
      });
      results.push(error ? `${u.email} insert FAILED: ${error.message}` : `${u.email} created OK`);
    }
  }

  return res.status(200).json({ success: true, results });
}
