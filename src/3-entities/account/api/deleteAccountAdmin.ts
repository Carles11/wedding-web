import { removeCustomDomain } from "@/2-features/builder/custom-domain/api/removeCustomDomain";
import { supabaseAdmin } from "@/4-shared/lib/supabase/supabaseServer";

/**
 * Deletes a user from auth.users (admin privilege required).
 * This will cascade and delete all related user data.
 * @param userId - The user's UUID
 */
export async function deleteAccountAdmin(userId: string) {
  // 1. Find all sites owned by this user
  const { data: sites, error: siteError } = await supabaseAdmin
    .from("sites")
    .select("id, domains")
    .eq("owner_user_id", userId);

  if (siteError) {
    return { success: false, error: siteError };
  }

  // 2. Remove all custom domains from Vercel for each site
  if (sites && Array.isArray(sites)) {
    for (const site of sites) {
      if (site.domains && Array.isArray(site.domains)) {
        for (const domain of site.domains) {
          try {
            await removeCustomDomain(site.id, domain);
          } catch (err) {
            // Log error but continue
            console.error(
              `[deleteAccountAdmin] Failed to remove domain: ${domain}`,
              err,
            );
          }
        }
      } else {
        console.log(`[deleteAccountAdmin] No domains for site: ${site.id}`);
      }
    }
  }

  // 3. Delete from auth.users (cascades to user_profiles, sites, etc)
  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
  if (error) {
    return { success: false, error };
  }
  return { success: true };
}
