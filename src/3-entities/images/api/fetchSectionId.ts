import { createClient } from "@/4-shared/lib/supabase/client";

const supabase = createClient();

export async function fetchSectionId(
  siteId: string,
  type: "hero" | "contact",
): Promise<string | null> {
  const { data, error } = await supabase
    .from("sections")
    .select("id")
    .eq("site_id", siteId)
    .eq("type", type)
    .limit(1)
    .maybeSingle<{ id: string }>();

  if (data?.id) {
    return data.id;
  }

  if (error) {
    console.warn("Failed to fetch section UUID", { siteId, type, error });
    return null;
  }

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

  if (inserted?.id) {
    return inserted.id;
  }

  if (insertError) {
    const { data: retryData, error: retryError } = await supabase
      .from("sections")
      .select("id")
      .eq("site_id", siteId)
      .eq("type", type)
      .limit(1)
      .maybeSingle<{ id: string }>();

    if (retryData?.id) {
      return retryData.id;
    }

    console.warn("Failed to create section UUID", {
      siteId,
      type,
      insertError,
      retryError,
    });
    return null;
  }

  return null;
}
