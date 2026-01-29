import type { AccommodationEntry } from "@/4-shared/types";
import { fetchAccommodationSection } from "./fetchAccommodationSection";
import { upsertAccommodationSection } from "./upsertAccommodationSection";

export async function createAccommodationEntry(
  siteId: string,
  entry: Omit<AccommodationEntry, "id">,
): Promise<AccommodationEntry | null> {
  if (!siteId) return null;

  const section = await fetchAccommodationSection(siteId);
  const hotels = (section?.content?.hotels ?? []) as AccommodationEntry[];

  // Free plan enforcement expected in UI; TODO: enforce server-side later.
  if (hotels.length >= 2) {
    return null;
  }

  const generateId = (): string => {
    try {
      // browser-native UUID where available
      if (
        typeof crypto !== "undefined" &&
        typeof (crypto as any).randomUUID === "function"
      ) {
        return (crypto as any).randomUUID();
      }
    } catch (e) {
      // ignore and fallback
    }
    // fallback for older environments
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
  };

  const newEntry: AccommodationEntry = { id: generateId(), ...(entry as any) };
  const newHotels = [newEntry, ...hotels];

  const updated = await upsertAccommodationSection(siteId, {
    ...(section?.content ?? {}),
    hotels: newHotels,
  });
  return updated ? newEntry : null;
}
