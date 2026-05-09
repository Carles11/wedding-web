import "server-only";

import { createSupabaseSSRClient } from "@/4-shared/lib/supabase/server";
import type { SiteIdLookupResult } from "@/4-shared/types/sites";

export type ResolveSiteIdResult = {
  siteId: string;
  resolvedBy: "domain" | "subdomain";
  normalizedHost: string;
} | null;

/**
 * Normalizes a raw Host header value for consistent DB lookups.
 */
export function normalizeHost(input: string): string {
  if (!input) return "";

  let host = input.toLowerCase().trim();
  // Handle IPv6 bracketed notation: [::1] or [::1]:3000
  if (host.startsWith("[")) {
    const closingBracket = host.indexOf("]");
    if (closingBracket !== -1) {
      host = host.slice(1, closingBracket);
    }
    return host;
  }
  // Strip trailing port (e.g. example.com:3000 → example.com)
  host = host.replace(/:\d+$/, "");
  // Strip trailing dot (FQDN form: example.com.)
  if (host.endsWith(".")) {
    host = host.slice(0, -1);
  }
  return host;
}

/**
 * Extracts the effective subdomain from a normalized hostname.
 * e.g. carlesdelrio.weddweb.com → carlesdelrio
 */
export function extractSubdomain(normalizedHost: string): string | null {
  if (!normalizedHost) return null;
  // Guard: .localhost suffix — do not attempt subdomain DB lookup
  if (normalizedHost.endsWith(".localhost")) return null;
  const parts = normalizedHost.split(".");
  if (parts.length < 2) return null;
  // www.foo.tld → parts[1] as subdomain
  if (parts[0] === "www" && parts.length >= 3) return parts[1];
  return parts[0];
}

export async function resolveSiteIdFromHost(
  host: string,
): Promise<ResolveSiteIdResult> {
  const normalizedHost = normalizeHost(host);

  // DEBUG
  // console.log(
  //   "[resolveSiteIdFromHost] raw host:",
  //   host,
  //   "| normalizedHost:",
  //   normalizedHost,
  // );

  if (!normalizedHost) {
    console.warn("[resolveSiteIdFromHost] No normalizedHost from", host);
    return null;
  }

  // Handle both plain and www-prefixed variants everywhere
  const hostVariants = [normalizedHost];
  if (normalizedHost.startsWith("www.")) {
    hostVariants.push(normalizedHost.replace(/^www\./, ""));
  } else {
    hostVariants.push("www." + normalizedHost);
  }

  // console.log(
  //   "[resolveSiteIdFromHost] Trying host variants for domains:",
  //   hostVariants,
  // );

  const supabase = await createSupabaseSSRClient();

  // --- 1. Domains[] (Custom domain or .weddweb.com in domains array) ---
  let domainRow = null as SiteIdLookupResult | null;
  let domainError = null;

  for (const h of hostVariants) {
    const { data, error } = await supabase
      .from("sites")
      .select("id, subdomain, domains")
      .contains("domains", [h])
      .maybeSingle();
    if (data?.id) {
      domainRow = data as SiteIdLookupResult;
      break;
    }
    if (error) domainError = error;
  }

  if (domainError) {
    console.error("[resolveSiteIdFromHost] domain lookup error:", domainError);
    return null;
  }

  if (domainRow && domainRow.id) {
    // console.log(
    //   "[resolveSiteIdFromHost] Found using domains, id:",
    //   domainRow.id,
    //   "| variant:",
    //   domainRow.domains,
    // );
    return { siteId: domainRow.id, resolvedBy: "domain", normalizedHost };
  }

  // --- 2. Subdomain (Free-tier tenants or fallback) ---
  const subdomain = extractSubdomain(normalizedHost);
  const subVariants = [subdomain].filter(Boolean) as string[];
  // For extra safety, add www-less if starts with www.
  if (subdomain && subdomain.startsWith("www")) {
    subVariants.push(subdomain.replace(/^www\./, ""));
  }

  // console.log(
  //   "[resolveSiteIdFromHost] Trying subdomain variants for subdomain:",
  //   subVariants,
  // );

  let subdomainRow = null as SiteIdLookupResult | null;
  let subdomainError = null;

  for (const subd of subVariants) {
    if (!subd) continue;
    const { data, error } = await supabase
      .from("sites")
      .select("id, subdomain, domains")
      .eq("subdomain", subd)
      .maybeSingle();
    if (data?.id) {
      subdomainRow = data as SiteIdLookupResult;
      break;
    }
    if (error) subdomainError = error;
  }

  if (subdomainError) {
    console.error(
      "[resolveSiteIdFromHost] subdomain lookup error:",
      subdomainError,
    );
    return null;
  }

  if (subdomainRow && subdomainRow.id) {
    // console.log(
    //   "[resolveSiteIdFromHost] Found using subdomain, id:",
    //   subdomainRow.id,
    //   "| subdomain:",
    //   subdomainRow.subdomain,
    // );
    return {
      siteId: subdomainRow.id,
      resolvedBy: "subdomain",
      normalizedHost,
    };
  }

  // --- Not found anywhere ---
  console.warn(
    "[resolveSiteIdFromHost] Host NOT matched!",
    host,
    "| normalized:",
    normalizedHost,
    "| Tried domains:",
    hostVariants,
    "| Tried subdomains:",
    subVariants,
  );
  return null;
}
