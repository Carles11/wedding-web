import { createClient, SupabaseClient } from "@supabase/supabase-js";

/**
 * ADMIN Supabase client for server-side administrative queries.
 *
 * - Uses SERVICE_ROLE key (NEVER expose to browser)
 * - BYPASSES Row Level Security (RLS) policies
 * - Use for: Marketing translations, admin dashboards, server-only operations
 *
 * DO NOT use for: Client-side code, tenant-specific queries
 */
const SUPABASE_URL =
  process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error(
    "Missing Supabase server env vars. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your environment.",
  );
}

export const supabaseAdmin: SupabaseClient = createClient(
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: { persistSession: false },
    global: { headers: { "x-website-source": "wedding-web-server" } },
  },
);
