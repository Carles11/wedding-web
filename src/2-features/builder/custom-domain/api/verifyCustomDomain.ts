import { supabaseAdmin } from "@/4-shared/lib/supabase/supabaseServer";
import { getVercelDomainStatus } from "@/4-shared/lib/vercel/vercel-domains"; // You'll write this (see below)

/**
 * Verifies a pending custom domain with Vercel.
 * - If Vercel returns "valid", moves the domain to domains and marks as verified.
 * - If not valid yet, keeps as pending and updates status.
 */
export async function verifyCustomDomain(siteId: string, domain: string) {
  const cleanDomain = domain.trim().toLowerCase();

  // 1. Query Vercel: what is the status?
  // This should return: { status: "valid" | "pending_validation" | "error" | ... }
  const {
    status,
    error: vercelError,
    dnsInstructions,
  } = await getVercelDomainStatus(cleanDomain);

  // 2. Load site from Supabase
  const { data: site, error: fetchError } = await supabaseAdmin
    .from("sites")
    .select("domains, pending_custom_domains, domain_statuses")
    .eq("id", siteId)
    .maybeSingle();
  if (fetchError || !site) throw new Error("Site not found");

  // 3. Prepare new state
  const domains = [...(site.domains || [])];
  let pending_custom_domains = [...(site.pending_custom_domains || [])];
  const domain_statuses = { ...(site.domain_statuses || {}) };

  if (status === "valid") {
    // Remove from pending, add to domains, mark as verified
    if (!domains.includes(cleanDomain)) domains.push(cleanDomain);
    pending_custom_domains = pending_custom_domains.filter(
      (d) => d !== cleanDomain,
    );
    domain_statuses[cleanDomain] = "verified";
  } else if (status === "pending_validation") {
    // Mark as still pending
    domain_statuses[cleanDomain] = "pending";
  } else {
    // Mark as error
    domain_statuses[cleanDomain] = "error";
    pending_custom_domains = pending_custom_domains.filter(
      (d) => d !== cleanDomain,
    ); // Optionally remove from pending
  }

  // 4. Save back to Supabase
  const { error: updateError } = await supabaseAdmin
    .from("sites")
    .update({ domains, pending_custom_domains, domain_statuses })
    .eq("id", siteId);
  if (updateError) throw new Error("Failed to update domain status");

  return {
    status: domain_statuses[cleanDomain],
    dnsInstructions, // Optional—send back for user to see
    error: vercelError,
  };
}
