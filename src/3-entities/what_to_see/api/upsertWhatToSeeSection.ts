import { supabase } from "@/4-shared/api/supabaseClient";
import type { WhatToSeeSection } from "@/4-shared/types";

export async function upsertWhatToSeeSection(
  siteId: string,
  content: WhatToSeeSection["content"],
): Promise<WhatToSeeSection | null> {
  if (!siteId) return null;

  const { data: existing, error: fetchErr } = await supabase
    .from("sections")
    .select("id")
    .eq("site_id", siteId)
    .eq("type", "what_to_see")
    .limit(1)
    .maybeSingle<{ id: string }>();

  if (fetchErr) {
    console.error("[upsertWhatToSeeSection] fetch error:", fetchErr);
    return null;
  }

  try {
    if (existing && existing.id) {
      const { data, error } = await supabase
        .from("sections")
        .update({ content })
        .eq("id", existing.id)
        .select("id, site_id, type, title, subtitle, content, created_at")
        .maybeSingle();
      if (error) {
        console.error("[upsertWhatToSeeSection] update error:", error);
        return null;
      }
      return (data as WhatToSeeSection) ?? null;
    }

    const { data: ins, error: insErr } = await supabase
      .from("sections")
      .insert([
        {
          site_id: siteId,
          type: "what_to_see",
          content,
        },
      ])
      .select("id, site_id, type, title, subtitle, content, created_at")
      .maybeSingle();

    if (insErr) {
      console.error("[upsertWhatToSeeSection] insert error:", insErr);
      return null;
    }
    return (ins as WhatToSeeSection) ?? null;
  } catch (err) {
    console.error("[upsertWhatToSeeSection] unexpected error:", err);
    return null;
  }
}

// TODO: Consider migrating to a dedicated `what_to_see_entries` table for per-row CRUD and constraints.
