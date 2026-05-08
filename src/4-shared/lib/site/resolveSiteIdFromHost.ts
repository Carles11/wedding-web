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
 * - lowercase + trim
 * - strip bracketed IPv6 (e.g. [::1]:3000 → ::1)
 * - strip port suffix
 * - strip trailing dot
 * - returns empty string for falsy input (caller should guard)
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

  // Strip trailing port only when it is a pure decimal number (e.g. example.com:3000 → example.com).
  // Using a regex instead of lastIndexOf(":") avoids accidentally truncating bare IPv6
  // addresses that were not wrapped in brackets.
  host = host.replace(/:\d+$/, "");

  // Strip trailing dot (FQDN form: example.com.)
  if (host.endsWith(".")) {
    host = host.slice(0, -1);
  }

  return host;
}

/**
 * Extracts the effective subdomain from a normalized hostname.
 * - www.foo.weddweb.com → "foo"
 * - foo.weddweb.com     → "foo"
 * - localhost           → null (single segment, no subdomain)
 * - foo.localhost       → null (local dev guard — resolve via domains[] only)
 * - ::1                 → null (IPv6 bare address)
 */
export function extractSubdomain(normalizedHost: string): string | null {
  if (!normalizedHost) return null;

  // Guard: .localhost suffix — do not attempt subdomain DB lookup
  if (normalizedHost.endsWith(".localhost")) return null;

  const parts = normalizedHost.split(".");

  // Single segment (e.g. "localhost", "::1") — no subdomain
  if (parts.length < 2) return null;

  // www.foo.tld → use parts[1] as subdomain
  if (parts[0] === "www" && parts.length >= 3) {
    return parts[1];
  }

  return parts[0];
}

/**
 * Resolves a tenant site_id from the incoming request Host header.
 *
 * Lookup priority:
 *   1. sites.domains contains normalizedHost  → resolvedBy: "domain"
 *   2. sites.subdomain = extractSubdomain(…)  → resolvedBy: "subdomain"
 *
 * Returns null if the host is empty, no site is found, or a DB error occurs.
 */
export async function resolveSiteIdFromHost(
  host: string,
): Promise<ResolveSiteIdResult> {
  const normalizedHost = normalizeHost(host);

  if (!normalizedHost) return null;

  const supabase = await createSupabaseSSRClient();

  // --- Lookup 1: custom domain ---
  const { data: domainRow, error: domainError } = await supabase
    .from("sites")
    .select("id")
    .contains("domains", [normalizedHost])
    .maybeSingle();

  if (domainError) {
    console.error("[resolveSiteIdFromHost] domain lookup error:", domainError);
    return null;
  }

  const domainResult = domainRow as SiteIdLookupResult | null;
  if (domainResult?.id) {
    return { siteId: domainResult.id, resolvedBy: "domain", normalizedHost };
  }

  // --- Lookup 2: subdomain ---
  const subdomain = extractSubdomain(normalizedHost);
  if (!subdomain) return null;

  const { data: subdomainRow, error: subdomainError } = await supabase
    .from("sites")
    .select("id")
    .eq("subdomain", subdomain)
    .maybeSingle();

  if (subdomainError) {
    console.error(
      "[resolveSiteIdFromHost] subdomain lookup error:",
      subdomainError,
    );
    return null;
  }

  const subdomainResult = subdomainRow as SiteIdLookupResult | null;
  if (subdomainResult?.id) {
    return {
      siteId: subdomainResult.id,
      resolvedBy: "subdomain",
      normalizedHost,
    };
  }

  return null;
}
