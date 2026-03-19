import { createClient } from "@/4-shared/lib/supabase/client";

export async function updateAccountInfo(
  userId: string,
  updates: Partial<{
    full_name: string;
    email: string;
    preferred_language: string;
  }>,
) {
  const supabase = createClient();
  const { error } = await supabase
    .from("user_profiles")
    .update(updates)
    .eq("id", userId);
  return error ? { success: false, error } : { success: true };
}

export async function deleteAccount(userId: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("user_profiles")
    .delete()
    .eq("id", userId);
  return error ? { success: false, error } : { success: true };
}

export async function changeAccountPassword(
  userId: string,
  newPassword: string,
) {
  // Implement password change logic with your auth provider
  // This is a stub; replace with real logic
  return { success: false, error: "Password change not implemented." };
}
