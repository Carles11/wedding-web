"use client";
import {
  buildBuilderUrl,
  buildLangQuery,
  buildMarketingPageViewModel,
  buildPathWithQuery,
  buildSignupUrl,
} from "@/1-widgets/marketing/model";
import HeroMarketing, {
  CTASection,
  FeaturesGrid,
  MarketingFloatingLanguageSelector,
  PricingSection,
  TestimonialsSection,
} from "@/1-widgets/marketing/ui";
import { useSupabaseAuth } from "@/4-shared/hooks/useSupabaseAuth";
import type { MarketingPageProps } from "@/4-shared/types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function MarketingPageComponent({
  initialLang = "en",
  translations,
}: MarketingPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user, supabase } = useSupabaseAuth();
  const [currentLang, setCurrentLang] = useState(initialLang || "en");

  const handleSecondaryClick = () => {
    window.open("https://www.inesundcarles.dog", "_blank");
  };

  const handleLanguageChange = (lang: string) => {
    setCurrentLang(lang);
    const langQuery = buildLangQuery(
      new URLSearchParams(searchParams.toString()),
      lang,
    );
    router.push(buildPathWithQuery(pathname, langQuery));
  };

  const handlePrimaryClick = async () => {
    const langQuery = buildLangQuery(
      new URLSearchParams(searchParams.toString()),
      currentLang,
    );

    // Re-check session at click time to avoid stale/null client state after back navigation.
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (user || session?.user) {
      router.push(buildBuilderUrl(langQuery));
      return;
    }

    router.push(buildSignupUrl(langQuery));
  };

  const viewModel = buildMarketingPageViewModel(translations, {
    onPrimaryClick: handlePrimaryClick,
    onSecondaryClick: handleSecondaryClick,
  });

  return (
    <>
      <MarketingFloatingLanguageSelector
        currentLang={currentLang}
        label={translations["marketing.lang_selector.label"]}
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
