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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang?: string }>;
}): Promise<Metadata> {
  const resolvedParams = await (params ?? { lang: "en" });
  const lang = (resolvedParams.lang as SupportedLanguage) ?? "en";
  const host = ((await headers()).get("host") ?? "").toLowerCase().trim();
  const site = await getSiteByDomain(host);
  const { metadataBase, baseUrl } = getMetadataBase(host, !!site);

  if (site) {
    const allowedLangs =
      site.languages?.length > 0 ? site.languages : [site.default_lang || "en"];
    if (!allowedLangs.includes(lang)) return { metadataBase };

    const translations = await getMergedTranslations(site.id, lang, "en");
    const meta = generateSiteMetadata({
      site,
      lang,
      translations,
      baseUrl,
      pageKind: "tenant",
    });

    return {
      ...meta,
      metadataBase,
      other: {
        "og:see_also": [...WEDDWEB_SOCIAL_PROFILES],
        "twitter:see_also": [...WEDDWEB_SOCIAL_PROFILES],
      },
      robots:
        site.seo_enabled === false
          ? { index: false, follow: false }
          : undefined,
    };
  }

  const seo = getSEOMetadata(lang, "marketing", "home");
  return {
    metadataBase,
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: `${baseUrl}/${lang}`,
      languages: {
        ...Object.fromEntries(
          SUPPORTED_LANGUAGES.map((l) => [l, `${baseUrl}/${l}`]),
        ),
        "x-default": `${baseUrl}/en`,
      },
    },
  };
}

export const dynamic = "force-dynamic";

export default async function Page({
  params,
}: {
  params: Promise<{ lang?: string }>;
}) {
  const resolvedParams = await params;
  const langInput = resolvedParams?.lang || "en";
  const headersList = await headers();
  const host = (headersList.get("host") ?? "").toLowerCase().trim();
  const countryHeader = headersList.get("x-vercel-ip-country") || "US";
  const site = await getSiteByDomain(host);

  if (site) {
    const allowedLangs =
      site.languages?.length > 0 ? site.languages : [site.default_lang || "en"];
    if (!allowedLangs.includes(langInput))
      redirect(`/${site.default_lang || "en"}`);

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

  const lang = SUPPORTED_LANGUAGES.includes(langInput as SupportedLanguage)
    ? (langInput as SupportedLanguage)
    : "en";
  const [translations, { baseUrl }] = await Promise.all([
    fetchMarketingTranslations(lang, "en"),
    Promise.resolve(getMetadataBase(host, false)),
  ]);

  const labels = BREADCRUMB_LABELS[lang] ?? BREADCRUMB_LABELS.en;
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: labels.home, item: `${baseUrl}/${lang}` },
  ]);

  return (
    <div className="marketing-theme">
      <JsonLd data={breadcrumbSchema} />
      <MarketingHeader lang={lang} translations={translations} />
      <MarketingPageComponent
        initialLang={lang}
        translations={translations}
        countryCode={countryHeader}
      />
      <Footer lang={lang} translations={translations} />
    </div>
  );
}
