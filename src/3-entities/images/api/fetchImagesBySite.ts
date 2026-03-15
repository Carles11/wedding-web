import type { ImageRow } from "@/4-shared/types";
import { createBrowserClient } from "@supabase/ssr";

function createNoStoreClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        fetch: (input, init) =>
          fetch(input, {
            ...init,
            cache: "no-store",
          }),
      },
    },
  );
}

async function queryImages(
  siteId: string,
): Promise<Array<ImageRow & { section: string }>> {
  const supabase = createNoStoreClient();

  const { data, error } = await supabase
    .from("images")
    .select("*, section:sections(type)")
    .eq("site_id", siteId)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  const mapped = ((data ?? []) as Array<Record<string, unknown>>).map(
    (row) => ({
      ...(row as ImageRow),
      // Supabase may return joined relation as object or single-item array.
      section: Array.isArray(row.section) ? row.section[0] : row.section,
    }),
  ) as Array<ImageRow & { section: string }>;

  return mapped;
}

export async function fetchImagesBySite(
  siteId: string,
): Promise<Array<ImageRow & { section: string }>> {
  return queryImages(siteId);
}
