import TenantPageComponent from "@/0-pages/(tenant)/TenantPageComponent";
import { SUPPORTED_LANGUAGES, SupportedLanguage } from "@/4-shared/config/i18n";
import { getSEOMetadata } from "@/4-shared/config/seo";
import { getSiteByDomain } from "@/4-shared/lib/getSiteByDomain";
import { getMergedTranslations } from "@/4-shared/lib/i18n";
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

  if (!site) return {}; // No metadata for non-tenant routes here

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

    const socialOther = {
      "og:see_also": [...WEDDWEB_SOCIAL_PROFILES],
      "twitter:see_also": [...WEDDWEB_SOCIAL_PROFILES],
    };
    const finalMeta = { ...meta, metadataBase, other: socialOther };

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
    const seo = getSEOMetadata(lang, "marketing", "home");
    const ogImage = "/assets/og/weddweb-OG.png";

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
      openGraph: {
        title: seo.ogTitle || seo.title,
        description: seo.ogDescription || seo.description,
        url: `${baseUrl}/${lang}`,
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

export default async function Page({
  params,
}: {
  params: Promise<{ lang?: string }>;
}) {
  const resolvedParams = await params;
  const langInput = resolvedParams?.lang || "en";
  const headersList = await headers();
  const host = (headersList.get("host") ?? "").toLowerCase().trim();
  const site = await getSiteByDomain(host);

  // If no site found, redirect to root marketing
  if (!site) {
    redirect("/");
  }

  // --- CASE A: TENANT SITE ---
  const allowedLangs =
    site.languages?.length > 0 ? site.languages : [site.default_lang || "en"];
  if (!allowedLangs.includes(langInput)) {
    redirect(`/${site.default_lang || "en"}`);
  }

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
