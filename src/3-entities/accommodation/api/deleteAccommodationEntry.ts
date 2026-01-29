import { fetchAccommodationSection } from "./fetchAccommodationSection";
import { upsertAccommodationSection } from "./upsertAccommodationSection";

export async function deleteAccommodationEntry(
  siteId: string,
  id: string,
): Promise<boolean> {
  if (!siteId || !id) return false;

  const section = await fetchAccommodationSection(siteId);
  const hotels = (section?.content?.hotels ?? []) as any[];
  const newHotels = hotels.filter((h) => h.id !== id);

  const updated = await upsertAccommodationSection(siteId, {
    ...(section?.content ?? {}),
    hotels: newHotels,
  });
  return updated !== null;
}
