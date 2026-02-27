import { createSupabaseSSRClient } from "@/4-shared/lib/supabase/server";
import type { SiteIdLookupResult } from "@/4-shared/types";

export async function getSiteIdForSubdomain(
  subdomain: string,
): Promise<string | null> {
  if (!subdomain) return null;

  const supabase = await createSupabaseSSRClient();

  const { data, error } = await supabase
    .from("sites")
    .select("id")
    .eq("subdomain", subdomain)
    .maybeSingle();

  if (error) {
    console.error(
      "[getSiteIdForSubdomain] Supabase subdomain lookup error:",
      error,
    );
    return null;
  }

  const row = data as SiteIdLookupResult | null;
  if (!row?.id) return null;
  return row.id;
}
