import { createBrowserClient } from "@supabase/ssr";

/**
 * Client-side Supabase client with cookie-based auth session management.
 *
 * - Uses ANON_KEY (safe for browser)
 * - Manages user session via cookies
 * - Respects RLS policies based on logged-in user
 * - Use for: Client components, hooks, browser-side auth operations
 *
 * This is a singleton - only one instance is created per app lifecycle.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
