import type { WhatToSeeEntry } from "@/4-shared/types";
import { fetchWhatToSeeSection } from "./fetchWhatToSeeSection";
import { upsertWhatToSeeSection } from "./upsertWhatToSeeSection";

export async function createWhatToSeeEntry(
  siteId: string,
  entry: Omit<WhatToSeeEntry, "id">,
): Promise<WhatToSeeEntry | null> {
  if (!siteId) return null;

  const section = await fetchWhatToSeeSection(siteId);
  const entries = (section?.content?.entries ?? []) as WhatToSeeEntry[];

  // UI enforces free-plan limits; server-side enforcement TODO.
  if (entries.length >= 2) return null;

  const generateId = (): string => {
    try {
      if (
        typeof crypto !== "undefined" &&
        typeof (crypto as any).randomUUID === "function"
      )
        return (crypto as any).randomUUID();
    } catch (e) {}
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
  };

  const newEntry: WhatToSeeEntry = { id: generateId(), ...(entry as any) };
  const newEntries = [newEntry, ...entries];
  const updated = await upsertWhatToSeeSection(siteId, {
    ...(section?.content ?? {}),
    entries: newEntries,
  });
  return updated ? newEntry : null;
}
