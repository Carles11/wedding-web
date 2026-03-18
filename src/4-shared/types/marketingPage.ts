import { I18nText } from "./marketing";

export type MarketingTranslations = Record<string, string>;

export type MarketingPageProps = {
  initialLang?: string;
  translations: MarketingTranslations;
};

/**
 * Props for `HeroMarketing` component.
 */
export interface HeroMarketingProps {
  /** Headline text (e.g., translations['marketing.hero.headline']) */
  headline: string;
  /** Subheadline text (e.g., translations['marketing.hero.subheadline']) */
  subheadline: string;
  /** Primary CTA button text (e.g., translations['marketing.hero.cta_primary']) */
  ctaPrimary: string;
  /** Optional secondary CTA button text (e.g., translations['marketing.hero.cta_secondary']) */
  ctaSecondary?: string;
  /** Optional callback for primary CTA button */
  onPrimaryClick?: () => void;
  /** Optional callback for secondary CTA button */
  onSecondaryClick?: () => void;
}

/**
 * Single feature item displayed in the grid.
 */
export type Feature = {
  /** Feature title */
  title: string;
  /** Feature description */
  description: string;
};

/**
 * Props for `FeaturesGrid` component.
 */
export interface FeaturesGridProps {
  /** Section heading text */
  sectionTitle: string;
  /** Free tier display name */
  freeTierName: string;
  /** Premium tier display name */
  premiumTierName: string;
  /** Features included in the free tier */
  freeFeatures: Feature[];
  /** Features included in the premium tier */
  premiumFeatures: Feature[];
  /** Label for the premium badge (e.g., "Popular") */
  popularBadgeLabel?: string;
}

/**
 * Free vs Paid tier comparison item.
 */
export type FeatureTier = {
  /** Tier name (e.g., "Free Plan", "Premium Plan") */
  name: I18nText;
  /** Features included in this tier */
  features: Feature[];
  /** Whether this tier should be visually highlighted (premium) */
  highlighted: boolean;
  [key: string]: unknown;
};

/**
 * Example site type for showcasing live wedding sites
 */
export type ExampleSite = {
  siteName: string;
  siteUrl: string;
  siteDescription: string;
  previewImage?: string;
  isPremium: boolean;
};

/**
 * Props for TestimonialsSection
 */
export interface TestimonialsSectionProps {
  sectionTitle: string;
  sectionSubtitle: string;
  viewExampleButtonText: string;
  examples: ExampleSite[];
}

export type MarketingFeatureItem = {
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
  perSiteText: string;
  premiumPlanCTA: string;
  premiumPlanFeatures: string[];
  onFreePlanClick: () => void;
  onPremiumPlanClick: () => void;
  popularBadgeLabel: string;
};

export interface PricingSectionProps {
  sectionTitle: string;
  freePlanName: string;
  freePlanPrice: string;
  /** CTA for free plan button */
  freePlanCTA?: string;
  /** Feature texts for free plan */
  freePlanFeatures?: string[];
  premiumPlanName: string;
  premiumPlanPrice: string;
  premiumPlanCTA: string;
  /** Feature texts for premium plan */
  premiumPlanFeatures?: string[];
  onFreePlanClick?: () => void;
  onPremiumPlanClick?: () => void;
  comingSoonText?: string;
  perSiteText?: string;
  popularBadgeLabel: string;
}

/**
 * Props for CTASection
 */
export interface CTASectionProps {
  headline: string;
  description: string;
  buttonText: string;
  onButtonClick?: () => void;
}

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
