export type MarketingTranslations = Record<string, string>;

export type MarketingPageProps = {
  initialLang?: string;
  translations: MarketingTranslations;
};

export type MarketingFeatureItem = {
  icon: string;
  title: string;
  description: string;
};

export type MarketingExampleSite = {
  siteName: string;
  siteUrl: string;
  siteDescription: string;
  isPremium: boolean;
};

export type MarketingHeroViewModel = {
  headline: string;
  subheadline: string;
  ctaPrimary: string;
  ctaSecondary: string;
  onPrimaryClick: () => void;
  onSecondaryClick: () => void;
};

export type MarketingFeaturesViewModel = {
  sectionTitle: string;
  freeTierName: string;
  premiumTierName: string;
  freeFeatures: MarketingFeatureItem[];
  premiumFeatures: MarketingFeatureItem[];
  popularBadgeLabel: string;
};

export type MarketingTestimonialsViewModel = {
  sectionTitle: string;
  sectionSubtitle: string;
  viewExampleButtonText: string;
  examples: MarketingExampleSite[];
};

export type MarketingPricingViewModel = {
  sectionTitle: string;
  freePlanName: string;
  freePlanPrice: string;
  freePlanCTA: string;
  freePlanFeatures: string[];
  premiumPlanName: string;
  premiumPlanPrice: string;
  comingSoonText: string;
  perSiteText: string;
  premiumPlanCTA: string;
  premiumPlanFeatures: string[];
  onFreePlanClick: () => void;
  onPremiumPlanClick: () => void;
};

export type MarketingCtaViewModel = {
  headline: string;
  description: string;
  buttonText: string;
  onButtonClick: () => void;
};

export type MarketingPageViewModel = {
  hero: MarketingHeroViewModel;
  features: MarketingFeaturesViewModel;
  testimonials: MarketingTestimonialsViewModel;
  pricing: MarketingPricingViewModel;
  cta: MarketingCtaViewModel;
};

export type MarketingFloatingLanguageSelectorProps = {
  currentLang: string;
  label: string;
  onLanguageChange: (lang: string) => void;
};
