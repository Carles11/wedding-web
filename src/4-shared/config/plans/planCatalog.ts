export const PLAN_CATALOG = {
  free: {
    name: "Free",
    description: "Get started for free. Great for testing or small events.",
    featuresList: [
      "1 website",
      "2 accommodations",
      "Unlimited program events",
      "2 recommendations (What to See)",
      "1 language",
      "No custom domains",
      "Basic support",
      "Custom subdomain (www.ieyourNames.weddweb.com)",
    ],
    limits: {
      images: 2,
      accommodations: 2,
      events: -1,
      whatToSee: 2,
      languages: 1,
      customDomains: 0,
    },
    price: -1,
    currency: "EUR",
    billing: "one-time",
  },
  premium: {
    name: "PREMIUM",
    description: "Unlock unlimited events and premium features.",
    featuresList: [
      "1 website",
      "Unlimited program events",
      "Priority support",
      "Premium customization",
    ],
    limits: {
      images: 2,
      accommodations: -1,
      events: -1,
      whatToSee: -1,
      languages: -1,
      customDomains: 1,
    },
    price: 39.0,
    currency: "EUR",
    billing: "one-time",
  },
} as const;

export type PlanCatalog = typeof PLAN_CATALOG;
