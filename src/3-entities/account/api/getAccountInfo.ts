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

  const site = Array.isArray(data.sites) ? data.sites[0] : data.sites;

  if (error) return null;

  return {
    ...data,
    plan_type: site?.plan_type ?? "free",
    last_activity_at:
      site?.last_activity_at ?? site?.created_at ?? data.created_at,
  } as AccountInfo;
}
