"use server";

import { supabaseAdmin } from "@/4-shared/lib/supabase/supabaseServer"; // ← CHANGED!

export async function getSiteIdForDomainOrSubdomain(
  domain: string,
): Promise<string | null> {
  // Try in domains array first (for custom domains)
  const normalizedDomain = domain.toLowerCase().trim();
  const { data: domainsRow } = await supabaseAdmin
    .from("sites")
    .select("id")
    .contains("domains", [normalizedDomain])
    .maybeSingle();

  if (domainsRow?.id) return domainsRow.id;

  // If not found, try as subdomain
  const parts = domain.split(".");
  let subdomain = parts[0];
  if (subdomain === "www") subdomain = parts[1];
  subdomain = subdomain.toLowerCase().trim();

  const { data: subdomainRow } = await supabaseAdmin
    .from("sites")
    .select("id")
    .eq("subdomain", subdomain)
    .maybeSingle();

  return subdomainRow?.id ?? null;
}
