import { fetchWhatToSeeSection } from "./fetchWhatToSeeSection";
import { upsertWhatToSeeSection } from "./upsertWhatToSeeSection";

export async function deleteWhatToSeeEntry(
  siteId: string,
  id: string,
): Promise<boolean> {
  if (!siteId || !id) return false;

  const section = await fetchWhatToSeeSection(siteId);
  const entries = (section?.content?.entries ?? []) as any[];
  const newEntries = entries.filter((e) => e.id !== id);

  const updated = await upsertWhatToSeeSection(siteId, {
    ...(section?.content ?? {}),
    entries: newEntries,
  });
  return updated !== null;
}
