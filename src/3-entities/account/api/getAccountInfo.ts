"use server";

import { getCurrentUser } from "@/3-entities/user/api/getCurrentUser";
import { createSupabaseSSRClient } from "@/4-shared/lib/supabase/server";
import { AccountInfo } from "@/4-shared/types";

export async function getAccountInfo(): Promise<AccountInfo | null> {
  // 1. Safely check for the user
  const user = await getCurrentUser();

  // 2. FIX: Instead of throwing an error, return null for guests
  if (!user) {
    return null;
  }

  const supabase = await createSupabaseSSRClient();
  const { data, error } = await supabase
    .from("user_profiles")
    .select(
      `
    *,
    sites!sites_owner_user_id_fkey (
      plan_type,
      last_activity_at,
      created_at
    )
  `,
    )
    .eq("id", user.id)
    .single();

  // 3. Handle potential database errors or missing profiles gracefully
  if (error || !data) return null;

  const site = Array.isArray(data.sites) ? data.sites[0] : data.sites;

  return {
    ...data,
    plan_type: site?.plan_type ?? "free",
    last_activity_at:
      site?.last_activity_at ?? site?.created_at ?? data.created_at,
  } as AccountInfo;
}
