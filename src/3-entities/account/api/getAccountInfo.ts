"use server";

import { getCurrentUser } from "@/3-entities/user/api/getCurrentUser";
import { createSupabaseSSRClient } from "@/4-shared/lib/supabase/server";
import { AccountInfo } from "@/4-shared/types";

export async function getAccountInfo(): Promise<AccountInfo | null> {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Not authenticated: cannot show Account page!");
  }
  const supabase = await createSupabaseSSRClient();
  const { data, error } = await supabase
    .from("user_profiles")
    .select(
      "id, email, full_name, avatar_url, preferred_language, created_at, updated_at, onboarding_completed, cookie_consent, cookie_consent_at, cookie_consent_version",
    )
    .eq("id", user.id)
    .single();

  if (error) return null;

  return data as AccountInfo;
}
