import { createClient } from '@supabase/supabase-js';
const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) { console.log('MISSING ENV'); process.exit(1); }
const admin = createClient(url, key, { auth: { autoRefreshToken:false, persistSession:false }});
const testEmail = 'm20test.e2e@m20autopilot.com';
const testPassword = 'TestPass123!';
const { data: existing } = await admin.auth.admin.listUsers();
const found = existing?.users?.find(u => u.email === testEmail);
if (found) { await admin.auth.admin.deleteUser(found.id); console.log('Deleted prev'); }
const { data: created, error } = await admin.auth.admin.createUser({
  email: testEmail, password: testPassword, email_confirm: true,
  user_metadata: { full_name: 'E2E Test User' },
});
if (error) { console.log('CREATE ERROR:', error.message); process.exit(1); }
console.log('Created:', created.user.id, 'confirmed:', !!created.user.email_confirmed_at);
const { error: pErr } = await admin.from('profiles').upsert({
  id: created.user.id, email: testEmail, full_name: 'E2E Test User',
  bot_mode: 'safe', target_acos: 30, role: 'user', email_notifications: true,
});
if (pErr) console.log('Profile error:', pErr.message); else console.log('Profile OK');
console.log('EMAIL='+testEmail+' PASSWORD='+testPassword);
