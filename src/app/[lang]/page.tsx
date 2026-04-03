import MarketingPageComponent from "@/0-pages/(marketing)/MarketingPageComponent";
import ExpiredSiteNotice from "@/0-pages/(tenant)/ExpiredSiteNotice";
import TenantPageComponent from "@/0-pages/(tenant)/TenantPageComponent";
import { fetchMarketingTranslations } from "@/4-shared/api/marketing";
import { SUPPORTED_LANGUAGES, SupportedLanguage } from "@/4-shared/config/i18n";
import { getSEOMetadata } from "@/4-shared/config/seo";
import { getSiteByDomain } from "@/4-shared/lib/getSiteByDomain";
import { getMergedTranslations } from "@/4-shared/lib/i18n";
import { generateSiteMetadata } from "@/4-shared/lib/seo/generateSiteMetadata";
import { getMetadataBase } from "@/4-shared/lib/seo/getMetadataBase"; // New Helper
import { Footer } from "@/4-shared/ui/commons/footer/Footer";
import { shouldShowFooter } from "@/4-shared/utils/shouldShowFooter";
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

  // Use the DRY helper to resolve metadataBase and baseUrl
  const { metadataBase, baseUrl } = getMetadataBase(host, !!site);

  // 1. Handle Expired Site Metadata (No-index)
  if (site?.is_expired && site.plan_type === "free") {
    return {
      metadataBase,
      title: "Site Expired | WeddWeb",
      description: "The hosting period for this wedding website has concluded.",
      robots: { index: false, follow: false },
    };
  }

  if (site) {
    // --- TENANT METADATA ---
    const translations = await getMergedTranslations(site.id, lang, "en");

    const meta = generateSiteMetadata({
      site,
      lang,
      translations,
      baseUrl: baseUrl, // Now coming from helper
      pageKind: "tenant",
    });

    const finalMeta = {
      ...meta,
      metadataBase,
    };

    if (site.seo_enabled === false) {
      return {
        ...finalMeta,
        robots: { index: false, follow: false },
        title: "Private Wedding Site",
        description: "This wedding website is not publicly indexed.",
      };
    }
    return finalMeta;
  } else {
    // --- MARKETING METADATA ---
    const seo = getSEOMetadata(lang, "marketing", "home");
    const ogImage = "/assets/og/weddweb-OG.png";

    const languages: Record<string, string> = {};
    SUPPORTED_LANGUAGES.forEach((l) => {
      languages[l] = `/${l}`;
    });

    // Use local helper for correct OG locale
    function getOGLocale(lang: string): string {
      const localeMap: Record<string, string> = {
        en: "en_US",
        es: "es_ES",
        ca: "ca_ES",
        fr: "fr_FR",
        de: "de_DE",
        it: "it_IT",
        pt: "pt_PT",
        ru: "ru_RU",
        zh: "zh_CN",
        ar: "ar_AR",
        hi: "hi_IN",
      };
      return localeMap[lang] || `${lang}_${lang.toUpperCase()}`;
    }
    return {
      metadataBase,
      title: seo.title,
      description: seo.description,
      alternates: {
        canonical: `/${lang}`,
        languages: {
          ...languages,
          "x-default": "/en",
        },
      },
      openGraph: {
        title: seo.ogTitle || seo.title,
        description: seo.ogDescription || seo.description,
        url: `/${lang}`,
        siteName: "WeddWeb",
        locale: getOGLocale(lang),
        images: [ogImage],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: seo.ogTitle || seo.title,
        description: seo.ogDescription || seo.description,
        images: [ogImage],
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
    const translations = await getMergedTranslations(site.id, lang, "en");

    if (site.is_expired && site.plan_type === "free") {
      return <ExpiredSiteNotice translations={translations} lang={lang} />;
    }
    const showFooter = await shouldShowFooter({ host, routeKind: "tenant" });

    return (
      <div className="tenant-theme">
        <TenantPageComponent lang={lang} translations={translations} />
        {showFooter && <Footer lang={lang} translations={translations} />}
      </div>
    );
  } else {
    const translations = await fetchMarketingTranslations(lang, "en");
    return (
      <div className="marketing-theme">
        <MarketingPageComponent
          initialLang={lang}
          translations={translations}
        />
        <Footer lang={lang} translations={translations} />
      </div>
    );
  }
}
