import { createClient } from "@/4-shared/lib/supabase/client";
import type { ImageRow } from "@/4-shared/types";
import { notify } from "@/4-shared/lib/toast/toast";

export async function fetchImagesBySite(
  siteId: string,
): Promise<Array<ImageRow & { section: string }>> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("images")
    .select("*, section:sections(type)")
    .eq("site_id", siteId);

  if (error) {
    throw error;
  }
  return (data as Array<ImageRow & { section: string }>) ?? [];
}
