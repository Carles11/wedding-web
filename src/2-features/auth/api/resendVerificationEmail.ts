"use server";

import { isValidLanguage } from "@/4-shared/helpers/isValidLanguage";
import { createSupabaseSSRClient } from "@/4-shared/lib/supabase/server";

/**
 * Resend signup email verification link.
 */
export async function resendVerificationEmail(
  email: string,
  preferredLanguage?: string,
): Promise<{ error?: string; success?: boolean }> {
  const trimmedEmail = email.trim();
  if (!trimmedEmail) {
    return { error: "Email is required." };
  }
  const selectedLang = isValidLanguage(preferredLanguage)
    ? preferredLanguage
    : "en";
  const onboardingNext = encodeURIComponent(
    `/${selectedLang}/builder/onboarding`,
  );

  const supabase = await createSupabaseSSRClient();
  const { error } = await supabase.auth.resend({
    type: "signup",
    email: trimmedEmail,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/${selectedLang}/auth/confirm?next=${onboardingNext}`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
