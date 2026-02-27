import type { AccommodationEntry } from "@/4-shared/types";
import { fetchAccommodationSection } from "@/3-entities/sections/api/fetchAccommodationSection";

export async function fetchAccommodationEntries(
  siteId: string,
): Promise<AccommodationEntry[]> {
  const section = await fetchAccommodationSection(siteId);
  const hotels = section?.content?.hotels ?? [];
  return (hotels as AccommodationEntry[]) ?? [];
}
