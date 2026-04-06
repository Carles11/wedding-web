import { getCurrentUser } from "@/3-entities/user/api/getCurrentUser";
import { createSupabaseSSRClient } from "@/4-shared/lib/supabase/server";
import type { User } from "@supabase/supabase-js";

export type SiteAccessResult =
  | { ok: true; user: User }
  | { ok: false; status: 401 | 403; message: string };

/**
 * Verifies the current user is authenticated and has access to the given site.
 *
 * Checks user_sites membership first (supports agencies / multi-user sites),
 * then falls back to owner_user_id for legacy sites that pre-date user_sites.
 */
export async function requireSiteAccess(
  siteId: string,
): Promise<SiteAccessResult> {
  const user = await getCurrentUser();
  if (!user) {
    return { ok: false, status: 401, message: "Unauthorized" };
  }

  const supabase = await createSupabaseSSRClient();

  // Primary: membership via user_sites (agency-safe, supports multiple users per site)
  const { data: membership } = await supabase
    .from("user_sites")
    .select("role")
    .eq("user_id", user.id)
    .eq("site_id", siteId)
    .maybeSingle();

  if (membership) {
    return { ok: true, user };
  }

  // Fallback: direct ownership via owner_user_id (for sites that pre-date user_sites)
  const { data: owned } = await supabase
    .from("sites")
    .select("id")
    .eq("id", siteId)
    .eq("owner_user_id", user.id)
    .maybeSingle();

  if (owned) {
    return { ok: true, user };
  }

  return { ok: false, status: 403, message: "Forbidden" };
}
