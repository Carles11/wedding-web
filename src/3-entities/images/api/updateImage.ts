import { createClient } from "@/4-shared/lib/supabase/client";
import type { ImageRow } from "@/4-shared/types";

// This supports updating section and caption (metadata)
export async function updateImage(
  id: string,
  updates: Partial<{ sectionId: string | null; caption: string }>,
): Promise<ImageRow | null> {
  const supabase = createClient();
  const payload: { section_id?: string | null; caption?: string } = {};

  if ("sectionId" in updates) {
    payload.section_id = updates.sectionId ?? null;
  }
  if ("caption" in updates) {
    payload.caption = updates.caption;
  }

  const { data, error } = await supabase
    .from("images")
    .update(payload)
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data as ImageRow;
}
