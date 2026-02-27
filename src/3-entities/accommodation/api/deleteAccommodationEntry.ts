import { fetchAccommodationSection } from "@/3-entities/sections/api/fetchAccommodationSection";
import { upsertAccommodationSection } from "./upsertAccommodationSection";

interface Hotel {
  id: string;
  // add other hotel properties here if needed
}

export async function deleteAccommodationEntry(
  siteId: string,
  id: string,
): Promise<boolean> {
  if (!siteId || !id) return false;

  const section = await fetchAccommodationSection(siteId);
  const hotels = (section?.content?.hotels ?? []) as Hotel[];
  const newHotels = hotels.filter((h) => h.id !== id);

  const updated = await upsertAccommodationSection(siteId, {
    ...(section?.content ?? {}),
    hotels: newHotels,
  });
  return updated !== null;
}
