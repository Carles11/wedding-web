import { createSupabaseSSRClient } from "@/4-shared/lib/supabase/server";
import { patchDomainToRedirect } from "@/4-shared/lib/vercel/patchDomainToRedirect";
import {
  addDomainToVercelProject,
  removeDomainFromVercelProject,
} from "@/4-shared/lib/vercel/vercel-domains";

type DomainStatuses = Record<string, string>;

type SiteDomainSnapshot = {
  domains: string[];
  pending_custom_domains: string[];
  domain_statuses: DomainStatuses;
};

const DOMAIN_RE = /^[a-z0-9.-]+\.[a-z]{2,}$/;

export class DomainFlowError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "DomainFlowError";
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
    throw new DomainFlowError(400, "Invalid domain format");
  }

  return cleaned;
}

function isPlatformDomain(domain: string): boolean {
  return domain.endsWith(".weddweb.com") || domain.endsWith(".localhost:3000");
}

function toApex(domain: string): string {
  return domain
    .trim()
    .toLowerCase()
    .replace(/^www\./, "");
}

function uniqueStrings(values: string[]): string[] {
  return Array.from(new Set(values));
}

export async function addCustomDomainWithRedirectVariants(
  siteId: string,
  domainInput: string,
) {
  const supabase = await createSupabaseSSRClient();

  const apexDomain = normalizeToApex(domainInput);
  const wwwDomain = `www.${apexDomain}`;

  const { data: site, error: fetchError } = await supabase
    .from("sites")
    .select("domains, pending_custom_domains, domain_statuses")
    .eq("id", siteId)
    .maybeSingle();

  if (fetchError || !site) {
    throw new DomainFlowError(404, "Site not found");
  }

  const snapshot: SiteDomainSnapshot = {
    domains: Array.isArray(site.domains) ? site.domains : [],
    pending_custom_domains: Array.isArray(site.pending_custom_domains)
      ? site.pending_custom_domains
      : [],
    domain_statuses:
      site.domain_statuses && typeof site.domain_statuses === "object"
        ? ({ ...site.domain_statuses } as DomainStatuses)
        : {},
  };

  const existingCustomRoots = new Set<string>();

  for (const domain of snapshot.domains) {
    const normalized = domain.trim().toLowerCase();
    if (!isPlatformDomain(normalized)) {
      existingCustomRoots.add(toApex(normalized));
    }
  }

  for (const domain of snapshot.pending_custom_domains) {
    existingCustomRoots.add(toApex(domain));
  }

  for (const domain of Object.keys(snapshot.domain_statuses)) {
    if (!isPlatformDomain(domain)) {
      existingCustomRoots.add(toApex(domain));
    }
  }

  const hasOtherCustomDomain = Array.from(existingCustomRoots).some(
    (domain) => domain !== apexDomain,
  );

  if (hasOtherCustomDomain) {
    throw new DomainFlowError(
      409,
      "You already have a custom domain. Remove it before adding another one.",
    );
  }

  if (existingCustomRoots.has(apexDomain)) {
    return {
      success: true,
      already_exists: true,
      domain: apexDomain,
      domains: [apexDomain, wwwDomain],
    };
  }

  const nextPending = uniqueStrings([
    ...snapshot.pending_custom_domains
      .map((d) => d.trim().toLowerCase())
      .filter((d) => toApex(d) !== apexDomain),
    apexDomain,
  ]);

  const nextStatuses: DomainStatuses = { ...snapshot.domain_statuses };
  delete nextStatuses[wwwDomain];
  nextStatuses[apexDomain] = "pending";

  const { error: stageError } = await supabase
    .from("sites")
    .update({
      pending_custom_domains: nextPending,
      domain_statuses: nextStatuses,
    })
    .eq("id", siteId);

  if (stageError) {
    throw new DomainFlowError(500, "Failed to update domain state in database");
  }

  const addedOnVercel: string[] = [];

  try {
    const apexResult = await addDomainToVercelProject(apexDomain);
    if (apexResult.status === "error") {
      throw new Error(
        apexResult.error || "Failed to add apex domain to Vercel",
      );
    }
    if (apexResult.status === "added") {
      addedOnVercel.push(apexDomain);
    }

    const wwwResult = await addDomainToVercelProject(wwwDomain);
    if (wwwResult.status === "error") {
      throw new Error(wwwResult.error || "Failed to add www domain to Vercel");
    }
    if (wwwResult.status === "added") {
      addedOnVercel.push(wwwDomain);
    }

    let redirectConfigured = true;
    let redirectWarning: string | undefined;
    try {
      await patchDomainToRedirect(wwwDomain, apexDomain);
    } catch (error) {
      // Redirect setup should not block domain provisioning.
      redirectConfigured = false;
      redirectWarning =
        error instanceof Error
          ? error.message
          : "Redirect configuration failed";
      console.warn("[domain] redirect setup failed:", redirectWarning);
    }

    return {
      success: true,
      domain: apexDomain,
      domains: [apexDomain, wwwDomain],
      redirect_configured: redirectConfigured,
      ...(redirectWarning ? { redirect_warning: redirectWarning } : {}),
    };
  } catch (error) {
    // Best-effort cleanup of only the domains created by this attempt.
    await Promise.all(
      addedOnVercel.map((domain) => removeDomainFromVercelProject(domain)),
    );

    // Restore DB snapshot to prevent stale pending/status traces.
    await supabase
      .from("sites")
      .update({
        domains: snapshot.domains,
        pending_custom_domains: snapshot.pending_custom_domains,
        domain_statuses: snapshot.domain_statuses,
      })
      .eq("id", siteId);

    throw new DomainFlowError(
      500,
      error instanceof Error ? error.message : "Failed to add custom domain",
    );
  }
}
