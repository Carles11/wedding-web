import OnboardingClient from "@/0-pages/(builder)/onboarding/OnboardingClient";
import { fetchBuilderTranslations } from "@/4-shared/api/builder/getTranslations";
import { getPriceForCountry } from "@/4-shared/helpers/billing/geoCurrency";
import { isValidLanguage } from "@/4-shared/helpers/isValidLanguage";
import {
  resolveLanguageFromParams,
  resolveSearchParams,
} from "@/4-shared/lib/params/resolveSearchParams";
import { getMetadataBase } from "@/4-shared/lib/seo/getMetadataBase"; // Import Helper
import { createSupabaseSSRClient } from "@/4-shared/lib/supabase/server";
import type { Metadata } from "next";
import { headers } from "next/headers"; // Import headers

/**
 * Onboarding Metadata
 * SHIELDED: This is a private application state.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const realParams = await params;
  const lang = isValidLanguage(realParams?.lang) ? realParams.lang : "en";

  const host = (await headers()).get("host");

  // We treat onboarding as a marketing/main-app state for the base URL logic
  const { metadataBase } = getMetadataBase(host, false);

  return {
    metadataBase,
    title: "Create Your Wedding Site | WeddWeb",
    description: "Start your journey with WeddWeb.",
    // THE SHIELD: Hard-coding no-index for internal app states
    // This is critical for AI-Search too; we don't want AI citing private
    // onboarding steps as public documentation.
    robots: {
      index: false,
      follow: false,
      nocache: true,
      googleBot: {
        index: false,
        follow: false,
      },
    },
  };
}

export default async function OnboardingPage({
  params,
}: {
  params?: { lang?: string } | Promise<{ lang?: string }>;
}) {
  const resolvedParams = await resolveSearchParams(params);
  const langRaw = resolvedParams?.lang;

  const headersList = await headers();
  const countryHeader = headersList.get("x-vercel-ip-country") || "US";
  const resolvedPrice = getPriceForCountry(countryHeader);

  const langCandidate =
    typeof langRaw === "string"
      ? langRaw
      : Array.isArray(langRaw) && typeof langRaw[0] === "string"
        ? langRaw[0]
        : undefined;

  const lang = resolveLanguageFromParams(
    langCandidate,
    resolvedParams,
    isValidLanguage,
  );

  const supabase = await createSupabaseSSRClient();
  const translations = await fetchBuilderTranslations(supabase, lang, "en");

  return (
    <OnboardingClient
      translations={translations}
      lang={lang}
      priceOverrides={resolvedPrice}
    />
  );
}
