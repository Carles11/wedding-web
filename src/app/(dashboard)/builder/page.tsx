// Remove ALL fetching/redirecting for user here!
import BuilderClient from "@/0-pages/(builder)/BuilderClient";
import { fetchBuilderTranslations } from "@/4-shared/api/builder/getTranslations";
import { isValidLanguage } from "@/4-shared/helpers/isValidLanguage";

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
