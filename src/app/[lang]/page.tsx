import ClientLanguageAutoRedirect from "@/0-pages/(marketing)/LanguageAutoRedirect";
import MarketingPageComponent from "@/0-pages/(marketing)/MarketingPageComponent";
import TenantPageComponent from "@/0-pages/(tenant)/TenantPageComponent";
import { fetchMarketingTranslations } from "@/4-shared/api/marketing";
import { SUPPORTED_LANGUAGES, SupportedLanguage } from "@/4-shared/config/i18n";
import { getSiteByDomain } from "@/4-shared/lib/getSiteByDomain";
import {
  fetchGlobalTranslations,
  getMergedTranslations,
} from "@/4-shared/lib/i18n";
import { generateSiteMetadata } from "@/4-shared/lib/seo/generateSiteMetadata";
import { Footer } from "@/4-shared/ui/commons/footer/Footer";
import type { Metadata } from "next";
import { headers } from "next/headers";

export async function generateMetadata({
  params,
}: {
  params?: Promise<{ lang?: string }>;
}): Promise<Metadata> {
  const resolvedParams = params ? await params : { lang: "en" };
  const lang = resolvedParams.lang ?? "en";

  const host = ((await headers()).get("host") ?? "").toLowerCase().trim();
  const site = await getSiteByDomain(host);

  if (site) {
    // Tenant page metadata
    const translations = await getMergedTranslations(site.id, lang, "en");
    const baseUrl = `https://${host}`;
    const meta = generateSiteMetadata({
      site,
      lang,
      translations,
      baseUrl,
      pageKind: "tenant",
    });
    if (site.seo_enabled === false) {
      // Override robots for noindex
      return {
        ...meta,
        robots: { index: false, follow: false },
        title: "Private Wedding Site",
        description: "This wedding website is not publicly indexed.",
      };
    }
    return meta;
  } else {
    // Marketing page metadata
    const globalT = await fetchGlobalTranslations(lang, "en");
    return {
      title: globalT["meta.marketing_title"] || "Wedding Platform",
      description:
        globalT["meta.marketing_description"] ||
        "Create your wedding website easily.",
      robots: { index: true, follow: true },
    };
  }
}

export const dynamic = "force-dynamic";

export default async function Page({
  params,
}: {
  params: Promise<{ lang?: string }>;
}) {
  const resolvedParams = await params;
  let lang = resolvedParams?.lang || "en";
  if (!SUPPORTED_LANGUAGES.includes(lang as SupportedLanguage)) lang = "en";

  const host = ((await headers()).get("host") ?? "").toLowerCase().trim();
  const site = await getSiteByDomain(host);

  if (site) {
    // Render tenant page
    return <TenantPageComponent params={{ lang }} />;
  } else {
    // Render marketing page
    const translations = await fetchMarketingTranslations(lang, "en");
    return (
      <>
        <ClientLanguageAutoRedirect />
        <MarketingPageComponent
          initialLang={lang}
          translations={translations}
        />
        <Footer lang={lang} />
      </>
    );
  }
}
