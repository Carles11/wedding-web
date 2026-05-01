import type { PageSEO } from "@/4-shared/config/seo";

const MIN_DESCRIPTION_LENGTH = 150;
const MAX_DESCRIPTION_LENGTH = 160;
const ELLIPSIS = "...";
const BRAND_SUFFIX = " | WeddWeb";
const BREAK_CHARACTERS = [
  " ",
  ",",
  ".",
  "!",
  "?",
  ";",
  ":",
  "،",
  "؛",
  "，",
  "。",
  "、",
];

function findBreakIndex(value: string): number {
  return BREAK_CHARACTERS.reduce(
    (bestIndex, character) => Math.max(bestIndex, value.lastIndexOf(character)),
    -1,
  );
}

function padDescription(value: string): string {
  if (Array.from(value).length >= MIN_DESCRIPTION_LENGTH) {
    return value;
  }

  return Array.from(`${value}${BRAND_SUFFIX}`)
    .slice(0, MAX_DESCRIPTION_LENGTH)
    .join("")
    .trim();
}

export function normalizeMetaDescription(description: string): string {
  const normalized = description.replace(/\s+/g, " ").trim();
  const characters = Array.from(normalized);

  if (characters.length > MAX_DESCRIPTION_LENGTH) {
    const hardLimit = MAX_DESCRIPTION_LENGTH - ELLIPSIS.length;
    const truncated = characters.slice(0, hardLimit).join("").trim();
    const breakIndex = findBreakIndex(truncated);
    const safeIndex = Math.max(MIN_DESCRIPTION_LENGTH - ELLIPSIS.length - 8, 0);
    const sliced =
      breakIndex >= safeIndex
        ? truncated.slice(0, breakIndex).trim()
        : truncated;

    return padDescription(`${sliced}${ELLIPSIS}`);
  }

  if (characters.length < MIN_DESCRIPTION_LENGTH) {
    return padDescription(normalized);
  }

  return normalized;
}

export function normalizePageSEO(pageSeo: PageSEO): PageSEO {
  return {
    ...pageSeo,
    description: normalizeMetaDescription(pageSeo.description),
    ogDescription: pageSeo.ogDescription
      ? normalizeMetaDescription(pageSeo.ogDescription)
      : undefined,
  };
}
