"use server";

import { createSupabaseSSRClient } from "@/4-shared/lib/supabase/server";

/**
 * Mark the current user as having completed onboarding.
 * Optimized for Next.js 15 Server Actions.
 */
export async function completeOnboarding(): Promise<{
  success: boolean;
  error?: string;
}> {
  const supabase = await createSupabaseSSRClient();

  // 1. Get User from the existing client instance
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    console.error("[Onboarding] Auth verification failed:", authError);
    return { success: false, error: "Not authenticated" };
  }

  try {
    // 2. Update user_profiles
    // We use .select() at the end to confirm the update actually happened
    const { error: dbError } = await supabase
      .from("user_profiles")
      .update({
        onboarding_completed: true,
        // Pro-tip: Store the timestamp of when they finished onboarding
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (dbError) {
      console.error("[Onboarding] Database update failed:", dbError);
      // We return false here to prevent redirect loops if Middleware
      // depends on this flag.
      return { success: false, error: "Database update failed" };
    }

    return { success: true };
  } catch (err) {
    console.error("[Onboarding] Unexpected system error:", err);
    return { success: false, error: "An unexpected error occurred" };
  }
}
