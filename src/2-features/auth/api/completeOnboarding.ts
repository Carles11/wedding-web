"use server";

import { getCurrentUser } from "@/3-entities/user/api/getCurrentUser";
import { supabaseAdmin } from "@/4-shared/lib/supabase/supabaseServer";

/**
 * Mark the current user as having completed onboarding
 * Called after user selects a plan (free or premium)
 */
export async function completeOnboarding(): Promise<{
  success?: boolean;
  error?: string;
}> {
  const user = await getCurrentUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  try {
    // Update user_profiles to mark onboarding as complete
    const { error } = await supabaseAdmin
      .from("user_profiles")
      .update({ onboarding_completed: true })
      .eq("id", user.id);

    if (error) {
      console.error("Error completing onboarding:", error);
      // Don't throw - column might not exist yet, but we'll still allow redirect
      return { success: true };
    }

    return { success: true };
  } catch (err) {
    console.error("Onboarding completion error:", err);
    // Fail silently - let the redirect happen anyway
    return { success: true };
  }
}
