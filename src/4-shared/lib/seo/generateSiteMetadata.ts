import type { Metadata } from "next";

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
  // shape title/description algorithmically or switch by pageKind
  // ...transformation logic...
  const isTenant = pageKind === "tenant";
  // Example for demo -- you should adjust
  const title = isTenant
    ? translations["sections.hero.title"] || site?.name || "Wedding"
    : translations["meta.marketing_title"] || "Welcome";
  const description = isTenant
    ? translations["sections.hero.description"] || ""
    : translations["meta.marketing_description"] || "";

  // Compute languages/hreflang
  let languages: Record<string, string> = {};
  const availableLangs =
    Array.isArray(site?.languages) && site.languages.length > 0
      ? site.languages
      : [site?.default_lang || "ca"];
  for (const l of availableLangs) {
    languages[l] =
      pageKind === "tenant"
        ? `${baseUrl}/${l}`
        : `${baseUrl}/${l === "en" ? "" : l}`; // customize per root/lang
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      locale: lang === "ca" ? "ca_ES" : lang === "es" ? "es_ES" : "en_US",
      url: `${baseUrl}/${pageKind === "tenant" ? lang : ""}`,
      siteName: title,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: `${baseUrl}/${pageKind === "tenant" ? lang : ""}`,
      languages,
    },
    robots: { index: true, follow: true },
  };
}
