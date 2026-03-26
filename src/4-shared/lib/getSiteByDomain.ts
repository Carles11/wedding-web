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

    // We use a join to get the plan_type from subscriptions
    // and the wedding date from program_events in one hit.
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
        subscriptions!inner (
          plan_type
        ),
        program_events (
          date
        )
      `,
      )
      // Filter for the main wedding event date
      .eq("program_events.is_main_event", true)
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

    // Extract values for easier consumption
    const planType = data.subscriptions?.[0]?.plan_type || "free";
    const weddingDateStr = data.program_events?.[0]?.date;

    let isExpired = false;

    if (planType === "free" && weddingDateStr) {
      const weddingDate = new Date(weddingDateStr);
      const expiryDate = new Date(weddingDate);
      expiryDate.setMonth(expiryDate.getMonth() + 2); // Add 2 months

      isExpired = new Date() > expiryDate;
    }

    return {
      ...data,
      plan_type: planType,
      wedding_date: weddingDateStr,
      is_expired: isExpired,
    };
  } catch (err) {
    console.error("[getSiteByDomain] unexpected error:", err);
    return null;
  }
}
