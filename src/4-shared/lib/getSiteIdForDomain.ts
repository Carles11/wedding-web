import { supabaseAdmin } from "@/4-shared/lib/supabaseServer"; // ← CHANGED!

/**
 * SSR-safe tenant lookup by domain (host).
 * Searches Supabase "sites" for a row where `domains` contains the incoming host.
 * Always lowercase/trim the domain for consistent matching.
 */
export async function getSiteIdForDomain(
  domain: string,
): Promise<string | null> {
  console.log("🔍 [getSiteIdForDomain] Input domain:", domain);

  if (!domain) return null;

  // Host normalization for lowercase, no whitespace
  const normalizedDomain = domain.toLowerCase().trim();
  console.log("🔍 [getSiteIdForDomain] Normalized:", normalizedDomain);

  // Query for any row where `domains` array contains the normalized host
  const { data, error } = await supabaseAdmin
    .from("sites")
    .select("id")
    .contains("domains", [normalizedDomain])
    .single();

  console.log("🔍 [getSiteIdForDomain] Query result:", { data, error });

  if (error) {
    console.error(
      "[getSiteIdForDomain] Supabase site lookup error:",
      error,
      normalizedDomain,
    );
    return null;
  }

  if (!data?.id) {
    console.warn(
      "[getSiteIdForDomain] No site found for domain:",
      normalizedDomain,
    );
  }

  console.log("✅ [getSiteIdForDomain] Returning site ID:", data?.id ?? null);
  return data?.id ?? null;
}
