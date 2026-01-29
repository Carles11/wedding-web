import { supabase } from "@/4-shared/api/supabaseClient";
import type { WhatToSeeSection } from "@/4-shared/types";

export async function fetchWhatToSeeSection(
  siteId: string,
): Promise<WhatToSeeSection | null> {
  if (!siteId) return null;

  const { data, error } = await supabase
    .from("sections")
    .select("id, site_id, type, title, subtitle, content, created_at")
    .eq("site_id", siteId)
    .eq("type", "what_to_see")
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("[fetchWhatToSeeSection] Supabase error:", error);
    return null;
  }

  return (data as WhatToSeeSection) ?? null;
}
