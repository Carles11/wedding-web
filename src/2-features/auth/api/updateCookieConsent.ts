"use server";

import { supabaseAdmin } from "@/4-shared/lib/supabase/supabaseServer";

/**
 * Updates cookie consent for a user in user_profiles.
 * @param userId - The user's UUID
 * @param consent - Boolean, true if accepted
 * @param version - Consent version string
 */
export async function updateCookieConsent(
  userId: string,
  consent: boolean,
  version: string = "2026-03-27",
): Promise<{ error?: string; success?: boolean }> {
  if (!userId) return { error: "Missing user ID" };
  const { error } = await supabaseAdmin
    .from("user_profiles")
    .update({
      cookie_consent: consent,
      cookie_consent_at: consent ? new Date().toISOString() : null,
      cookie_consent_version: version,
    })
    .eq("id", userId);
  if (error) return { error: error.message };
  return { success: true };
}
