import type { User } from "@supabase/supabase-js";
import { createSupabaseSSRClient } from "@/4-shared/lib/supabase/server";
/**
 * Server-side helper to get the current authenticated user.
 * Uses the server-side Supabase client with cookie-based session management.
 *
 * @returns Promise resolving to the current user or null if not authenticated
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const supabase = await createSupabaseSSRClient();
    const { data, error } = await supabase.auth.getUser();
    console.log({ data, error });
    if (error || !data.user) {
      return null;
    }

    return data.user;
  } catch {
    return null;
  }
}
