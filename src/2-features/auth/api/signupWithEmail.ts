"use server";

import { createClient } from "@/4-shared/lib/supabase/server";

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
): Promise<{ error?: string; success?: boolean; needsVerification?: boolean }> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: fullName ? { full_name: fullName } : undefined,
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true, needsVerification: true };
}
