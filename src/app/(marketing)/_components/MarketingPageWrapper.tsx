"use client";
import HeroMarketing, {
  CTASection,
  FeaturesGrid,
  PricingSection,
  TestimonialsSection,
} from "@/1-widgets/marketing/ui";
import LanguageSelector from "@/4-shared/ui/builder/LanguageSelector";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

interface Props {
  initialLang?: string;
  translations: Record<string, string>;
}

export default function MarketingPageWrapper({
  initialLang = "en",
  translations,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [currentLang, setCurrentLang] = useState(initialLang || "en");

  const handleLanguageChange = (lang: string) => {
    setCurrentLang(lang);
    // Clone current params and overwrite lang
    const params = new URLSearchParams(searchParams.toString());
    params.set("lang", lang);
    // Push back to the SAME route with updated lang param
    router.push(`${pathname}?${params.toString()}`);
  };

  const handlePrimaryClick = () => {
    // For demo purposes, we'll just alert. In a real app, this could navigate to the builder or open a signup modal.
    router.push("/builder");
  };

  return (
    <>
      <div className="fixed top-4 right-4 z-50 bg-white/80 shadow-lg rounded-lg">
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
          onPrimaryClick={handlePrimaryClick}
          onSecondaryClick={() =>
            window.open("https://www.inesundcarles.dog", "_blank")
          }
        />

        <FeaturesGrid
          sectionTitle={translations["marketing.features.section_title"]}
          freeTierName={translations["marketing.features.free_tier_name"]}
          premiumTierName={translations["marketing.features.premium_tier_name"]}
          freeFeatures={[
            {
              icon: "🌐",
              title: translations["marketing.features.free_plan_feature_1"],
              description:
                translations["marketing.features.free_plan_feature_1"],
            },
            {
              icon: "🗣️",
              title: translations["marketing.features.free_plan_feature_2"],
              description:
                translations["marketing.features.free_plan_feature_2"],
            },
            {
              icon: "🏨",
              title: translations["marketing.features.free_plan_feature_3"],
              description:
                translations["marketing.features.free_plan_feature_3"],
            },
            {
              icon: "🎭",
              title: translations["marketing.features.free_plan_feature_4"],
              description:
                translations["marketing.features.free_plan_feature_4"],
            },
          ]}
          premiumFeatures={[
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
          ]}
          popularBadgeLabel={translations["marketing.features.popular_badge"]}
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
              siteDescription:
                translations?.["marketing.testimonials.example_description"],
              isPremium: true,
            },
            {
              siteName: "Carles & Ines",
              siteUrl: "https://carlesundines.weddweb.com",
              siteDescription:
                translations?.["marketing.testimonials.example_description"],
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
          comingSoonText={translations["marketing.pricing.premium_coming_soon"]}
          perSiteText={translations["marketing.pricing.per_site"]}
          premiumPlanCTA={translations["marketing.pricing.premium_plan_cta"]}
          premiumPlanFeatures={[
            translations["marketing.pricing.premium.feature_1"],
            translations["marketing.pricing.premium.feature_2"],
            translations["marketing.pricing.premium.feature_3"],
            translations["marketing.pricing.premium.feature_4"],
            translations["marketing.pricing.premium.feature_5"],
          ]}
          onFreePlanClick={handlePrimaryClick}
          onPremiumPlanClick={handlePrimaryClick}
        />

        <CTASection
          headline={translations["marketing.cta.headline"]}
          description={translations["marketing.cta.description"]}
          buttonText={translations["marketing.cta.button_text"]}
          onButtonClick={handlePrimaryClick}
        />
      </main>
    </>
  );
}
