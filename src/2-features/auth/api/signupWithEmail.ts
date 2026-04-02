"use server";

import { isValidLanguage } from "@/4-shared/helpers/isValidLanguage";
import { createSupabaseSSRClient } from "@/4-shared/lib/supabase/server";
import { supabaseAdmin } from "@/4-shared/lib/supabase/supabaseServer";

/**
 * Server action to sign up a new user with email and password.
 * Creates a new user account and sends a verification email if email confirmation is enabled.
 *
 * @param email - User's email address
 * @param password - User's password
 * @param fullName - Optional full name for user metadata
 * @returns Promise resolving to success status or error message
 */
export async function signupWithEmail(
  email: string,
  password: string,
  fullName?: string,
  preferredLanguage?: string,
  acceptedTerms?: boolean,
  acceptedTermsVersion?: string,
): Promise<{
  error?: string;
  success?: boolean;
  needsVerification?: boolean;
  preferredLanguage?: string;
}> {
  const supabase = await createSupabaseSSRClient();
  const selectedLang = isValidLanguage(preferredLanguage)
    ? preferredLanguage
    : "en";
  const onboardingNext = encodeURIComponent(
    `/${selectedLang}/builder/onboarding`,
  );

  const { error, data } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data:
        fullName || selectedLang
          ? { full_name: fullName, preferred_language: selectedLang }
          : undefined,
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/${selectedLang}/auth/confirm?next=${onboardingNext}`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  // Get the newly created user ID
  const userId = data?.user?.id;
  if (!userId) {
    return { error: "Failed to create user account" };
  }

  // Insert user_profiles row using admin client (bypasses RLS during signup)
  // This triggers handle_new_user_subscription() which auto-creates free subscription
  const { error: profileError } = await supabaseAdmin
    .from("user_profiles")
    .upsert([
      {
        id: userId,
        email,
        full_name: fullName || null,
        preferred_language: selectedLang,
        accepted_terms: !!acceptedTerms,
        accepted_terms_at: acceptedTerms ? new Date().toISOString() : null,
        accepted_terms_version: acceptedTermsVersion || null,
      },
    ]);

  if (profileError) {
    return { error: `Failed to create user profile: ${profileError.message}` };
  }

  return { success: true, needsVerification: true };
}
