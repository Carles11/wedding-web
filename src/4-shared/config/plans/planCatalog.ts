import { PlanFeatureCatalogItem } from "@/4-shared/types";

const FREE_PLAN_FEATURES: readonly PlanFeatureCatalogItem[] = [
  {
    title: "Your own wedding website",
    titleTranslationKeys: ["pricing.plan.free.feature_1"],
    marketingDescription: "Your site lives at yourname.weddweb.com",
    marketingDescriptionTranslationKey:
      "marketing.features.free_plan_feature_1_description",
  },
  {
    title: "1 language of your choice",
    titleTranslationKeys: ["pricing.plan.free.feature_5"],
    marketingDescription: "Share your site in one language of your choice",
    marketingDescriptionTranslationKey:
      "marketing.features.free_plan_feature_2_description",
  },
  {
    title: "Essential content (2 accommodations, 2 tips)",
    titleTranslationKeys: ["pricing.plan.free.feature_2"],
    marketingDescription:
      "Limited content: 2 accommodations, 2 activities, unlimited events",
    marketingDescriptionTranslationKey:
      "marketing.features.free_plan_feature_3_description",
  },
  {
    title: "Custom subdomain (your-names.weddweb.com)",
    titleTranslationKeys: ["pricing.plan.free.feature_8"],
    marketingDescription: "Choose a personalized subdomain for your site",
    marketingDescriptionTranslationKey:
      "marketing.features.free_plan_feature_4_description",
  },
  {
    title: "Email support",
    titleTranslationKeys: ["pricing.plan.free.feature_7"],
    marketingDescription: "Get help by email in less than 4 days",
    marketingDescriptionTranslationKey:
      "marketing.features.free_plan_feature_5_description",
  },
  {
    title: "Online forever (view-only after 6 months)",
    titleTranslationKeys: ["pricing.plan.free.feature_9"],
    marketingDescription:
      "Online indefinitely. Switches to view-only (Legacy Mode) after 6 months of inactivity.",
    marketingDescriptionTranslationKey:
      "marketing.features.free_plan_feature_6_description",
  },
  {
    title: "No credit card needed",
    titleTranslationKeys: ["pricing.plan.free.feature_10"],
    marketingDescription:
      "Start using the free plan without providing any payment information",
    marketingDescriptionTranslationKey:
      "marketing.features.free_plan_feature_7_description",
  },
];

const PREMIUM_PLAN_FEATURES: readonly PlanFeatureCatalogItem[] = [
  {
    title: "Your own domain (yournames.com)",
    titleTranslationKeys: ["pricing.plan.premium.feature_1"],
    marketingDescription: "Use your own domain for a fully branded experience",
    marketingDescriptionTranslationKey:
      "marketing.features.premium_plan_feature_1_description",
  },
  {
    title: "All 11 languages, every native script",
    titleTranslationKeys: ["pricing.plan.premium.feature_2"],
    marketingDescription: "Welcome guests from anywhere in the world",
    marketingDescriptionTranslationKey:
      "marketing.features.premium_plan_feature_2_description",
  },
  {
    title: "Unlimited content—photos, events & tips",
    titleTranslationKeys: ["pricing.plan.premium.feature_4"],
    marketingDescription:
      "Add as many events, accommodation tips, and activities as you need",
    marketingDescriptionTranslationKey:
      "marketing.features.premium_plan_feature_3_description",
  },
  {
    title: "Priority email support (reply in 48h)",
    titleTranslationKeys: ["pricing.plan.premium.feature_3"],
    marketingDescription: "Get help by email in less than 48 hours",
    marketingDescriptionTranslationKey:
      "marketing.features.premium_plan_feature_4_description",
  },
  {
    title: "Full gift registry & management",
    titleTranslationKeys: ["pricing.plan.premium.feature_5"],
    marketingDescription: "Create and manage multiple gift registries",
    marketingDescriptionTranslationKey:
      "marketing.features.premium_plan_feature_5_description",
  },
  {
    title: "Your site, permanently online forever",
    titleTranslationKeys: ["pricing.plan.premium.feature_6"],
    marketingDescription:
      "Your site remains online indefinitely and stays fully editable forever.",
    marketingDescriptionTranslationKey:
      "marketing.features.premium_plan_feature_6_description",
  },
];

export const PLAN_CATALOG = {
  free: {
    name: "Free",
    description: "Get started for free. Great for testing or small events.",
    descriptionTranslationKeys: ["billing.plan_desc_free"],
    features: FREE_PLAN_FEATURES,
    featuresList: FREE_PLAN_FEATURES.map((feature) => feature.title),
    limits: {
      images: 2,
      accommodations: 2,
      events: -1,
      whatToSee: 2,
      weddingGiftMethods: 1,
      languages: 1,
      customDomains: 0,
    },
    price: -1,
    currency: "EUR",
    billing: "",
  },
  premium: {
    name: "Premium",
    description: "Your PREMIUM plan details are shown below.",
    descriptionTranslationKeys: ["billing.plan_desc_premium"],
    features: PREMIUM_PLAN_FEATURES,
    featuresList: PREMIUM_PLAN_FEATURES.map((feature) => feature.title),
    limits: {
      images: 2,
      accommodations: -1,
      events: -1,
      whatToSee: -1,
      weddingGiftMethods: -1,
      languages: -1,
      customDomains: 1,
    },
    price: 39.0,
    currency: "EUR",
    billing: "one-time",
  },
} as const;

export type PlanCatalog = typeof PLAN_CATALOG;
