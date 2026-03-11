import PricingPage from "@/0-pages/(marketing)/PricingPage";
import { getSiteByDomain } from "@/4-shared/lib/getSiteByDomain";
import { getMergedTranslations } from "@/4-shared/lib/i18n";
import { generateSiteMetadata } from "@/4-shared/lib/seo/generateSiteMetadata";
import type { Metadata } from "next";
import { headers } from "next/headers";

const SITE_PUBLIC_BASEURL =
  process.env.NEXT_PUBLIC_MARKETING_BASE_URL || "https://weddweb.com";

export default PricingPage;

// SEO and meta:
export async function generateMetadata({
  params,
}: {
  params?: { lang?: string };
  searchParams?: { lang?: string };
}): Promise<Metadata> {
  // Support ?lang or [lang]
  const realParams = await params;
  const lang = realParams?.lang ?? "en";

  const host = ((await headers()).get("host") ?? "").toLowerCase().trim();
  const site = await getSiteByDomain(host);
  const translations = await getMergedTranslations(site?.id, lang, "en");

  return generateSiteMetadata({
    site,
    lang,
    translations,
    baseUrl: SITE_PUBLIC_BASEURL,
    pageKind: "marketing",
  });
}
