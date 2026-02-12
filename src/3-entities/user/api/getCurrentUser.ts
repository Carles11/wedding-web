import type { User } from "@supabase/supabase-js";
import { createClient } from "@/4-shared/lib/supabase/server";

/**
 * Server-side helper to get the current authenticated user.
 * Uses the server-side Supabase client with cookie-based session management.
 *
 * @returns Promise resolving to the current user or null if not authenticated
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) {
      return null;
    }

    return data.user;
  } catch {
    return null;
  }
}
