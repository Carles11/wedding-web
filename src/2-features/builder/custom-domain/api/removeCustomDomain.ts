import { createSupabaseSSRClient } from "@/4-shared/lib/supabase/server";
import { removeDomainFromVercelProject } from "@/4-shared/lib/vercel/vercel-domains";

export async function removeCustomDomain(siteId: string, domain: string) {
  const cleanDomain = domain.trim().toLowerCase();

  const supabase = await createSupabaseSSRClient();

  // 1. Fetch current domain arrays/status from DB
  const { data: site, error: fetchError } = await supabase
    .from("sites")
    .select("domains, pending_custom_domains, domain_statuses")
    .eq("id", siteId)
    .maybeSingle();

  if (fetchError || !site) throw new Error("Site not found");

  // 2. Remove domain from all relevant fields
  const domains = (site.domains ?? []).filter((d: string) => d !== cleanDomain);
  const pending_custom_domains = (site.pending_custom_domains ?? []).filter(
    (d: string) => d !== cleanDomain,
  );
  const domain_statuses = { ...(site.domain_statuses || {}) };
  delete domain_statuses[cleanDomain];

  // 3. Save to Supabase (fail if this doesn't work)
  const { error } = await supabase
    .from("sites")
    .update({ domains, pending_custom_domains, domain_statuses })
    .eq("id", siteId);

  if (error) throw new Error("Failed to remove domain in DB");

  // 4. Also attempt to remove from Vercel (never block user flow on error)
  try {
    await removeDomainFromVercelProject(cleanDomain);
  } catch (e) {
    // Log for backend debugging, but don't block user
    console.warn("Vercel removeDomain failed:", e);
  }

  return { success: true };
}
