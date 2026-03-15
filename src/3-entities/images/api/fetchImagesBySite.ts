import type { ImageRow } from "@/4-shared/types";
import { createBrowserClient } from "@supabase/ssr";

const DEBUG_IMAGES =
  process.env.NODE_ENV !== "production" &&
  process.env.NEXT_PUBLIC_DEBUG_IMAGES !== "0";

function debugFetchImagesBySite(message: string, payload?: unknown) {
  if (!DEBUG_IMAGES) return;
  const ts = new Date().toISOString();
  if (payload === undefined) {
    console.info(`[images-debug][api.fetchImagesBySite][${ts}] ${message}`);
    return;
  }
  console.info(
    `[images-debug][api.fetchImagesBySite][${ts}] ${message}`,
    payload,
  );
}

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
    debugFetchImagesBySite("query-error", {
      siteId,
      error: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });
    throw error;
  }

  debugFetchImagesBySite("raw-data", {
    siteId,
    count: (data ?? []).length,
    rows: ((data ?? []) as Array<Record<string, unknown>>).map((row) => ({
      id: row.id,
      site_id: row.site_id,
      section_id: row.section_id,
      sectionRaw: row.section,
      created_at: row.created_at,
      url: row.url,
    })),
  });

  const mapped = ((data ?? []) as Array<Record<string, unknown>>).map(
    (row) => ({
      ...(row as ImageRow),
      // Supabase may return joined relation as object or single-item array.
      section: Array.isArray(row.section) ? row.section[0] : row.section,
    }),
  ) as Array<ImageRow & { section: string }>;

  debugFetchImagesBySite("mapped-data", {
    siteId,
    count: mapped.length,
    rows: mapped.map((row) => ({
      id: row.id,
      section_id: row.section_id,
      section: row.section,
      created_at: row.created_at,
      url: row.url,
    })),
  });

  return mapped;
}

export async function fetchImagesBySite(
  siteId: string,
): Promise<Array<ImageRow & { section: string }>> {
  debugFetchImagesBySite("start", { siteId });
  return queryImages(siteId);
}
