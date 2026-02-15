import { supabase } from "@/4-shared/api/supabaseClient";
import type { AccommodationSection } from "@/4-shared/types";

/**
 * Replace or insert the accommodation section content for a site.
 * Returns the updated AccommodationSection or null on failure.
 */
export async function upsertAccommodationSection(
  siteId: string,
  content: AccommodationSection["content"],
): Promise<AccommodationSection | null> {
  if (!siteId) return null;

  // Try updating existing row first
  const { data: existing, error: fetchErr } = await supabase
    .from("sections")
    .select("id")
    .eq("site_id", siteId)
    .eq("type", "accommodation")
    .limit(1)
    .maybeSingle<{ id: string }>();

  if (fetchErr) {
    console.error("[upsertAccommodationSection] fetch error:", fetchErr);
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
        console.error("[upsertAccommodationSection] update error:", error);
        return null;
      }
      return (data as AccommodationSection) ?? null;
    }

    // Insert new section row
    const { data: ins, error: insErr } = await supabase
      .from("sections")
      .insert([
        {
          site_id: siteId,
          type: "accommodation",
          content,
        },
      ])
      .select("id, site_id, type, title, subtitle, content, created_at")
      .maybeSingle();

    if (insErr) {
      console.error("[upsertAccommodationSection] insert error:", insErr);
      return null;
    }

    return (ins as AccommodationSection) ?? null;
  } catch (err) {
    console.error("[upsertAccommodationSection] unexpected error:", err);
    return null;
  }
}

// TODO: Consider schema migration to store accommodations in a dedicated table
// (accommodations) with one row per entry for simpler CRUD and constraints.
