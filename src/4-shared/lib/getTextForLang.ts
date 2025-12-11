/**
 * Returns the best available translation string from a multi-lang object.
 * If the requested lang is missing, fallback to preferred fallbackLang, then any available lang.
 */
export function getTextForLang(
  obj: Record<string, string> | undefined,
  lang: string,
  fallbackLang = "ca"
): string {
  if (!obj) return "";
  return (
    obj[lang] ??
    obj[fallbackLang] ??
    Object.values(obj)[0] ?? // show any available lang if all else fails
    ""
  );
}
