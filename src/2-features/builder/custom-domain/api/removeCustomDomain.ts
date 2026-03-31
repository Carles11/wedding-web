import { createSupabaseSSRClient } from "@/4-shared/lib/supabase/server";
import {
  removeDomainFromVercelProject,
  updateVercelProjectDomain,
} from "@/4-shared/lib/vercel/vercel-domains";

const DOMAIN_RE = /^[a-z0-9.-]+\.[a-z]{2,}$/;

/**
 * Custom Error class for domain removal failures
 */
export class RemoveDomainError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "RemoveDomainError";
    this.status = status;
  }
}

/**
 * Helper to wait for Vercel global edge propagation
 */
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Normalizes any input to an apex domain (e.g., www.test.com -> test.com)
 */
function normalizeToApex(domainInput: string): string {
  const cleaned = domainInput
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .split("/")[0]
    .split("?")[0]
    .split("#")[0]
    .replace(/\.$/, "")
    .replace(/^www\./, "");

  if (!DOMAIN_RE.test(cleaned)) {
    throw new RemoveDomainError(400, "Invalid domain format");
  }

  return cleaned;
}

/**
 * Simple helper to strip www for comparison
 */
function toApex(domain: string): string {
  return domain
    .trim()
    .toLowerCase()
    .replace(/^www\./, "");
}

/**
 * Orchestrates the removal of a custom domain from Supabase and Vercel.
 * Breaks Vercel redirect dependencies before attempting deletion.
 */
export async function removeCustomDomain(siteId: string, domain: string) {
  // Only skip if domain is a true subdomain (not www), or local/test
  const isLocalOrPort = domain.includes("localhost") || domain.includes(":");
  const parts = domain.replace(/^www\./, "").split(".");

  // e.g. foo.bar.com is a true subdomain, whereas www.bar.com is a variant
  const isTrueSubdomain = parts.length > 2 && !domain.startsWith("www.");

  if (isLocalOrPort || isTrueSubdomain) {
    console.log(
      `[removeCustomDomain] Skipping subdomain or local/test domain: ${domain}`,
    );
    return { success: true, skipped: true, reason: "subdomain_or_local" };
  }

  const apexDomain = normalizeToApex(domain);
  const wwwDomain = `www.${apexDomain}`;

  const supabase = await createSupabaseSSRClient();

  // 1. Fetch current domain arrays/status from DB
  const { data: site, error: fetchError } = await supabase
    .from("sites")
    .select("domains, pending_custom_domains, domain_statuses")
    .eq("id", siteId)
    .maybeSingle();

  if (fetchError || !site) {
    throw new RemoveDomainError(404, "Site not found");
  }

  const shouldKeepDomain = (value: string) => toApex(value) !== apexDomain;

  // 2. Filter out both root and www variants from DB state
  const domains = (site.domains ?? []).filter((d: string) =>
    shouldKeepDomain(d),
  );
  const pending_custom_domains = (site.pending_custom_domains ?? []).filter(
    (d: string) => shouldKeepDomain(d),
  );
  const currentStatuses =
    site.domain_statuses && typeof site.domain_statuses === "object"
      ? (site.domain_statuses as Record<string, string>)
      : {};

  const domain_statuses = Object.fromEntries(
    Object.entries(currentStatuses).filter(([key]) => shouldKeepDomain(key)),
  );

  // 3. Save updated state to Supabase
  const { error } = await supabase
    .from("sites")
    .update({ domains, pending_custom_domains, domain_statuses })
    .eq("id", siteId);

  if (error) {
    throw new RemoveDomainError(500, "Failed to remove domain in DB");
  }

  // --- VERCEL REMOVAL SEQUENCE ---

  // 4. BREAK THE REDIRECT FIRST
  // This prevents the "cannot delete because other domains redirect to it" error.
  console.log(
    `[removeCustomDomain] Breaking redirect dependency for: ${wwwDomain}`,
  );
  await updateVercelProjectDomain(wwwDomain, {
    redirect: null,
    redirectStatusCode: null,
  });

  // Small delay to allow Vercel API and Edge network to update state
  await sleep(1000);

  // 5. REMOVE WWW VARIANT
  console.log(`[removeCustomDomain] Attempting to remove www: ${wwwDomain}`);
  const wwwResult = await removeDomainFromVercelProject(wwwDomain);
  console.log(`[removeCustomDomain] WWW result:`, wwwResult);

  // Delay before removing the redirect target (Apex)
  await sleep(500);

  // 6. REMOVE APEX DOMAIN
  console.log(`[removeCustomDomain] Attempting to remove apex: ${apexDomain}`);
  const apexResult = await removeDomainFromVercelProject(apexDomain);
  console.log(`[removeCustomDomain] Apex result:`, apexResult);

  // 7. Final validation of Vercel status
  const failures = [wwwResult, apexResult].filter(
    (r) => r.status === "error" && r.error !== "Domain not found",
  );

  if (failures.length > 0) {
    console.error(
      "[removeCustomDomain] Non-critical Vercel removal error:",
      failures,
    );
    // We return success: true because the DB is clean and Vercel will eventually settle,
    // but we log the error for administrative review.
  }

  return { success: true, removed: [apexDomain, wwwDomain] };
}
