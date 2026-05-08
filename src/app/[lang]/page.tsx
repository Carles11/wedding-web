import MarketingPageComponent from "@/0-pages/(marketing)/MarketingPageComponent";
import TenantPageComponent from "@/0-pages/(tenant)/TenantPageComponent";
import MarketingHeader from "@/1-widgets/marketing/ui/MarketingHeader";
import { fetchMarketingTranslations } from "@/4-shared/api/marketing";
import { SUPPORTED_LANGUAGES, SupportedLanguage } from "@/4-shared/config/i18n";
import { getSEOMetadata } from "@/4-shared/config/seo";
import { getSiteByDomain } from "@/4-shared/lib/getSiteByDomain";
import { getMergedTranslations } from "@/4-shared/lib/i18n";
import { JsonLd } from "@/4-shared/lib/seo/JsonLd";
import {
  BREADCRUMB_LABELS,
  generateBreadcrumbSchema,
} from "@/4-shared/lib/seo/generateBreadcrumbSchema";
import { generateSiteMetadata } from "@/4-shared/lib/seo/generateSiteMetadata";
import { getMetadataBase } from "@/4-shared/lib/seo/getMetadataBase";
import { WEDDWEB_SOCIAL_PROFILES } from "@/4-shared/lib/seo/socialProfiles";
import { Footer } from "@/4-shared/ui/commons/footer/Footer";
import { shouldShowBrandBadge, shouldShowFooter } from "@/4-shared/utils";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

/**
 * METADATA GENERATOR
 */
export async function generateMetadata({
  params,
}: {
  params?: Promise<{ lang?: string }>;
}): Promise<Metadata> {
  const resolvedParams = await (params ?? { lang: "en" });
  const lang = (resolvedParams.lang as SupportedLanguage) ?? "en";

  const host = ((await headers()).get("host") ?? "").toLowerCase().trim();
  const site = await getSiteByDomain(host);
  const { metadataBase, baseUrl } = getMetadataBase(host, !!site);

  if (site) {
    // 1. Tenant Language Guard (Metadata level)
    const allowedLangs =
      site.languages?.length > 0 ? site.languages : [site.default_lang || "en"];
    if (!allowedLangs.includes(lang)) return { metadataBase };

    // 2. Tenant Metadata Logic
    const translations = await getMergedTranslations(site.id, lang, "en");
    const meta = generateSiteMetadata({
      site,
      lang,
      translations,
      baseUrl,
      pageKind: "tenant",
    });

    const socialOther = {
      "og:see_also": [...WEDDWEB_SOCIAL_PROFILES],
      "twitter:see_also": [...WEDDWEB_SOCIAL_PROFILES],
    };
    const finalMeta = { ...meta, metadataBase, other: socialOther };

    // 3. SEO Privacy Toggle
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
    // 4. Marketing Metadata Logic
    const seo = getSEOMetadata(lang, "marketing", "home");
    const ogImage = "/assets/og/weddweb-OG.png";

    const languages: Record<string, string> = {};
    SUPPORTED_LANGUAGES.forEach((l) => {
      languages[l] = `/${l}`;
    });

    return {
      metadataBase,
      title: seo.title,
      description: seo.description,
      alternates: {
        canonical: `/${lang}`,
        languages: { ...languages, "x-default": "/en" },
      },
      openGraph: {
        title: seo.ogTitle || seo.title,
        description: seo.ogDescription || seo.description,
        url: `/${lang}`,
        siteName: "WeddWeb",
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
      other: {
        "og:see_also": [...WEDDWEB_SOCIAL_PROFILES],
        "twitter:see_also": [...WEDDWEB_SOCIAL_PROFILES],
      },
    };
  }
}

export const dynamic = "force-dynamic";

/**
 * MAIN PAGE COMPONENT
 */
export default async function Page({
  params,
}: {
  params: Promise<{ lang?: string }>;
}) {
  const resolvedParams = await params;
  const langInput = resolvedParams?.lang || "en";

  const host = ((await headers()).get("host") ?? "").toLowerCase().trim();
  const site = await getSiteByDomain(host);

  // --- CASE A: TENANT SITE ---
  if (site) {
    const allowedLangs =
      site.languages?.length > 0 ? site.languages : [site.default_lang || "en"];

    // 1. Tenant Language Guard (Redirect)
    if (!allowedLangs.includes(langInput)) {
      redirect(`/${site.default_lang || "en"}`);
    }

    // 2. Parallel Data Fetching for Tenant
    const [translations, showFooter, showBrandBadge] = await Promise.all([
      getMergedTranslations(site.id, langInput, "en"),
      shouldShowFooter({ planType: site.plan_type, routeKind: "tenant" }),
      shouldShowBrandBadge({ planType: site.plan_type, routeKind: "tenant" }),
    ]);

    return (
      <div className="tenant-theme">
        <TenantPageComponent
          lang={langInput}
          translations={translations}
          showBrandBadge={showBrandBadge}
        />
        {showFooter && <Footer lang={langInput} translations={translations} />}
      </div>
    );
  }

  // --- CASE B: MARKETING SITE ---
  const lang = SUPPORTED_LANGUAGES.includes(langInput as SupportedLanguage)
    ? (langInput as SupportedLanguage)
    : "en";

  // Parallel Data Fetching for Marketing
  const translations = await fetchMarketingTranslations(lang, "en");
  const { baseUrl } = getMetadataBase(host, false);
  const labels = BREADCRUMB_LABELS[lang] ?? BREADCRUMB_LABELS.en;

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: labels.home, item: `${baseUrl}/${lang}` },
  ]);

  return (
    <div className="marketing-theme">
      <JsonLd data={breadcrumbSchema} />
      <MarketingHeader lang={lang} translations={translations} />
      <MarketingPageComponent initialLang={lang} translations={translations} />
      <Footer lang={lang} translations={translations} />
    </div>
  );
}
