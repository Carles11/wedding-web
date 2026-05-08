"use client";

import { buildMarketingPageViewModel } from "@/1-widgets/marketing/model";
import HeroMarketing, {
  CTASection,
  FeaturesGrid,
  PricingSection,
  TestimonialsSection,
} from "@/1-widgets/marketing/ui";
import GlobalLegacyBridge from "@/1-widgets/marketing/ui/features/GlobalLegacyBridge";
import { useSupabaseAuth } from "@/4-shared/hooks/useSupabaseAuth";
import { generateWebPageSchema } from "@/4-shared/lib/seo/generateGraphSchema";
import { JsonLd } from "@/4-shared/lib/seo/JsonLd";
import { WEDDWEB_SOCIAL_PROFILES } from "@/4-shared/lib/seo/socialProfiles";
import type { MarketingPageProps } from "@/4-shared/types";
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

  // VIEW MODEL: Generated directly from props for instant hydration
  const viewModel = buildMarketingPageViewModel(translations, {
    onPrimaryClick: handlePrimaryClick,
    onSecondaryClick: handleSecondaryClick,
  });

  // FAQ Schema — Updated with "Senior Copywriter" fallbacks
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name:
          translations["marketing.faq.q1.title"] || "Is WeddWeb really free?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            translations["marketing.faq.q1.text"] ||
            "Yes. We offer a fully functional free tier so you can start sharing your story immediately, with no credit card required.",
        },
      },
    ],
  };

  // Social profile URLs (update with real ones when live)
  const socialProfiles = WEDDWEB_SOCIAL_PROFILES;

  // SocialProfile structured data
  const socialProfileSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "WeddWeb",
    url: "https://weddweb.com/",
    sameAs: socialProfiles,
  };

  return (
    <>
      <JsonLd
        data={generateWebPageSchema(
          translations["marketing.hero.subheadline"] ||
            "11 native languages, optimized for search visibility, and an experience your guests will love — before the ink dries on your invitations.",
          initialLang,
        )}
      />
      <JsonLd data={faqSchema} />
      <JsonLd data={socialProfileSchema} />

      <main className="min-h-screen">
        <HeroMarketing
          {...viewModel.hero}
          lang={initialLang}
          primaryHref={primaryHref}
          secondaryHref={secondaryHref}
        />

        <FeaturesGrid lang={initialLang} {...viewModel.features} />

        <TestimonialsSection {...viewModel.testimonials} />

        <section id="pricing" className="scroll-mt-20">
          <PricingSection
            {...viewModel.pricing}
            onFreePlanClick={handlePrimaryClick}
            onPremiumPlanClick={handlePrimaryClick}
            primaryHref={primaryHref}
          />
        </section>

        <GlobalLegacyBridge translations={translations} lang={initialLang} />

        <CTASection
          {...viewModel.cta}
          onButtonClick={handlePrimaryClick}
          primaryHref={primaryHref}
        />
      </main>
    </>
  );
}
