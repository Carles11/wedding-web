/**
 * Language code literals supported by the marketing types.
 * Restricting to the 10 supported languages gives better type-safety
 * while still satisfying the `Record<..., string>` requirement.
 */
export type MarketingLangCode =
  | "en"
  | "zh"
  | "hi"
  | "es"
  | "ar"
  | "fr"
  | "de"
  | "pt"
  | "ru"
  | "it";

/**
 * i18n text map for the supported languages.
 */
export type I18nText = Record<MarketingLangCode, string>;

/**
 * Hero section structure for the marketing landing page.
 */
export type HeroContent = {
  /** Headline text mapped by language code */
  headline: I18nText;
  /** Subheadline text mapped by language code */
  subheadline: I18nText;
  /** Primary CTA button text mapped by language code */
  ctaPrimary: I18nText;
  /** Optional secondary CTA button text mapped by language code */
  ctaSecondary?: I18nText;
  [key: string]: unknown;
};

/**
 * Single feature item used in the features list and tiers.
 */
export type Feature = {
  /** Emoji or icon identifier (string) */
  icon: string;
  /** Feature title mapped by language code */
  title: I18nText;
  /** Feature description mapped by language code */
  description: I18nText;
  [key: string]: unknown;
};

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
 * Testimonial or example site showcase entry.
 */
export type Testimonial = {
  /** Display name of the site owners (e.g., "Ines & Carles") */
  siteName: string;
  /** Public URL to the example site */
  siteUrl: string;
  /** Image url or path for a preview */
  preview: string;
  /** Optional quoted testimonial text mapped by language code */
  quote?: I18nText;
  [key: string]: unknown;
};

/**
 * Pricing plan placeholder structure (for Stripe integration later).
 */
export type PricingPlan = {
  /** Plan display name mapped by language code */
  name: I18nText;
  /** Price label mapped by language code (e.g., "Free", "$9/month") */
  price: I18nText;
  /** Array of feature keys or short descriptors */
  features: string[];
  /** CTA button text mapped by language code */
  ctaText: I18nText;
  /** Whether this plan is highlighted */
  highlighted: boolean;
  [key: string]: unknown;
};

/**
 * Final call-to-action section structure.
 */
export type CTASection = {
  /** Headline mapped by language code */
  headline: I18nText;
  /** Description mapped by language code */
  description: I18nText;
  /** Button text mapped by language code */
  buttonText: I18nText;
  /** Destination URL for the CTA button */
  buttonUrl: string;
  [key: string]: unknown;
};

/**
 * Top-level marketing content structure for the landing page.
 */
export type MarketingContent = {
  /** Hero section content */
  hero: HeroContent;
  /** Feature list */
  features: Feature[];
  /** Example testimonials / showcases */
  testimonials: Testimonial[];
  /** Pricing plans (free, paid tiers) */
  pricing: PricingPlan[] | FeatureTier[];
  /** Final call-to-action section */
  cta: CTASection;
  [key: string]: unknown;
};
