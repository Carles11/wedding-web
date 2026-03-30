export function generateSoftwareSchema(
  translations: Record<string, string>,
  lang: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "WeddWeb",
    operatingSystem: "All",
    applicationCategory: "BusinessApplication",
    description:
      translations["marketing.hero.subheadline"] ||
      "Create your professional wedding website easily.",
    offers: {
      "@type": "AggregateOffer",
      lowPrice: "0",
      highPrice: "29", // Update based on your actual premium price
      priceCurrency: "USD",
    },
    featureList: [
      translations["feature.multilingual.title"] || "Multilingual Support",
      translations["feature.rsvp.title"] || "RSVP Management",
      translations["feature.custom_design.title"] || "Custom Designs",
      "Guest List Management",
      "Mobile Friendly",
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "120",
    },
  };
}
