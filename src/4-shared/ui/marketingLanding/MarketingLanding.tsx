import React from "react";
import { fetchMarketingTranslations } from "@/4-shared/lib/marketingTranslations";
import HeroMarketing, {
  FeaturesGrid,
  TestimonialsSection,
  PricingSection,
  CTASection,
} from "@/4-shared/ui/marketing";

/**
 * Props for MarketingLanding
 */
export interface MarketingLandingProps {
  lang?: string;
}

export async function MarketingLanding({ lang = "en" }: MarketingLandingProps) {
  const translations = await fetchMarketingTranslations(lang, "en");

  return (
    <main className="min-h-screen">
      {/* 1. Hero Section */}
      <HeroMarketing
        headline={translations["marketing.hero.headline"]}
        subheadline={translations["marketing.hero.subheadline"]}
        ctaPrimary={translations["marketing.hero.cta_primary"]}
        ctaSecondary={translations["marketing.hero.cta_secondary"]}
      />

      {/* 2. Features Grid */}
      <FeaturesGrid
        sectionTitle={translations["marketing.features.section_title"]}
        freeTierName={translations["marketing.features.free_tier_name"]}
        premiumTierName={translations["marketing.features.premium_tier_name"]}
        freeFeatures={[
          {
            icon: "🌐",
            title: translations["marketing.features.free.subdomain_title"],
            description: translations["marketing.features.free.subdomain_desc"],
          },
          {
            icon: "🗣️",
            title: translations["marketing.features.free.one_language_title"],
            description:
              translations["marketing.features.free.one_language_desc"],
          },
          {
            icon: "🏨",
            title:
              translations["marketing.features.free.two_accommodations_title"],
            description:
              translations["marketing.features.free.two_accommodations_desc"],
          },
          {
            icon: "🎭",
            title: translations["marketing.features.free.two_events_title"],
            description:
              translations["marketing.features.free.two_events_desc"],
          },
        ]}
        premiumFeatures={[
          {
            icon: "🔗",
            title:
              translations["marketing.features.premium.custom_domain_title"],
            description:
              translations["marketing.features.premium.custom_domain_desc"],
          },
          {
            icon: "🌍",
            title:
              translations[
                "marketing.features.premium.unlimited_languages_title"
              ],
            description:
              translations[
                "marketing.features.premium.unlimited_languages_desc"
              ],
          },
          {
            icon: "♾️",
            title:
              translations[
                "marketing.features.premium.unlimited_content_title"
              ],
            description:
              translations["marketing.features.premium.unlimited_content_desc"],
          },
          {
            icon: "🎁",
            title:
              translations["marketing.features.premium.gift_registry_title"],
            description:
              translations["marketing.features.premium.gift_registry_desc"],
          },
        ]}
      />

      {/* 3. Testimonials Section */}
      <TestimonialsSection
        sectionTitle={translations["marketing.testimonials.section_title"]}
        sectionSubtitle={
          translations["marketing.testimonials.section_subtitle"]
        }
        viewExampleButtonText={
          translations["marketing.testimonials.view_example_button"]
        }
        examples={[
          {
            siteName: "Ines & Carles",
            siteUrl: "https://inesundcarles.dog",
            isPremium: true,
          },
          {
            siteName: "Carles & Ines",
            siteUrl: "https://www.carlesundines.weddweb.com",
            isPremium: false,
          },
        ]}
      />

      {/* 4. Pricing Section */}
      <PricingSection
        sectionTitle={translations["marketing.pricing.section_title"]}
        freePlanName={translations["marketing.pricing.free_plan_name"]}
        freePlanPrice={translations["marketing.pricing.free_plan_price"]}
        premiumPlanName={translations["marketing.pricing.premium_plan_name"]}
        premiumPlanPrice={translations["marketing.pricing.premium_plan_price"]}
        premiumPlanCTA={translations["marketing.pricing.premium_plan_cta"]}
      />

      {/* 5. Final CTA Section */}
      <CTASection
        headline={translations["marketing.cta.headline"]}
        description={translations["marketing.cta.description"]}
        buttonText={translations["marketing.cta.button_text"]}
      />
    </main>
  );
}
