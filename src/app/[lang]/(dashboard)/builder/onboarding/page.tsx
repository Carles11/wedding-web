import OnboardingClient from "@/0-pages/(builder)/onboarding/OnboardingClient";
import { fetchBuilderTranslations } from "@/4-shared/api/builder/getTranslations";
import { isValidLanguage } from "@/4-shared/helpers/isValidLanguage";
import {
  resolveLanguageFromParams,
  resolveSearchParams,
} from "@/4-shared/lib/params/resolveSearchParams";
import { createSupabaseSSRClient } from "@/4-shared/lib/supabase/server";

export default async function OnboardingPage({
  params,
}: {
  params?: { lang?: string } | Promise<{ lang?: string }>;
}) {
  // Use helpers to resolve params and lang
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
