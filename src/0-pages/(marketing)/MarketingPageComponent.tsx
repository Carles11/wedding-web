"use client";
import { buildMarketingPageViewModel } from "@/1-widgets/marketing/model";
import HeroMarketing, {
  CTASection,
  FeaturesGrid,
  MarketingFloatingLanguageSelector,
  PricingSection,
  TestimonialsSection,
} from "@/1-widgets/marketing/ui";
import { useSupabaseAuth } from "@/4-shared/hooks/useSupabaseAuth";
import type { MarketingPageProps } from "@/4-shared/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function MarketingPageComponent({
  initialLang = "en",
  translations,
}: MarketingPageProps) {
  const router = useRouter();

  const { user, supabase } = useSupabaseAuth();

  // SSR-safe: initialize from initialLang
  const [currentLang, setCurrentLang] = useState(initialLang || "en");
  const [currentTranslations, setCurrentTranslations] = useState(translations);

  // Sync currentLang with path segment on client only
  useEffect(() => {
    // Only update currentLang on client if needed
    setCurrentTranslations(translations);
  }, [initialLang, translations]);

  // Fetch translations when currentLang changes
  useEffect(() => {
    if (currentLang === initialLang) return;
    async function fetchTranslations() {
      const { fetchMarketingTranslations } =
        await import("@/4-shared/api/marketing");
      const newTranslations = await fetchMarketingTranslations(
        currentLang,
        "en",
      );
      setCurrentTranslations(newTranslations);
    }
    fetchTranslations();
  }, [currentLang, initialLang]);

  // Handler for primary CTA click
  const handlePrimaryClick = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (user || session?.user) {
      router.push(`/${currentLang}/builder`);
      return;
    }
    router.push(`/${currentLang}/auth/signup`);
  };

  // Handler for secondary CTA click
  const handleSecondaryClick = () => {
    window.open("https://www.inesundcarles.dog", "_blank");
  };

  // Handler for language selector
  const handleLanguageChange = (lang: string) => {
    setCurrentLang(lang);
    router.push(`/${lang}`);
  };

  const viewModel = buildMarketingPageViewModel(currentTranslations, {
    onPrimaryClick: handlePrimaryClick,
    onSecondaryClick: handleSecondaryClick,
  });

  return (
    <>
      <MarketingFloatingLanguageSelector
        currentLang={currentLang}
        label={currentTranslations["marketing.lang_selector.label"]}
        onLanguageChange={handleLanguageChange}
      />

      <main className="min-h-screen">
        <HeroMarketing {...viewModel.hero} />
        <FeaturesGrid {...viewModel.features} />
        <TestimonialsSection {...viewModel.testimonials} />
        <PricingSection {...viewModel.pricing} />
        <CTASection {...viewModel.cta} />
      </main>
    </>
  );
}
