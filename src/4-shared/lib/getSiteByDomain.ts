import { createSupabaseSSRClient } from "@/4-shared/lib/supabase/server";
import { cache } from "react";

/**
 * Get site row by host (domain or subdomain).
 * Wrapped in React cache() to deduplicate requests between metadata and page.
 */
export const getSiteByDomain = cache(async (host: string | null) => {
  if (!host) return null;

  const normalized = host.toLowerCase().trim();
  const stripped = normalized.startsWith("www.")
    ? normalized.slice(4)
    : normalized;

  try {
    const supabase = await createSupabaseSSRClient();

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
      .or(
        `domains.cs.{${normalized}},domains.cs.{${stripped}},subdomain.eq.${stripped}`,
      )
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
