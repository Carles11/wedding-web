import { createClient } from "@/4-shared/lib/supabase/client";
import type { ImageRow } from "@/4-shared/types";

// This supports updating section and caption (metadata)
export async function updateImage(
  id: string,
  updates: Partial<{ section: "hero" | "contact" | null; caption: string }>,
): Promise<ImageRow | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("images")
    .update({
      section_id: updates.section ?? null,
      caption: updates.caption,
    })
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data as ImageRow;
}
