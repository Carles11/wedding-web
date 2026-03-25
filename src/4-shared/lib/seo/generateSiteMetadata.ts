import type { Metadata } from "next";

/**
 * Generates SEO metadata for marketing and tenant pages.
 *
 * - For tenant pages, canonical and hreflang always use the current domain (subdomain or custom domain).
 * - For marketing pages, canonical and hreflang use weddweb.com.
 * - Only one domain per tenant is supported (the current host).
 * - All language variants are included in hreflang.
 *
 * @param site - Site object (tenant or marketing)
 * @param lang - Current language
 * @param translations - Translation dictionary
 * @param baseUrl - Current domain (host) for canonical/hreflang
 * @param pageKind - 'tenant' or 'marketing'
 * @returns Metadata object for Next.js
 */
export function generateSiteMetadata({
  site,
  lang,
  translations,
  baseUrl,
  pageKind = "tenant", // or "marketing", etc.
}: {
  site: any;
  lang: string;
  translations: Record<string, any>;
  baseUrl: string;
  pageKind?: "tenant" | "marketing";
}): Metadata {
  // Title and description logic
  const isTenant = pageKind === "tenant";
  const title = isTenant
    ? translations["sections.hero.title"] || site?.name || "Wedding"
    : translations["meta.marketing_title"] || "Welcome";
  const description = isTenant
    ? translations["sections.hero.description"] || ""
    : translations["meta.marketing_description"] || "";

  // Canonical logic: prioritize custom domain for tenants
  let canonicalHost = baseUrl.replace(/^https?:\/\//, "");
  if (pageKind === "tenant" && site?.custom_domain) {
    canonicalHost = site.custom_domain;
  }
  const canonicalUrl = `https://${canonicalHost}/${lang}`;

  // Hreflang/alternates logic
  const availableLangs =
    Array.isArray(site?.languages) && site.languages.length > 0
      ? site.languages
      : [site?.default_lang || "en"];
  let languages: Record<string, string> = {};
  for (const l of availableLangs) {
    languages[l] = `https://${canonicalHost}/${l}`;
  }
  // Always add x-default
  languages["x-default"] = `https://${canonicalHost}/en`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      locale: lang === "ca" ? "ca_ES" : lang === "es" ? "es_ES" : "en_US",
      url: canonicalUrl,
      siteName: title,
      images:
        pageKind === "marketing"
          ? [`${baseUrl}/assets/og/weddweb-OG.png`]
          : site?.ogImage
            ? [site.ogImage]
            : [`${baseUrl}/assets/og/weddweb-OG.png`],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images:
        pageKind === "marketing"
          ? [`${baseUrl}/assets/og/weddweb-OG.png`]
          : site?.ogImage
            ? [site.ogImage]
            : [`${baseUrl}/assets/og/weddweb-OG.png`],
    },
    alternates: {
      canonical: canonicalUrl,
      languages,
    },
    robots: { index: true, follow: true },
  };
}
