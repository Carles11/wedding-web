import { supabase } from "@/4-shared/api/supabaseClient";
import type { ContactSection } from "@/4-shared/types";

export async function upsertContactSection(
  siteId: string,
  content: ContactSection["content"],
): Promise<ContactSection | null> {
  if (!siteId) return null;

  const { data: existing, error: fetchErr } = await supabase
    .from("sections")
    .select("id")
    .eq("site_id", siteId)
    .eq("type", "contact")
    .limit(1)
    .maybeSingle();

  if (fetchErr) {
    console.error("[upsertContactSection] fetch error:", fetchErr);
    return null;
  }

  try {
    if (existing && (existing as any).id) {
      const { data, error } = await supabase
        .from("sections")
        .update({ content })
        .eq("id", (existing as any).id)
        .select("id, site_id, type, title, content, created_at")
        .maybeSingle();

      if (error) {
        console.error("[upsertContactSection] update error:", error);
        return null;
      }
      return (data as ContactSection) ?? null;
    }

    const { data: ins, error: insErr } = await supabase
      .from("sections")
      .insert([
        {
          site_id: siteId,
          type: "contact",
          content,
        },
      ])
      .select("id, site_id, type, title, content, created_at")
      .maybeSingle();

    if (insErr) {
      console.error("[upsertContactSection] insert error:", insErr);
      return null;
    }
    return (ins as ContactSection) ?? null;
  } catch (err) {
    console.error("[upsertContactSection] unexpected error:", err);
    return null;
  }
}

// TODO: Add stricter server-side email validation and spam protections (rate
// limiting/verification) before using this in production.
