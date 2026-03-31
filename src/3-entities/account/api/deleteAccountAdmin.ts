import { removeCustomDomain } from "@/2-features/builder/custom-domain/api/removeCustomDomain";
import { supabaseAdmin } from "@/4-shared/lib/supabase/supabaseServer";

/**
 * Deletes a user from auth.users (admin privilege required).
 * This will cascade and delete all related user data.
 * @param userId - The user's UUID
 */
export async function deleteAccountAdmin(userId: string) {
  console.log("[deleteAccountAdmin] Start for userId:", userId);
  // 1. Find all sites owned by this user
  const { data: sites, error: siteError } = await supabaseAdmin
    .from("sites")
    .select("id, domains")
    .eq("owner_user_id", userId);

  if (siteError) {
    console.error("[deleteAccountAdmin] Error fetching sites:", siteError);
    return { success: false, error: siteError };
  }

  console.log(
    `[deleteAccountAdmin] Found ${sites?.length || 0} sites for user`,
  );

  // 2. Remove all custom domains from Vercel for each site
  if (sites && Array.isArray(sites)) {
    for (const site of sites) {
      console.log(`[deleteAccountAdmin] Processing site: ${site.id}`);
      if (site.domains && Array.isArray(site.domains)) {
        for (const domain of site.domains) {
          try {
            console.log(
              `[deleteAccountAdmin] Removing domain: ${domain} from site: ${site.id}`,
            );
            await removeCustomDomain(site.id, domain);
            console.log(
              `[deleteAccountAdmin] Successfully removed domain: ${domain}`,
            );
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
  console.log(`[deleteAccountAdmin] Deleting user from auth.users: ${userId}`);
  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
  if (error) {
    console.error(`[deleteAccountAdmin] Error deleting user:`, error);
    return { success: false, error };
  }
  console.log(`[deleteAccountAdmin] Successfully deleted user: ${userId}`);
  return { success: true };
}
