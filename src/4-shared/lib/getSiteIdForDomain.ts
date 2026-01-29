import { supabase } from "@/4-shared/api/supabaseClient";
import type { SiteIdLookupResult } from "@/4-shared/types";

/**
 * SSR-safe tenant lookup by domain (host).
 * Searches Supabase "sites" for a row where `domains` contains the incoming host.
 * Always lowercase/trim the domain for consistent matching.
 */
export async function getSiteIdForDomain(
  domain: string,
): Promise<string | null> {
  if (!domain) return null;
  // Host normalization for lowercase, no whitespace
  const normalizedDomain = domain.toLowerCase().trim();

  // Query for any row where `domains` array contains the normalized host.
  // Avoid `.from<T>()` generics unless you have generated DB types available.
  const { data, error } = await supabase
    .from("sites")
    .select("id")
    .contains("domains", [normalizedDomain])
    .maybeSingle();

  if (error) {
    // Log for debug/monitoring and return null so callers can handle "not found".
    console.error(
      "[getSiteIdForDomain] Supabase site lookup error:",
      error,
      normalizedDomain,
    );
    return null;
  }

  // If no row matched, `data` will be null. Caller should handle null.
  const row = data as SiteIdLookupResult | null;
  if (!row?.id) {
    // Optional: helpful warning during development, safe to remove in production.
    console.warn(
      "[getSiteIdForDomain] No site found for domain:",
      normalizedDomain,
    );
    return null;
  }

  return row.id;
}
