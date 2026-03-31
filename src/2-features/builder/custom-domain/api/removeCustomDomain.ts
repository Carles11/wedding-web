import { createSupabaseSSRClient } from "@/4-shared/lib/supabase/server";
import { removeDomainFromVercelProject } from "@/4-shared/lib/vercel/vercel-domains";

const DOMAIN_RE = /^[a-z0-9.-]+\.[a-z]{2,}$/;

export class RemoveDomainError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "RemoveDomainError";
    this.status = status;
  }
}

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

function toApex(domain: string): string {
  return domain
    .trim()
    .toLowerCase()
    .replace(/^www\./, "");
}

export async function removeCustomDomain(siteId: string, domain: string) {
  // Only skip if domain is a true subdomain (not www), or local/test
  const isLocalOrPort = domain.includes("localhost") || domain.includes(":");
  const isWww = domain.startsWith("www.");
  const parts = domain.replace(/^www\./, "").split(".");
  // e.g. foo.bar.com (not www.bar.com or bar.com)
  const isTrueSubdomain = parts.length > 2;
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

  // 2. Remove both root and www variants from DB state
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

  // 3. Save to Supabase (fail if this doesn't work)
  const { error } = await supabase
    .from("sites")
    .update({ domains, pending_custom_domains, domain_statuses })
    .eq("id", siteId);

  if (error) {
    throw new RemoveDomainError(500, "Failed to remove domain in DB");
  }

  // 4. Remove www first, then apex from Vercel, with detailed logging
  console.log(`[removeCustomDomain] Attempting to remove www: ${wwwDomain}`);
  const wwwResult = await removeDomainFromVercelProject(wwwDomain);
  console.log(`[removeCustomDomain] WWW result:`, wwwResult);

  // Now try to remove apex
  console.log(`[removeCustomDomain] Attempting to remove apex: ${apexDomain}`);
  const apexResult = await removeDomainFromVercelProject(apexDomain);
  console.log(`[removeCustomDomain] Apex result:`, apexResult);

  const failures = [wwwResult, apexResult].filter((r) => r.status === "error");
  if (failures.length > 0) {
    console.error("[removeCustomDomain] Failed removals:", failures);
    throw new RemoveDomainError(
      502,
      `Domain removed in DB but failed to fully remove from Vercel. Details: ${JSON.stringify(failures)}`,
    );
  }

  return { success: true, removed: [apexDomain, wwwDomain] };
}
