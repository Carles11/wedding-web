// Remove ALL fetching/redirecting for user here!
import { fetchBuilderTranslations } from "@/4-shared/api/builder/getTranslations";
import BuilderClient from "./BuilderClient";
import { SUPPORTED_LANGUAGES } from "@/4-shared/config/i18n";
import type { SupportedLanguage } from "@/4-shared/config/i18n";

function isValidLanguage(lang: string | undefined): lang is SupportedLanguage {
  return !!lang && SUPPORTED_LANGUAGES.includes(lang as SupportedLanguage);
}

export default async function BuilderPage({
  searchParams,
}: {
  searchParams: { lang?: string };
}) {
  const params = await searchParams;
  const requested = params?.lang;
  const lang = isValidLanguage(requested) ? requested : "en";
  const translations = await fetchBuilderTranslations(lang, "en");

  return (
    <div className="min-h-screen bg-gray-50">
      <BuilderClient initialLang={lang} translations={translations} />
    </div>
  );
}
