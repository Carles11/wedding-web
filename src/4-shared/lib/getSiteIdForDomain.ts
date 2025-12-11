import { supabase } from "@/4-shared/api/supabaseClient";

/**
 * SSR-safe tenant lookup by domain (host).
 * Searches Supabase "sites" for a row where `domains` contains the incoming host.
 * Always lowercase/trim the domain for consistent matching.
 */
export async function getSiteIdForDomain(
  domain: string
): Promise<string | null> {
  if (!domain) return null;
  // Host normalization for lowercase, no whitespace
  const normalizedDomain = domain.toLowerCase().trim();

  // Query for any row where `domains` array contains the normalized host
  const { data, error } = await supabase
    .from("sites")
    .select("id")
    .contains("domains", [normalizedDomain])
    .single();

  if (error) {
    // Log for debug/monitoring
    console.error(
      "[getSiteIdForDomain] Supabase site lookup error:",
      error,
      normalizedDomain
    );
    return null;
  }

  // Log for SSR diagnostics (optional, disable in prod)
  if (!data?.id) {
    console.warn(
      "[getSiteIdForDomain] No site found for domain:",
      normalizedDomain
    );
  }

  return data?.id ?? null;
}
