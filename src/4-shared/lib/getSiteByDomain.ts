// src/4-shared/lib/getSiteByDomain.ts
import { supabaseAdmin } from "@/4-shared/lib/supabaseServer";

/**
 * Get site row by host (domain or subdomain).
 * Returns: { id, subdomain, default_lang, languages, domains } | null
 */
export async function getSiteByDomain(host: string | null) {
  if (!host) return null;
  const normalized = host.toLowerCase().trim();

  try {
    // 1) Try domains array contains normalized host (if you store domains as text[] in sites.domains)
    const { data: byDomain, error: errDomain } = await supabaseAdmin
      .from("sites")
      .select("id, subdomain, default_lang, languages, domains")
      .contains("domains", [normalized])
      .limit(1)
      .maybeSingle();

    if (errDomain) {
      console.error(
        "[getSiteByDomain] error querying by domains array:",
        errDomain
      );
    }
    if (byDomain) return byDomain;

    // 2) Fallback: try matching subdomain column
    const { data: bySubdomain, error: errSub } = await supabaseAdmin
      .from("sites")
      .select("id, subdomain, default_lang, languages, domains")
      .eq("subdomain", normalized)
      .limit(1)
      .maybeSingle();

    if (errSub) {
      console.error("[getSiteByDomain] error querying by subdomain:", errSub);
    }
    if (bySubdomain) return bySubdomain;

    // 3) Not found
    return null;
  } catch (err) {
    console.error("[getSiteByDomain] unexpected error:", err);
    return null;
  }
}
