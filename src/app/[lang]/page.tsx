import MarketingPageComponent from "@/0-pages/(marketing)/MarketingPageComponent";
import TenantPageComponent from "@/0-pages/(tenant)/TenantPageComponent";
import { fetchMarketingTranslations } from "@/4-shared/api/marketing";
import { SUPPORTED_LANGUAGES, SupportedLanguage } from "@/4-shared/config/i18n";
import { getSEOMetadata } from "@/4-shared/config/seo";
import { getSiteByDomain } from "@/4-shared/lib/getSiteByDomain";
import { getMergedTranslations } from "@/4-shared/lib/i18n";
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
  const lang = (resolvedParams.lang as SupportedLanguage) ?? "en";

  const host = ((await headers()).get("host") ?? "").toLowerCase().trim();
  const site = await getSiteByDomain(host);

  if (site) {
    // --- TENANT METADATA ---
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
      return {
        ...meta,
        robots: { index: false, follow: false },
        title: "Private Wedding Site",
        description: "This wedding website is not publicly indexed.",
      };
    }
    return meta;
  } else {
    // --- MARKETING METADATA ---
    const seo = getSEOMetadata(lang, "marketing", "home");
    const baseUrl = "https://weddweb.com";

    // Build hreflang alternates for Marketing
    const languages: Record<string, string> = {};
    SUPPORTED_LANGUAGES.forEach((l) => {
      languages[l] = `${baseUrl}/${l}`;
    });

    return {
      title: seo.title,
      description: seo.description,
      alternates: {
        canonical: `${baseUrl}/${lang}`,
        languages: {
          ...languages,
          "x-default": `${baseUrl}/en`,
        },
      },
      openGraph: {
        title: seo.ogTitle,
        description: seo.ogDescription,
        url: `${baseUrl}/${lang}`,
        siteName: "WeddWeb",
        images: seo.ogImage
          ? [seo.ogImage]
          : [`${baseUrl}/assets/og/weddweb-OG.png`],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: seo.ogTitle,
        description: seo.ogDescription,
        images: seo.ogImage
          ? [seo.ogImage]
          : [`${baseUrl}/assets/og/weddweb-OG.png`],
      },
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
    // Render tenant wedding page
    return <TenantPageComponent params={{ lang }} />;
  } else {
    // Render marketing landing page
    const translations = await fetchMarketingTranslations(lang, "en");
    return (
      <>
        {/* ClientLanguageAutoRedirect removed: Redundant with Server-side redirection */}
        <MarketingPageComponent
          initialLang={lang}
          translations={translations}
        />
        <Footer lang={lang} translations={translations} />
      </>
    );
  }
}
