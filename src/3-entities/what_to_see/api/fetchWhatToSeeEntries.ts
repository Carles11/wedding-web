import type { WhatToSeeEntry } from "@/4-shared/types";
import { createClient } from "@/4-shared/lib/supabase/client"; // adjust import as needed

export async function fetchWhatToSeeEntries(
  siteId: string,
): Promise<WhatToSeeEntry[]> {
  const supabase = createClient();

  // 1. Fetch all what_to_see entries for this site
  const { data: entries, error: entriesError } = await supabase
    .from("what_to_see")
    .select("id, site_id, location_url, sort_order")
    .eq("site_id", siteId)
    .order("sort_order", { ascending: true });

  if (entriesError) throw entriesError;
  if (!entries?.length) return [];

  // 2. Fetch all site_translations for relevant keys for these ids
  const entryIds = entries.map((e) => e.id);
  const keyPrefixes = [
    "what_to_see.title.",
    "what_to_see.description.",
    "what_to_see.notes.",
  ];

  const { data: translations, error: translationsError } = await supabase
    .from("site_translations")
    .select("key, locale, value")
    .eq("site_id", siteId)
    .in(
      "key",
      entryIds.flatMap((id) => keyPrefixes.map((prefix) => `${prefix}${id}`)),
    );

  if (translationsError) throw translationsError;

  // 3. Organize translations by entry and field
  const translationsById: Record<
    string,
    {
      name?: Record<string, string>;
      description?: Record<string, string>;
      notes?: Record<string, string>;
      title?: Record<string, string>;
    }
  > = {};

  for (const t of translations ?? []) {
    const [prefix, field, id] = t.key.split(".");
    if (prefix !== "what_to_see") continue; // robust safety

    if (!translationsById[id]) translationsById[id] = {};
    const fieldKey = field as keyof (typeof translationsById)[typeof id];
    if (!translationsById[id][fieldKey]) translationsById[id][fieldKey] = {};

    translationsById[id][fieldKey][t.locale] = t.value;
  }

  // 4. Merge entries together
  return entries.map((row) => ({
    ...row,
    name: translationsById[row.id]?.title ?? {},
    description: translationsById[row.id]?.description ?? {},
    notes: translationsById[row.id]?.notes ?? {},
  }));
}
