import type { RsvpSettings } from "@/3-entities/rsvp/model/types";
import { createClient } from "@/4-shared/lib/supabase/client";

/**
 * Fetches the RSVP settings row for a site.
 * Uses the browser (anon) client — reads are RLS-gated to the authenticated user's site.
 */
export async function fetchRsvpSettings(
  siteId: string,
): Promise<RsvpSettings | null> {
  if (!siteId) return null;

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("rsvp_settings")
    .select("site_id, is_enabled, deadline_at")
    .eq("site_id", siteId)
    .maybeSingle<RsvpSettings>();

  if (error) {
    console.error("[fetchRsvpSettings] error:", error);
    return null;
  }

  return data ?? null;
}
