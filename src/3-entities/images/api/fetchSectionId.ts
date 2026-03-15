import { createClient } from "@/4-shared/lib/supabase/client";

const supabase = createClient();

const DEBUG_IMAGES =
  process.env.NODE_ENV !== "production" &&
  process.env.NEXT_PUBLIC_DEBUG_IMAGES !== "0";

function debugFetchSectionId(message: string, payload?: unknown) {
  if (!DEBUG_IMAGES) return;
  const ts = new Date().toISOString();
  if (payload === undefined) {
    console.info(`[images-debug][api.fetchSectionId][${ts}] ${message}`);
    return;
  }
  console.info(`[images-debug][api.fetchSectionId][${ts}] ${message}`, payload);
}

export async function fetchSectionId(
  siteId: string,
  type: "hero" | "contact",
): Promise<string | null> {
  debugFetchSectionId("start", { siteId, type });
  const { data, error } = await supabase
    .from("sections")
    .select("id")
    .eq("site_id", siteId)
    .eq("type", type)
    .maybeSingle();

  if (data?.id) {
    debugFetchSectionId("found-existing", { siteId, type, id: data.id });
    return data.id;
  }

  if (error) {
    debugFetchSectionId("fetch-error", {
      siteId,
      type,
      error: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });
    console.error("Failed to fetch section UUID", error);
    return null;
  }

  debugFetchSectionId("not-found-creating", { siteId, type });

  const { data: inserted, error: insertError } = await supabase
    .from("sections")
    .insert([
      {
        site_id: siteId,
        type,
        content: {},
      },
    ])
    .select("id")
    .maybeSingle<{ id: string }>();

  if (insertError) {
    debugFetchSectionId("create-error", {
      siteId,
      type,
      error: insertError.message,
      details: insertError.details,
      hint: insertError.hint,
      code: insertError.code,
    });
    console.error("Failed to create section UUID", insertError);
    return null;
  }

  debugFetchSectionId("create-ok", {
    siteId,
    type,
    id: inserted?.id ?? null,
  });

  return inserted?.id ?? null;
}
