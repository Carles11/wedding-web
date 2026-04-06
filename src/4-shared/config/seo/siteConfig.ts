/**
 * Static facts about the WeddWeb platform.
 *
 * Keep immutable launch/brand data here so it is changed in one place
 * and referenced everywhere (schema, meta, analytics, etc.).
 */

/** The date WeddWeb first launched. Historical fact — never changes. */
export const SITE_LAUNCH_DATE = "2024-01-01";

/**
 * Returns the ISO 8601 date string for December 31st of the year
 * *after* the current year (e.g., in 2026 → "2027-12-31").
 *
 * Using year+1 guarantees at least ~12 months of offer validity at all
 * times, keeping Google rich-result price snippets permanently fresh
 * without any manual intervention.
 */
export function getPriceValidUntil(): string {
  const nextYear = new Date().getFullYear() + 1;
  return `${nextYear}-12-31`;
}
