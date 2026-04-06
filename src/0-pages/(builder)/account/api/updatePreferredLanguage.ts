import { createClient } from "@/4-shared/lib/supabase/client";

/**
 * Updates the preferred language for the current user.
 * @param lang - The new preferred language code
 * @returns Promise resolving to success or error
 */
export async function updatePreferredLanguage(
  lang: string,
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    return { success: false, error: userError?.message || "User not found" };
  }
  const { error } = await supabase
    .from("user_profiles")
    .update({ preferred_language: lang })
    .eq("id", user.id);
  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true };
}
