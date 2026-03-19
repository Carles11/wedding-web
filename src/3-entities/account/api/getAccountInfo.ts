"use server";

import { getCurrentUser } from "@/3-entities/user/api/getCurrentUser";
import { supabaseAdmin } from "@/4-shared/lib/supabase/supabaseServer";
import { AccountInfo } from "@/4-shared/types";

export async function getAccountInfo(): Promise<AccountInfo | null> {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Not authenticated: cannot show Account page!");
  }
  const supabase = supabaseAdmin;

  const { data, error } = await supabase
    .from("user_profiles")
    .select(
      "id, email, full_name, avatar_url, preferred_language, created_at, updated_at, onboarding_completed",
    )
    .eq("id", user.id)
    .single();

  if (error) return null;

  return data as AccountInfo;
}
