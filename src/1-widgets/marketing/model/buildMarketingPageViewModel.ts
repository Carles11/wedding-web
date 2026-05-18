import {
  getLocalizedMarketingPlanFeatures,
  getLocalizedPlanFeatureTitles,
} from "@/4-shared/helpers/billing/entitlements";
import type {
  MarketingPageViewModel,
  MarketingTranslations,
} from "@/4-shared/types";

import {
  formatLocalPrice,
  getPriceForCountry,
} from "@/4-shared/helpers/billing/geoCurrency"; // <-- IMPORT HELPERS

const MARKETING_EXAMPLE_SITES = [
  {
    siteName: "Ines & Carles",
    siteUrl: "https://inesundcarles.dog",
    isPremium: true,
  },
  {
    siteName: "Carles & Ines",
    siteUrl: "https://inesundcarles.weddweb.com",
    isPremium: false,
  },
] as const;

type Handlers = {
  onPrimaryClick: () => void;
  onSecondaryClick: () => void;
};

export function buildMarketingPageViewModel(
  translations: MarketingTranslations,
  handlers: Handlers,
  countryCode: string | null = "US", // <-- ADDED: countryCode argument
  lang: string = "en", // <-- ADDED: lang argument
): MarketingPageViewModel {
  const freeFeatures = getLocalizedMarketingPlanFeatures("free", translations);
  const premiumFeatures = getLocalizedMarketingPlanFeatures(
    "premium",
    translations,
  );

  // DYNAMIC GEOTARGETING LOGIC
  const localPriceObj = getPriceForCountry(countryCode);
  const formattedPremiumPrice = formatLocalPrice(
    localPriceObj.price,
    localPriceObj.currency,
    lang,
  );
  const formattedFreePrice = formatLocalPrice(0, localPriceObj.currency, lang);

  return {
    hero: {
      headline:
        translations["marketing.hero.headline"] ||
        "Your Wedding. Live in Minutes.",
      subheadline:
        translations["marketing.hero.subheadline"] ||
        "11 native languages, optimized for search visibility, and an experience your guests will love — before the ink dries on your invitations.",
      ctaPrimary:
        translations["marketing.hero.cta_primary"] || "Create Yours Free",
      ctaSecondary:
        translations["marketing.hero.cta_secondary"] || "See a Real Example",
      onPrimaryClick: handlers.onPrimaryClick,
      onSecondaryClick: handlers.onSecondaryClick,
    },
    features: {
      sectionTitle:
        translations["marketing.features.section_title"] ||
        "Everything Done. Nothing Left to Worry About.",
      freeTierName: translations["marketing.features.free_tier_name"] || "Free",
      premiumTierName:
        translations["marketing.features.premium_tier_name"] || "Premium",
      freeFeatures,
      premiumFeatures,
      popularBadgeLabel:
        translations["marketing.features.popular_badge"] || "Couples' Choice",
      faqTitle:
        translations["marketing.faq.title"] ||
        "Good Questions. Honest Answers.",
    },
    testimonials: {
      sectionTitle:
        translations["marketing.testimonials.section_title"] ||
        "Couples Who Said 'Wow' First, Then 'I Do'",
      sectionSubtitle:
        translations["marketing.testimonials.section_subtitle"] ||
        "Built with WeddWeb in minutes",
      viewExampleButtonText:
        translations["marketing.testimonials.view_example_button"] ||
        "See It Live",
      examples: MARKETING_EXAMPLE_SITES.map((site) => ({
        ...site,
        siteDescription:
          translations["marketing.testimonials.example_description"] ||
          "A site their guests are still talking about.",
      })),
    },
    pricing: {
      sectionTitle:
        translations["marketing.pricing.section_title"] ||
        "One Price. No Surprises. Yours Forever.",
      freePlanName: translations["marketing.pricing.free_plan_name"] || "Free",
      freePlanPrice: formattedFreePrice, // <-- DYNAMICALLY OVERRIDDEN
      freePlanCTA:
        translations["marketing.pricing.free_plan_cta"] ||
        "Begin Your Story, Free",
      freePlanFeatures: getLocalizedPlanFeatureTitles("free", translations),
      premiumPlanName:
        translations["marketing.pricing.premium_plan_name"] || "Premium",
      premiumPlanPrice: formattedPremiumPrice, // <-- DYNAMICALLY OVERRIDDEN
      perSiteText:
        translations["marketing.pricing.per_site"] || "Once. Yours for life.",
      premiumPlanCTA:
        translations["marketing.pricing.premium_plan_cta"] ||
        "Get the Full Experience",
      premiumPlanFeatures: getLocalizedPlanFeatureTitles(
        "premium",
        translations,
      ),
      onFreePlanClick: handlers.onPrimaryClick,
      onPremiumPlanClick: handlers.onPrimaryClick,
      popularBadgeLabel:
        translations["marketing.features.popular_badge"] || "Couples' Choice",
    },
    cta: {
      headline:
        translations["marketing.cta.headline"] ||
        "Your guests are waiting to hear the news.",
      description:
        translations["marketing.cta.description"] ||
        "Give them something beautiful to open. Takes minutes. Lasts a lifetime.",
      buttonText:
        translations["marketing.cta.button_text"] || "Start Free Today",
      onButtonClick: handlers.onPrimaryClick,
    },
  };
}
