import { createClient } from "@/4-shared/lib/supabase/client";
import type { ImageRow } from "@/4-shared/types";

const DEBUG_IMAGES =
  process.env.NODE_ENV !== "production" &&
  process.env.NEXT_PUBLIC_DEBUG_IMAGES !== "0";

function debugUpdateImage(message: string, payload?: unknown) {
  if (!DEBUG_IMAGES) return;
  const ts = new Date().toISOString();
  if (payload === undefined) {
    console.info(`[images-debug][api.updateImage][${ts}] ${message}`);
    return;
  }
  console.info(`[images-debug][api.updateImage][${ts}] ${message}`, payload);
}

// This supports updating section and caption (metadata)
export async function updateImage(
  id: string,
  updates: Partial<{ sectionId: string | null; caption: string }>,
): Promise<ImageRow | null> {
  debugUpdateImage("start", { id, updates });
  const supabase = createClient();
  const payload: { section_id?: string | null; caption?: string } = {};

  if ("sectionId" in updates) {
    payload.section_id = updates.sectionId ?? null;
  }
  if ("caption" in updates) {
    payload.caption = updates.caption;
  }

  debugUpdateImage("payload", { id, payload });

  const { data, error } = await supabase
    .from("images")
    .update(payload)
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error) {
    debugUpdateImage("error", {
      id,
      error: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });
    throw error;
  }
  debugUpdateImage("success", {
    id,
    data: data
      ? {
          rowId: data.id,
          section_id: data.section_id,
          url: data.url,
          created_at: data.created_at,
        }
      : null,
  });
  return data as ImageRow;
}
