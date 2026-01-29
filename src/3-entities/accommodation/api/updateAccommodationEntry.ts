import type { AccommodationEntry } from "@/4-shared/types";
import { fetchAccommodationSection } from "./fetchAccommodationSection";
import { upsertAccommodationSection } from "./upsertAccommodationSection";

export async function updateAccommodationEntry(
  siteId: string,
  id: string,
  updates: Partial<AccommodationEntry>,
): Promise<AccommodationEntry | null> {
  if (!siteId || !id) return null;

  const section = await fetchAccommodationSection(siteId);
  const hotels = (section?.content?.hotels ?? []) as AccommodationEntry[];
  const idx = hotels.findIndex((h) => h.id === id);
  if (idx === -1) return null;

  const merged = { ...hotels[idx], ...updates };
  const newHotels = [...hotels];
  newHotels[idx] = merged;

  const updatedSection = await upsertAccommodationSection(siteId, {
    ...(section?.content ?? {}),
    hotels: newHotels,
  });
  return updatedSection ? merged : null;
}
