import { getPublicUrlForImage } from "@/3-entities/images/api";
import type { ImageRow } from "@/4-shared/types";

export type ImageSlot = "hero" | "contact";

export type ImageSectionIds = {
  hero: string | null;
  contact: string | null;
};

function joinedSectionType(img: ImageRow): string | null {
  return typeof img.section === "string"
    ? img.section
    : ((img.section as { type?: string } | null)?.type ?? null);
}

/**
 * Bootstrap known hero/contact section IDs from rows already returned by the
 * backend join. Actual slot classification still uses only `section_id`.
 */
export function inferSectionIdsFromRows(rows: ImageRow[]): ImageSectionIds {
  const next: ImageSectionIds = { hero: null, contact: null };

  for (const row of sortImagesNewestFirst(rows)) {
    const type = joinedSectionType(row);

    if (type === "hero" && !next.hero) {
      next.hero = row.section_id;
    }

    if (type === "contact" && !next.contact) {
      next.contact = row.section_id;
    }

    if (next.hero && next.contact) {
      break;
    }
  }

  return next;
}

/**
 * Slot classification must rely on the persisted section_id, not on an optional
 * joined `section.type` relation that may be absent on freshly inserted rows.
 */
export function classifyImage(
  img: ImageRow,
  heroSectionId: string | null,
  contactSectionId: string | null,
): ImageSlot | null {
  if (heroSectionId && img.section_id === heroSectionId) return "hero";
  if (contactSectionId && img.section_id === contactSectionId) return "contact";
  return null;
}

function imageCreatedAtValue(img: ImageRow): number {
  if (!img.created_at) return 0;
  const ts = Date.parse(img.created_at);
  return Number.isNaN(ts) ? 0 : ts;
}

export function sortImagesNewestFirst(rows: ImageRow[]): ImageRow[] {
  return [...rows].sort((a, b) => {
    const byCreatedAt = imageCreatedAtValue(b) - imageCreatedAtValue(a);
    if (byCreatedAt !== 0) return byCreatedAt;
    return String(b.id).localeCompare(String(a.id));
  });
}

export function imagesSignature(
  rows: ImageRow[],
  heroSectionId: string | null,
  contactSectionId: string | null,
): string {
  return sortImagesNewestFirst(rows)
    .map(
      (row) =>
        `${row.id}:${row.section_id}:${
          classifyImage(row, heroSectionId, contactSectionId) ?? "none"
        }`,
    )
    .join("|");
}

/** Keep only newest hero/contact image in front to avoid stale slot rendering. */
export function normalizeImages(
  rows: ImageRow[],
  heroSectionId: string | null,
  contactSectionId: string | null,
): ImageRow[] {
  const sorted = sortImagesNewestFirst(rows);
  const hero =
    sorted.find(
      (img) => classifyImage(img, heroSectionId, contactSectionId) === "hero",
    ) ?? null;
  const contact =
    sorted.find(
      (img) =>
        classifyImage(img, heroSectionId, contactSectionId) === "contact",
    ) ?? null;

  const visibleIds = new Set<string>();
  if (hero?.id) visibleIds.add(hero.id);
  if (contact?.id) visibleIds.add(contact.id);

  const remainder = sorted.filter((img) => !visibleIds.has(img.id));
  return [...(hero ? [hero] : []), ...(contact ? [contact] : []), ...remainder];
}

export function publicUrlForImageRow(image: ImageRow): string | null {
  if (!image?.url) return null;
  const base = getPublicUrlForImage({ url: image.url });
  if (!base) return null;

  const cacheBuster =
    typeof image.created_at === "string"
      ? image.created_at
      : image.id || "missing";

  return `${base}?t=${cacheBuster}`;
}
