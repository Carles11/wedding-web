// @/3-entities/user/api/updateUserProfile.ts
import { supabaseAdmin } from "@/4-shared/lib/supabase/supabaseServer";
import { AccountInfo } from "@/4-shared/types";

export async function updateUserProfile(
  userId: string,
  payload: Partial<AccountInfo>,
  client = supabaseAdmin, // Defaults to Admin for Webhooks
) {
  return await client
    .from("user_profiles")
    .update({
      ...payload,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId)
    .select()
    .maybeSingle();
}
