import { createSupabaseSSRClient } from "@/4-shared/lib/supabase/server";

/**
 * Get site row by host (domain or subdomain).
 * Includes expiry check logic based on the main event date.
 */
export async function getSiteByDomain(host: string | null) {
  if (!host) return null;

  const normalized = host.toLowerCase().trim();
  const stripped = normalized.startsWith("www.")
    ? normalized.slice(4)
    : normalized;

  try {
    const supabase = await createSupabaseSSRClient();

    const query = supabase
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

    const { data, error } = await query;

    if (error) {
      console.error("[getSiteByDomain] error:", error);
      return null;
    }

    if (!data) return null;

    // 1. Get Plan Type and Last Activity directly from the data
    const planType = data.plan_type || "free";
    const lastActivityStr = data.last_activity_at;

    // 2. Calculate Legacy Mode (Read-only)
    let isLegacyMode = false;

    if (planType === "free") {
      // Fallback to created_at if last_activity_at is somehow null
      const lastActivity = lastActivityStr
        ? new Date(lastActivityStr)
        : new Date(data.created_at);
      const cutoffDate = new Date(lastActivity);

      // Add 6 months to the last recorded activity
      cutoffDate.setMonth(cutoffDate.getMonth() + 6);

      // If today is past the cutoff, the site is in Legacy Mode
      isLegacyMode = new Date() > cutoffDate;
    }

    /* REMOVED EXPIRY LOGIC below - 
    WE'RE NOW USING INACTIVITY-BASED LEGACY MODE ONLY */

    // // 2. Extract Wedding Date (find the is_main_event in the array)
    // const mainEvent = (data.program_events as any[])?.find(
    //   (e) => e.is_main_event === true,
    // );
    // const weddingDateStr = mainEvent?.date;

    // // 3. Calculate Expiry
    // let isExpired = false;
    // if (planType === "free" && weddingDateStr) {
    //   const weddingDate = new Date(weddingDateStr);
    //   const expiryDate = new Date(weddingDate);
    //   expiryDate.setMonth(expiryDate.getMonth() + 6); // Add 6 months

    //   isExpired = new Date() > expiryDate;
    // }

    return {
      ...data,
      plan_type: planType,
      is_legacy_mode: isLegacyMode, // New boolean for your UI
      is_expired: false, // Force false to prevent your old "ExpiredSiteNotice" from firing
    };
  } catch (err) {
    console.error("[getSiteByDomain] unexpected error:", err);
    return null;
  }
}
