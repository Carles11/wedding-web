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
  if (error) {
    console.error("Failed to fetch section UUID", error);
    return null;
  }
  return data?.id ?? null;
}
