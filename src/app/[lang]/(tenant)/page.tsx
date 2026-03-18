import { getSiteByDomain } from "@/4-shared/lib/getSiteByDomain";
import {
  fetchGlobalTranslations,
  getMergedTranslations,
} from "@/4-shared/lib/i18n";
import { generateSiteMetadata } from "@/4-shared/lib/seo/generateSiteMetadata";
import type { Metadata } from "next";
import { headers } from "next/headers";

// --- 1. Page UI: export from FSD boundary ---
export { default } from "@/0-pages/(tenant)/TenantPageComponent";

// --- 2. Page metadata: define and export here ---
export async function generateMetadata({
  params,
}: {
  params?: { lang?: string }; // <- union with undefined for safety
}): Promise<Metadata> {
  const realParams = await params;
  const lang = realParams?.lang ?? "en";
  const host = ((await headers()).get("host") ?? "").toLowerCase().trim();
  const site = await getSiteByDomain(host);

  if (!site) {
    const globalT = await fetchGlobalTranslations(lang, "en");
    return {
      title: globalT["seo.not_found.title"] ?? "Wedding Event Not Found",
      description:
        globalT["seo.not_found.description"] ??
        "This wedding website is not available.",
    };
  }

  const baseUrl = `https://${host}`;
  const translations = await getMergedTranslations(site.id, lang, "en");

  return generateSiteMetadata({
    site,
    lang,
    translations,
    baseUrl,
    pageKind: "tenant",
  });
}

// --- 3. Page runtime directive: must be defined here ---
export const dynamic = "force-dynamic";
