import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const url  = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const anon = process.env.SUPABASE_ANON_KEY || 'placeholder';
const svc  = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder';

export const supabase = createClient<Database>(url, anon);
export const supabaseAdmin = createClient<Database>(url, svc, {
  auth: { autoRefreshToken: false, persistSession: false },
});
