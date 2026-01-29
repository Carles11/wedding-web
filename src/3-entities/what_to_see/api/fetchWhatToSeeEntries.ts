import type { WhatToSeeEntry } from "@/4-shared/types";
import { fetchWhatToSeeSection } from "./fetchWhatToSeeSection";

export async function fetchWhatToSeeEntries(
  siteId: string,
): Promise<WhatToSeeEntry[]> {
  const section = await fetchWhatToSeeSection(siteId);
  const entries = section?.content?.entries ?? [];
  return (entries as WhatToSeeEntry[]) ?? [];
}
