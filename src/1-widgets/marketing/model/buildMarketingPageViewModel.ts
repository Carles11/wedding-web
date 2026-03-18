import {
  getLocalizedMarketingPlanFeatures,
  getLocalizedPlanFeatureTitles,
} from "@/4-shared/helpers/billing/entitlements";
import type {
  MarketingPageViewModel,
  MarketingTranslations,
} from "@/4-shared/types";

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
): MarketingPageViewModel {
  const freeFeatures = getLocalizedMarketingPlanFeatures("free", translations);
  const premiumFeatures = getLocalizedMarketingPlanFeatures(
    "premium",
    translations,
  );

  return {
    hero: {
      headline: translations["marketing.hero.headline"],
      subheadline: translations["marketing.hero.subheadline"],
      ctaPrimary: translations["marketing.hero.cta_primary"],
      ctaSecondary: translations["marketing.hero.cta_secondary"],
      onPrimaryClick: handlers.onPrimaryClick,
      onSecondaryClick: handlers.onSecondaryClick,
    },
    features: {
      sectionTitle: translations["marketing.features.section_title"],
      freeTierName: translations["marketing.features.free_tier_name"],
      premiumTierName: translations["marketing.features.premium_tier_name"],
      freeFeatures,
      premiumFeatures,
      popularBadgeLabel: translations["marketing.features.popular_badge"],
    },
    testimonials: {
      sectionTitle: translations["marketing.testimonials.section_title"],
      sectionSubtitle: translations["marketing.testimonials.section_subtitle"],
      viewExampleButtonText:
        translations["marketing.testimonials.view_example_button"],
      examples: MARKETING_EXAMPLE_SITES.map((site) => ({
        ...site,
        siteDescription:
          translations["marketing.testimonials.example_description"],
      })),
    },
    pricing: {
      sectionTitle: translations["marketing.pricing.section_title"],
      freePlanName: translations["marketing.pricing.free_plan_name"],
      freePlanPrice: translations["marketing.pricing.free_plan_price"],
      freePlanCTA: translations["marketing.pricing.free_plan_cta"],
      freePlanFeatures: getLocalizedPlanFeatureTitles("free", translations),
      premiumPlanName: translations["marketing.pricing.premium_plan_name"],
      premiumPlanPrice: translations["marketing.pricing.premium_plan_price"],
      perSiteText: translations["marketing.pricing.per_site"],
      premiumPlanCTA: translations["marketing.pricing.premium_plan_cta"],
      premiumPlanFeatures: getLocalizedPlanFeatureTitles(
        "premium",
        translations,
      ),
      onFreePlanClick: handlers.onPrimaryClick,
      onPremiumPlanClick: handlers.onPrimaryClick,
      popularBadgeLabel: translations["marketing.features.popular_badge"],
    },
    cta: {
      headline: translations["marketing.cta.headline"],
      description: translations["marketing.cta.description"],
      buttonText: translations["marketing.cta.button_text"],
      onButtonClick: handlers.onPrimaryClick,
    },
  };
}
