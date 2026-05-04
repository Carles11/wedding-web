import { createSupabaseSSRClient } from "@/4-shared/lib/supabase/server";
import { cache } from "react";

/**
 * Get site row by host (domain or subdomain).
 * Wrapped in React cache() to deduplicate requests between metadata and page.
 */
const PLATFORM_SUFFIXES = [".weddweb.com", ".localhost:3000"];

function extractSubdomain(host: string): string | null {
  for (const suffix of PLATFORM_SUFFIXES) {
    if (host.endsWith(suffix)) {
      const sub = host.slice(0, host.length - suffix.length);
      if (sub && !sub.includes(".")) return sub;
    }
  }
  return null;
}

export const getSiteByDomain = cache(async (host: string | null) => {
  if (!host) return null;

  const normalized = host.toLowerCase().trim();
  const stripped = normalized.startsWith("www.")
    ? normalized.slice(4)
    : normalized;

  // Extract just the subdomain for platform hosts (e.g. "foo.localhost:3000" → "foo")
  const subdomain = extractSubdomain(stripped);

  try {
    const supabase = await createSupabaseSSRClient();

    const orParts = [
      `domains.cs.{${normalized}}`,
      `domains.cs.{${stripped}}`,
      subdomain ? `subdomain.eq.${subdomain}` : `subdomain.eq.${stripped}`,
    ];

    const { data, error } = await supabase
      .from("sites")
      .select(
        `
        created_at,
        id, 
        owner_user_id, 
        subdomain, 
        default_lang, 
        languages, 
        domains, 
        domain_statuses,
        seo_enabled,
        plan_type,
        title_font,
        body_font,
        last_activity_at,
        program_events (
          date,
          is_main_event
        )
      `,
      )
      .or(orParts.join(","))
      .maybeSingle();

    if (error) {
      console.error("[getSiteByDomain] error:", error);
      return null;
    }

    if (!data) return null;

    const planType = data.plan_type || "free";
    const lastActivityStr = data.last_activity_at;

    // Calculate Legacy Mode (Read-only after 6 months of inactivity)
    let isLegacyMode = false;

    if (planType === "free") {
      const lastActivity = lastActivityStr
        ? new Date(lastActivityStr)
        : new Date(data.created_at);

      const cutoffDate = new Date(lastActivity);
      cutoffDate.setMonth(cutoffDate.getMonth() + 6);

      isLegacyMode = new Date() > cutoffDate;
    }

    return {
      ...data,
      plan_type: planType,
      is_legacy_mode: isLegacyMode,
      is_expired: false, // Legacy Mode is the new standard
    };
  } catch (err) {
    console.error("[getSiteByDomain] unexpected error:", err);
    return null;
  }
});
