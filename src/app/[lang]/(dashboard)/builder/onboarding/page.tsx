import OnboardingClient from "@/0-pages/(builder)/onboarding/OnboardingClient";
import { fetchBuilderTranslations } from "@/4-shared/api/builder/getTranslations";
import { isValidLanguage } from "@/4-shared/helpers/isValidLanguage";
import {
  resolveLanguageFromParams,
  resolveSearchParams,
} from "@/4-shared/lib/params/resolveSearchParams";
import { createSupabaseSSRClient } from "@/4-shared/lib/supabase/server";
import type { Metadata } from "next";

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

  return {
    title: "Create Your Wedding Site | WeddWeb",
    description: "Start your journey with WeddWeb.",
    // THE SHIELD: Hard-coding no-index for internal app states
    robots: {
      index: false,
      follow: false,
      nocache: true,
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

  return <OnboardingClient translations={translations} lang={lang} />;
}
