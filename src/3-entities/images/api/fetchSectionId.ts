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
    .maybeSingle();

  if (data?.id) {
    return data.id;
  }

  if (error) {
    console.error("Failed to fetch section UUID", error);
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

  if (insertError) {
    console.error("Failed to create section UUID", insertError);
    return null;
  }

  return inserted?.id ?? null;
}
