import {
  FREE_ACCOMMODATION_LIMIT,
  FREE_CUSTOM_DOMAIN_LIMIT,
  FREE_EVENT_LIMIT,
  FREE_IMAGE_LIMIT,
  FREE_LANGUAGES_LIMIT,
  FREE_WHATTOSEE_LIMIT,
} from "@/4-shared/config/limits/usage-limits";

// Stripe IDs are resolved server-side from environment variables in
// src/4-shared/lib/stripe/stripeConfig.ts.
export const PLAN_DEFINITIONS = {
  free: {
    name: "Free",
    description: "Get started for free. Great for testing or small events.",
    featuresList: [
      "1 website",
      "2 accommodations",
      "Unlimited events",
      "2 recommendations (What to See)",
      "1 language",
      "No custom domains",
      "Basic support",
      "Custom subdomain (www.ieyourNames.weddweb.com)",
    ],
    limits: {
      images: FREE_IMAGE_LIMIT,
      accommodations: FREE_ACCOMMODATION_LIMIT,
      events: FREE_EVENT_LIMIT,
      whatToSee: FREE_WHATTOSEE_LIMIT,
      languages: FREE_LANGUAGES_LIMIT,
      customDomains: FREE_CUSTOM_DOMAIN_LIMIT,
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
      "Unlimited events",
      "Priority support",
      "Premium customization",
    ],
    limits: {
      images: -1, // -1 for unlimited
      accommodations: -1, // -1 for unlimited
      events: -1, // -1 for unlimited
      whatToSee: -1, // -1 for unlimited
      languages: -1, // -1 for unlimited
      customDomains: 1,
    },
    price: 39.0,
    currency: "EUR",
    billing: "one-time",
  },
  // TODO(agencies): re-enable when launching agency tier
  // agency_monthly: {
  //   name: "AGENCY (Monthly)",
  //   description: "For agencies: organize many events per month.",
  //   featuresList: [
  //     "Unlimited websites",
  //     "Unlimited events",
  //     "Custom domains",
  //     "Agency-specific tools",
  //   ],
  //   limits: { images: -1, accommodations: -1, events: -1, whatToSee: -1, languages: -1, customDomains: -1 },
  //   price: 59.0,
  //   currency: "EUR",
  //   billing: "monthly",
  // },
  // agency_yearly: {
  //   name: "AGENCY (Yearly)",
  //   description: "Same agency advantages with yearly billing.",
  //   featuresList: [
  //     "Unlimited websites",
  //     "Unlimited events",
  //     "Custom domains",
  //     "Agency-specific tools",
  //     "Best price for annual commitment",
  //   ],
  //   limits: { images: -1, accommodations: -1, events: -1, whatToSee: -1, languages: -1, customDomains: -1 },
  //   price: 599.0,
  //   currency: "EUR",
  //   billing: "yearly",
  // },
};
