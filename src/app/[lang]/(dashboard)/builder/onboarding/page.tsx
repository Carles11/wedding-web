import OnboardingClient from "@/0-pages/(builder)/onboarding/OnboardingClient";
import { fetchBuilderTranslations } from "@/4-shared/api/builder/getTranslations";
import { isValidLanguage } from "@/4-shared/helpers/isValidLanguage";

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: { lang?: string };
}) {
  const params = await searchParams;
  const requested = params?.lang;
  const lang = isValidLanguage(requested) ? requested : "en";
  const translations = await fetchBuilderTranslations(lang, "en");

  return <OnboardingClient translations={translations} />;
}
