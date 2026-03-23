import { supabaseAdmin } from "@/4-shared/lib/supabase/supabaseServer";

/**
 * Deletes a user from auth.users (admin privilege required).
 * This will cascade and delete all related user data.
 * @param userId - The user's UUID
 */
export async function deleteAccountAdmin(userId: string) {
  // Delete from auth.users (cascades to user_profiles, sites, etc)
  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
  return error ? { success: false, error } : { success: true };
}
