import pkg from "@/../package.json";
import { PLAN_CATALOG } from "@/4-shared/config/plans/planCatalog";
import {
  getPriceValidUntil,
  SITE_LAUNCH_DATE,
} from "@/4-shared/config/seo/siteConfig";

/**
 * Returns the SoftwareApplication entity for embedding in a JSON-LD @graph.
 * Does NOT include a top-level "@context" — that belongs on the @graph wrapper.
 *
 * @param translations - Localized strings for feature labels and description.
 * @param lang         - BCP-47 language code for the current page.
 */
export function generateSoftwareSchema(
  translations: Record<string, string>,
  lang: string,
) {
  const today = new Date().toISOString().split("T")[0];

  // 1. Extract and translate features from both plans
  const allFeaturesRaw = [
    ...PLAN_CATALOG.free.features,
    ...PLAN_CATALOG.premium.features,
  ];

  const localizedFeatures = allFeaturesRaw.map((f) => {
    const translationKey = f.titleTranslationKeys?.[0];
    return (translationKey && translations[translationKey]) || f.title;
  });

  // 2. Remove duplicates
  const uniqueFeatures = Array.from(new Set(localizedFeatures));

  const lowPrice =
    PLAN_CATALOG.free.price === -1 ? "0" : `${PLAN_CATALOG.free.price}`;

  const highPrice = `${PLAN_CATALOG.premium.price}`;

  return {
    "@type": "SoftwareApplication",
    "@id": "https://weddweb.com/#software",
    name: "WeddWeb",
    operatingSystem: "All",
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "WeddingApplication",
    description:
      translations["marketing.hero.subheadline"] ||
      "WeddWeb is a multilingual wedding website platform. Build a beautiful, AI-ready site in 11 languages with sub-second performance, custom domains, and global accessibility.",
    softwareVersion: pkg.version,
    datePublished: SITE_LAUNCH_DATE,
    dateModified: today,
    inLanguage: lang,
    image: "https://weddweb.com/assets/og/weddweb-OG.png",
    screenshot: [
      {
        "@type": "ImageObject",
        url: "https://weddweb.com/assets/og/weddweb-OG.png",
        caption: "WeddWeb — Multilingual Wedding Website Platform",
      },
    ],
    // Relationship: this software is provided by the Organization
    provider: { "@id": "https://weddweb.com/#organization" },
    featureList: uniqueFeatures,
    offers: {
      "@type": "AggregateOffer",
      lowPrice: lowPrice,
      highPrice: highPrice,
      priceCurrency: PLAN_CATALOG.premium.currency,
      offerCount: "2",
      // Always Dec 31 of next year — guarantees ≥12 months validity,
      // keeping Google price rich-snippets permanently fresh.
      priceValidUntil: getPriceValidUntil(),
      availability: "https://schema.org/InStock",
    },
  };
}
