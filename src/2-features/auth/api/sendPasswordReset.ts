"use server";

import { isValidLanguage } from "@/4-shared/helpers/isValidLanguage";
import { createSupabaseSSRClient } from "@/4-shared/lib/supabase/server";

/**
 * Server action to send a password reset email to the user.
 * Sends a reset link that redirects to the password reset page.
 *
 * @param email - User's email address
 * @returns Promise resolving to success status or error message
 */
export async function sendPasswordReset(
  email: string,
  preferredLanguage?: string,
): Promise<{ error?: string; success?: boolean }> {
  const supabase = await createSupabaseSSRClient();
  const selectedLang = isValidLanguage(preferredLanguage)
    ? preferredLanguage
    : "en";
  const langQuery = `?lang=${encodeURIComponent(selectedLang)}`;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password${langQuery}`,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
