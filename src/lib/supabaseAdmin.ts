// Untyped admin client — use for API routes to avoid TS strict generics errors
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const svc = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder';

export const db = createClient(
  url,
  svc,
  { auth: { autoRefreshToken: false, persistSession: false } }
);
