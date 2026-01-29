import type { WhatToSeeEntry } from "@/4-shared/types";
import { fetchWhatToSeeSection } from "./fetchWhatToSeeSection";
import { upsertWhatToSeeSection } from "./upsertWhatToSeeSection";

export async function updateWhatToSeeEntry(
  siteId: string,
  id: string,
  updates: Partial<WhatToSeeEntry>,
): Promise<WhatToSeeEntry | null> {
  if (!siteId || !id) return null;

  const section = await fetchWhatToSeeSection(siteId);
  const entries = (section?.content?.entries ?? []) as WhatToSeeEntry[];
  const idx = entries.findIndex((e) => e.id === id);
  if (idx === -1) return null;

  const merged = { ...entries[idx], ...updates };
  const newEntries = [...entries];
  newEntries[idx] = merged;

  const updatedSection = await upsertWhatToSeeSection(siteId, {
    ...(section?.content ?? {}),
    entries: newEntries,
  });
  return updatedSection ? merged : null;
}
