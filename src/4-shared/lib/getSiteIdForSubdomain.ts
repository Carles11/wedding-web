import { createClient } from "@supabase/supabase-js";
import type { SiteIdLookupResult } from "@/4-shared/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function getSiteIdForSubdomain(
  subdomain: string,
): Promise<string | null> {
  if (!subdomain) return null;

  const supabase = createClient(supabaseUrl, supabaseKey);

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
