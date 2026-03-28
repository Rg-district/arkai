import { createClient } from '@supabase/supabase-js';

// Use placeholder values at build time when env vars are absent (Vercel CI).
// Real values are injected at runtime via Vercel environment variables.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder-anon-key';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? 'placeholder-service-key';

// Client for browser-side usage (respects RLS)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client for server-side usage (bypasses RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
