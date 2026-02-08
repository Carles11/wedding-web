import { seoMetadata as en } from "./en";
import { seoMetadata as es } from "./es";
import { seoMetadata as ca } from "./ca";
import { seoMetadata as zh } from "./zh";
import { seoMetadata as hi } from "./hi";
import { seoMetadata as ar } from "./ar";
import { seoMetadata as fr } from "./fr";
import { seoMetadata as de } from "./de";
import { seoMetadata as pt } from "./pt";
import { seoMetadata as ru } from "./ru";
import { seoMetadata as it } from "./it";
import type { SitewideSEO, PageSEO } from "./types";

const seoByLocale: Record<string, SitewideSEO> = {
  en,
  es,
  ca,
  zh,
  hi,
  ar,
  fr,
  de,
  pt,
  ru,
  it,
};

/**
 * Get SEO metadata for a given locale and page.
 * Falls back to English if locale is not supported.
 * @param locale - 2-letter locale code (e.g. 'en')
 * @param page - key of SitewideSEO to return (defaults to 'marketing')
 * @returns PageSEO for the requested page and locale
 */
export function getSEOMetadata(
  locale: string,
  page: keyof SitewideSEO = "marketing",
): PageSEO {
  const sitewide = seoByLocale[locale] ?? seoByLocale["en"];
  return sitewide[page];
}

export * from "./types";
