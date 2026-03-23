import { createClient } from "@/4-shared/lib/supabase/client";

export async function updateAccountInfo(
  userId: string,
  updates: Partial<{
    full_name: string;
    email: string;
    preferred_language: string;
  }>,
): Promise<
  { success: true } | { success: false; error: string | { message: string } }
> {
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
