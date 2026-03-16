/**
 * Looks up a translation key with a fallback string.
 * Shared utility for builder step components that receive a translations dict.
 */
export function t(
  translations: Record<string, string>,
  key: string,
  fallback: string,
): string {
  return translations[key] || fallback;
}
