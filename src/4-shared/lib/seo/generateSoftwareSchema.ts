import pkg from "@/../package.json";
import { PLAN_CATALOG } from "@/4-shared/config/plans/planCatalog";

export function generateSoftwareSchema(
  translations: Record<string, string>,
  lang: string,
) {
  const today = new Date().toISOString().split("T")[0];

  // 1. Extract and Translate Features from both plans
  // We combine both so the AI knows the FULL capability of the software
  const allFeaturesRaw = [
    ...PLAN_CATALOG.free.features,
    ...PLAN_CATALOG.premium.features,
  ];

  const localizedFeatures = allFeaturesRaw.map((f) => {
    // Try to get the translated title if the key exists in our translations object
    const translationKey = f.titleTranslationKeys?.[0];
    return (translationKey && translations[translationKey]) || f.title;
  });

  // 2. Remove duplicates (some features might overlap between plans)
  const uniqueFeatures = Array.from(new Set(localizedFeatures));

  const lowPrice =
    PLAN_CATALOG.free.price === -1 ? "0" : `${PLAN_CATALOG.free.price}`; // Use template literal to avoid .toString() on never

  const highPrice = `${PLAN_CATALOG.premium.price}`;

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "WeddWeb",
    operatingSystem: "All",
    applicationCategory: "BusinessApplication",
    description:
      translations["marketing.hero.subheadline"] ||
      "Create your professional wedding website easily.",
    softwareVersion: pkg.version,
    datePublished: "2024-01-01",
    dateModified: today,
    inLanguage: lang,

    // 3. Dynamic Feature List from Real Data
    featureList: uniqueFeatures,

    // 4. Dynamic AggregateOffer from Real Data
    offers: {
      "@type": "AggregateOffer",
      lowPrice: lowPrice,
      highPrice: highPrice,
      priceCurrency: PLAN_CATALOG.premium.currency,
      offerCount: "2",
      priceValidUntil: "2027-01-01", // Best practice to set a future date
    },
  };
}
