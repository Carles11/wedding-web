import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Server-only Supabase client for administrative queries.
// NOTE: Use SUPABASE_SERVICE_ROLE_KEY (server-only). Do NOT expose this to client code.

const SUPABASE_URL =
  process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error(
    "Missing Supabase server env vars. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your environment."
  );
}

export const supabaseAdmin: SupabaseClient = createClient(
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: { persistSession: false },
    global: { headers: { "x-website-source": "wedding-web-server" } },
  }
);
