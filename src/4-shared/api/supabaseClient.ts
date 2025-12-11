import { createClient } from "@supabase/supabase-js";

/**
 * Centralized Supabase client for all SSR and client-side code.
 * Reads env vars (must be set in Vercel and .env.local).
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
