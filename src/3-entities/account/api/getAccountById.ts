import { createClient } from "@/4-shared/lib/supabase/client";

export async function getAccountById(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", userId)
    .single();
  return error ? { success: false, error } : { success: true, data };
}
