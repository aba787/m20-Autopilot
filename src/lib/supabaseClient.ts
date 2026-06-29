import { createClient } from '@supabase/supabase-js';

// Single source of truth for Supabase configuration.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || "";
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

const resolvedUrl = url || "https://placeholder.supabase.co";

// Public, browser-safe client (anon / publishable key).
export const supabase = createClient(resolvedUrl, anon || "placeholder");

// Admin client. Server-only. Never import this in client-side code.
export const supabaseAdmin = createClient(resolvedUrl, serviceRole || "placeholder", {
    auth: { autoRefreshToken: false, persistSession: false },
});

// Backwards-compatible alias used across API routes.
export const db = supabaseAdmin;
