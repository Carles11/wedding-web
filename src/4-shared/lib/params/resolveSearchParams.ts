/**
 * Shared utility for resolving searchParams that may be a Promise or direct object.
 * Used across pages (marketing, builder, etc.) to normalize params handling.
 */

export type SearchParamsType =
  | { [key: string]: string | string[] | undefined }
  | Promise<{ [key: string]: string | string[] | undefined }>;

/**
 * Resolves searchParams that may be a Promise (Next.js 15+) or direct object.
 * Returns the resolved params object, or undefined if input is undefined.
 */
export async function resolveSearchParams(
  searchParams?: SearchParamsType,
): Promise<{ [key: string]: string | string[] | undefined } | undefined> {
  if (!searchParams) return undefined;

  // Check if searchParams is a Promise
  if (
    typeof searchParams === "object" &&
    typeof (searchParams as unknown as Promise<unknown>).then === "function"
  ) {
    return await (searchParams as Promise<{
      [key: string]: string | string[] | undefined;
    }>);
  }

  // Already resolved
  return searchParams as { [key: string]: string | string[] | undefined };
}

/**
 * Extracts language from props and resolved params, with fallback to "en".
 * Validates language using isValidLanguage helper.
 */
export function resolveLanguageFromParams(
  lang: string | undefined,
  resolvedParams: { [key: string]: string | string[] | undefined } | undefined,
  isValidLanguage: (lang: string) => boolean,
): string {
  const langRaw =
    typeof lang === "string"
      ? lang
      : Array.isArray(resolvedParams?.lang) &&
          typeof resolvedParams?.lang[0] === "string"
        ? resolvedParams?.lang[0]
        : typeof resolvedParams?.lang === "string"
          ? resolvedParams?.lang
          : "en";

  return isValidLanguage(langRaw) ? langRaw : "en";
}
