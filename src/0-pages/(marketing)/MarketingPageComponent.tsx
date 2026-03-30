"use client";

import { buildMarketingPageViewModel } from "@/1-widgets/marketing/model";
import HeroMarketing, {
  CTASection,
  FeaturesGrid,
  MarketingFloatingLanguageSelector,
  PricingSection,
  TestimonialsSection,
} from "@/1-widgets/marketing/ui";
import { updateAccountInfo } from "@/3-entities/account/api/accountCrud";
import { useSupabaseAuth } from "@/4-shared/hooks/useSupabaseAuth";
import { JsonLd } from "@/4-shared/lib/seo/JsonLd";
import { generateSoftwareSchema } from "@/4-shared/lib/seo/generateSoftwareSchema";
import type { MarketingPageProps } from "@/4-shared/types";
import { CookiesConsentBanner } from "@/4-shared/ui/CookiesConsentBanner";
import { useRouter } from "next/navigation";
/**
 * Refactored MarketingPageComponent
 *
 * - Optimized for INP (Interaction to Next Paint)
 * - Zero-state translation management (uses props directly)
 * - SEO-stable (Server-rendered content is never overwritten by client state)
 */
export default function MarketingPageComponent({
  initialLang = "en",
  translations,
}: MarketingPageProps) {
  const router = useRouter();
  const { user, supabase } = useSupabaseAuth();

  const primaryHref = user
    ? `/${initialLang}/builder`
    : `/${initialLang}/auth/signup`;
  const secondaryHref = "https://www.inesundcarles.dog";

  // HANDLER: Primary CTA (Builder or Signup)
  const handlePrimaryClick = async () => {
    // Immediate feedback for INP: We don't wait for the session to push the route
    // if the user object is already present from the hook.
    if (user) {
      router.push(`/${initialLang}/builder`);
      return;
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session?.user) {
      router.push(`/${initialLang}/builder`);
    } else {
      router.push(`/${initialLang}/auth/signup`);
    }
  };

  // HANDLER: Secondary CTA
  const handleSecondaryClick = () => {
    window.open(secondaryHref, "_blank");
  };

  // HANDLER: Language Selector
  const handleLanguageChange = async (lang: string) => {
    // If user is logged in, sync preference in background
    if (user?.id) {
      updateAccountInfo(user.id, { preferred_language: lang });
    }

    // NATIVE REDIRECT: Let the Server Page handle fetching new translations
    // This eliminates the need for client-side 'useEffect' fetching.
    router.push(`/${lang}`);
  };

  // VIEW MODEL: Generated directly from props for instant hydration
  const viewModel = buildMarketingPageViewModel(translations, {
    onPrimaryClick: handlePrimaryClick,
    onSecondaryClick: handleSecondaryClick,
  });

  // NEW: Generate the Software Schema
  const softwareSchema = generateSoftwareSchema(translations, initialLang);

  // NEW: Generate the FAQ Schema (Optional but HIGHLY recommended for marketing)
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: translations["marketing.faq.q1.title"] || "Is WeddWeb free?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            translations["marketing.faq.q1.text"] ||
            "Yes, we offer a free tier with all essential features.",
        },
      },
    ],
  };

  return (
    <>
      {/* SEO/AI JSON-LD Blocks */}
      <JsonLd data={softwareSchema} />
      <JsonLd data={faqSchema} />
      <MarketingFloatingLanguageSelector
        currentLang={initialLang}
        label={translations["marketing.lang_selector.label"]}
        onLanguageChange={handleLanguageChange}
      />

      <main className="min-h-screen">
        {/* SEMANTIC CHECK: HeroMarketing uses <h1> as verified in Source 9 */}
        <HeroMarketing
          {...viewModel.hero}
          lang={initialLang}
          primaryHref={primaryHref}
          secondaryHref={secondaryHref}
        />

        {/* SEMANTIC CHECK: FeaturesGrid uses <h2> as verified in Source 8 */}
        <FeaturesGrid lang={initialLang} {...viewModel.features} />

        {/* SEMANTIC CHECK: TestimonialsSection uses <h2> as verified in Source 12 */}
        <TestimonialsSection {...viewModel.testimonials} />

        {/* SEMANTIC CHECK: PricingSection uses <h2> as verified in Source 11 */}
        <PricingSection
          {...viewModel.pricing}
          onFreePlanClick={handlePrimaryClick}
          onPremiumPlanClick={handlePrimaryClick}
          primaryHref={primaryHref}
        />

        {/* SEMANTIC CHECK: CTASection uses <h2> as verified in Source 7 */}
        <CTASection
          {...viewModel.cta}
          onButtonClick={handlePrimaryClick}
          primaryHref={primaryHref}
        />
      </main>

      <CookiesConsentBanner
        translations={translations}
        lang={initialLang}
        userId={user?.id}
      />
    </>
  );
}
