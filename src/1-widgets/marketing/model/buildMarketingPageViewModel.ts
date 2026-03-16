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
    siteUrl: "https://carlesundines.weddweb.com",
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
      freeFeatures: [
        {
          icon: "🌐",
          title: translations["marketing.features.free_plan_feature_1"],
          description: translations["marketing.features.free_plan_feature_1"],
        },
        {
          icon: "🗣️",
          title: translations["marketing.features.free_plan_feature_2"],
          description: translations["marketing.features.free_plan_feature_2"],
        },
        {
          icon: "🏨",
          title: translations["marketing.features.free_plan_feature_3"],
          description: translations["marketing.features.free_plan_feature_3"],
        },
        {
          icon: "🎭",
          title: translations["marketing.features.free_plan_feature_4"],
          description: translations["marketing.features.free_plan_feature_4"],
        },
      ],
      premiumFeatures: [
        {
          icon: "🔗",
          title: translations["marketing.features.premium_plan_feature_1"],
          description:
            translations["marketing.features.premium_plan_feature_1"],
        },
        {
          icon: "🌍",
          title: translations["marketing.features.premium_plan_feature_2"],
          description:
            translations["marketing.features.premium_plan_feature_2"],
        },
        {
          icon: "♾️",
          title: translations["marketing.features.premium_plan_feature_3"],
          description:
            translations["marketing.features.premium_plan_feature_3"],
        },
        {
          icon: "🎁",
          title: translations["marketing.features.premium_plan_feature_4"],
          description:
            translations["marketing.features.premium_plan_feature_4"],
        },
        {
          icon: "🎁",
          title: translations["marketing.features.premium_plan_feature_5"],
          description:
            translations["marketing.features.premium_plan_feature_5"],
        },
      ],
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
      freePlanFeatures: [
        translations["marketing.pricing.free.feature_1"],
        translations["marketing.pricing.free.feature_2"],
        translations["marketing.pricing.free.feature_3"],
        translations["marketing.pricing.free.feature_4"],
      ],
      premiumPlanName: translations["marketing.pricing.premium_plan_name"],
      premiumPlanPrice: translations["marketing.pricing.premium_plan_price"],
      comingSoonText: translations["marketing.pricing.premium_coming_soon"],
      perSiteText: translations["marketing.pricing.per_site"],
      premiumPlanCTA: translations["marketing.pricing.premium_plan_cta"],
      premiumPlanFeatures: [
        translations["marketing.pricing.premium.feature_1"],
        translations["marketing.pricing.premium.feature_2"],
        translations["marketing.pricing.premium.feature_3"],
        translations["marketing.pricing.premium.feature_4"],
        translations["marketing.pricing.premium.feature_5"],
      ],
      onFreePlanClick: handlers.onPrimaryClick,
      onPremiumPlanClick: handlers.onPrimaryClick,
    },
    cta: {
      headline: translations["marketing.cta.headline"],
      description: translations["marketing.cta.description"],
      buttonText: translations["marketing.cta.button_text"],
      onButtonClick: handlers.onPrimaryClick,
    },
  };
}
