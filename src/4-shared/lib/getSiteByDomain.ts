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

    // 1. Get Plan Type directly from the site row
    // If for some reason it's null in the DB, fallback to 'free'
    const planType = data.plan_type || "free";

    // 2. Extract Wedding Date (find the is_main_event in the array)
    const mainEvent = (data.program_events as any[])?.find(
      (e) => e.is_main_event === true,
    );
    const weddingDateStr = mainEvent?.date;

    // 3. Calculate Expiry
    let isExpired = false;
    if (planType === "free" && weddingDateStr) {
      const weddingDate = new Date(weddingDateStr);
      const expiryDate = new Date(weddingDate);
      expiryDate.setMonth(expiryDate.getMonth() + 2); // Add 2 months

      isExpired = new Date() > expiryDate;
    }

    return {
      ...data,
      plan_type: planType, // Remains compatible with your existing code
      wedding_date: weddingDateStr,
      is_expired: isExpired,
    };
  } catch (err) {
    console.error("[getSiteByDomain] unexpected error:", err);
    return null;
  }
}
