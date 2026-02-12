"use server";

import { createClient } from "@/4-shared/lib/supabase/server";

/**
 * Server action to reset the password for the currently authenticated user.
 * Updates the password using the session from the password reset token.
 *
 * @param newPassword - The new password to set
 * @returns Promise resolving to success status or error message
 */
export async function resetPassword(
  newPassword: string,
): Promise<{ error?: string; success?: boolean }> {
  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
