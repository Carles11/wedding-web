// src/4-shared/lib/getSiteByDomain.ts
import { createSupabaseSSRClient } from "@/4-shared/lib/supabase/server";
/**
 * Get site row by host (domain or subdomain).
 * Returns: { id, subdomain, default_lang, languages, domains } | null
 */
export async function getSiteByDomain(host: string | null) {
  if (!host) return null;
  const normalized = host.toLowerCase().trim();
  // Also try stripping 'www.' for robust matching

  const stripped = normalized.startsWith("www.")
    ? normalized.slice(4)
    : normalized;

  try {
    const supabase = await createSupabaseSSRClient();
    // 1) Try domains array contains normalized host or www-stripped variant
    const { data: byDomain, error: errDomain } = await supabase
      .from("sites")
      .select(
        "id, owner_user_id, subdomain, default_lang, languages, domains, seo_enabled",
      )
      .or(`domains.cs.{${normalized}},domains.cs.{${stripped}}`)
      .limit(1)
      .maybeSingle();

    if (errDomain) {
      console.error(
        "[getSiteByDomain] error querying by domains array:",
        errDomain,
      );
    }
    if (byDomain) return byDomain;

    // 2) Fallback: try matching subdomain column
    const { data: bySubdomain, error: errSub } = await supabase
      .from("sites")
      .select(
        "id, owner_user_id, subdomain, default_lang, languages, domains, seo_enabled",
      )
      .eq("subdomain", stripped)
      .limit(1)
      .maybeSingle();

    if (errSub) {
      console.error("[getSiteByDomain] error querying by subdomain:", errSub);
    }
    if (bySubdomain) return bySubdomain;

    // 3) Not found
    return null;
  } catch (err) {
    return null;
  }
}
