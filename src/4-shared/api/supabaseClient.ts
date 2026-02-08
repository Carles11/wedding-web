import { createClient } from "@supabase/supabase-js";

/**
 * ANONYMOUS Supabase client for client-side and SSR queries.
 *
 * - Uses ANON key (safe to expose to browser)
 * - Respects Row Level Security (RLS) policies
 * - Use for: Tenant site queries, RSVP forms, guest-facing features
 *
 * DO NOT use for: Marketing translations, admin operations
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
