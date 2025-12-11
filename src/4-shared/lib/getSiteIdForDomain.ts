import { supabase } from "@/4-shared/api/supabaseClient";

// SSR-safe tenant lookup by domain (host)
export async function getSiteIdForDomain(
  domain: string
): Promise<string | null> {
  if (!domain) return null;

  // Query for any row where `domains` array contains the incoming host
  const { data, error } = await supabase
    .from("sites")
    .select("id")
    .contains("domains", [domain])
    .single();

  if (error) {
    // Log for debug
    console.error(
      "[getSiteIdForDomain] Supabase site lookup error:",
      error,
      domain
    );
    return null;
  }

  return data?.id ?? null;
}
