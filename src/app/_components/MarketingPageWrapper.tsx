"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import LanguageSelector from "@/4-shared/ui/LanguageSelector";
import HeroMarketing, {
  FeaturesGrid,
  TestimonialsSection,
  PricingSection,
  CTASection,
} from "@/4-shared/ui/marketing";

interface Props {
  initialLang?: string;
  translations: Record<string, string>;
}

export default function MarketingPageWrapper({
  initialLang = "en",
  translations,
}: Props) {
  const router = useRouter();
  const [currentLang, setCurrentLang] = useState(initialLang || "en");

  const handleLanguageChange = (lang: string) => {
    setCurrentLang(lang);
    // update URL query and navigate to fetch server translations
    router.push(`/?lang=${lang}`);
  };

  return (
    <>
      <div className="fixed top-4 right-4 z-50">
        <LanguageSelector
          currentLang={currentLang}
          label={translations["marketing.lang_selector.label"]}
          onLanguageChange={handleLanguageChange}
        />
      </div>

      <main className="min-h-screen">
        <HeroMarketing
          headline={translations["marketing.hero.headline"]}
          subheadline={translations["marketing.hero.subheadline"]}
          ctaPrimary={translations["marketing.hero.cta_primary"]}
          ctaSecondary={translations["marketing.hero.cta_secondary"]}
        />

        <FeaturesGrid
          sectionTitle={translations["marketing.features.section_title"]}
          freeTierName={translations["marketing.features.free_tier_name"]}
          premiumTierName={translations["marketing.features.premium_tier_name"]}
          freeFeatures={[
            {
              icon: "🌐",
              title: translations["marketing.features.free.subdomain_title"],
              description:
                translations["marketing.features.free.subdomain_desc"],
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
                translations[
                  "marketing.features.free.two_accommodations_title"
                ],
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
                translations[
                  "marketing.features.premium.unlimited_content_desc"
                ],
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

        <PricingSection
          sectionTitle={translations["marketing.pricing.section_title"]}
          freePlanName={translations["marketing.pricing.free_plan_name"]}
          freePlanPrice={translations["marketing.pricing.free_plan_price"]}
          freePlanCTA={translations["marketing.pricing.free_plan_cta"]}
          freePlanFeatures={[
            translations["marketing.pricing.free.feature_1"],
            translations["marketing.pricing.free.feature_2"],
            translations["marketing.pricing.free.feature_3"],
            translations["marketing.pricing.free.feature_4"],
          ]}
          premiumPlanName={translations["marketing.pricing.premium_plan_name"]}
          premiumPlanPrice={
            translations["marketing.pricing.premium_plan_price"]
          }
          premiumPlanCTA={translations["marketing.pricing.premium_plan_cta"]}
          premiumPlanFeatures={[
            translations["marketing.pricing.premium.feature_1"],
            translations["marketing.pricing.premium.feature_2"],
            translations["marketing.pricing.premium.feature_3"],
            translations["marketing.pricing.premium.feature_4"],
            translations["marketing.pricing.premium.feature_5"],
          ]}
        />

        <CTASection
          headline={translations["marketing.cta.headline"]}
          description={translations["marketing.cta.description"]}
          buttonText={translations["marketing.cta.button_text"]}
        />
      </main>
    </>
  );
}
