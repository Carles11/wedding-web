import { isValidLanguage } from "@/4-shared/helpers/isValidLanguage";
import { fetchGlobalTranslations } from "@/4-shared/lib/globalTranslations";
import AuthConfirmClient from "@/app/auth/confirm/AuthConfirmClient";

export default async function AuthConfirmPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const params = await searchParams;
  const requested = params?.lang;
  const lang = isValidLanguage(requested) ? requested : "en";
  const translations = await fetchGlobalTranslations(lang, "en");

  return <AuthConfirmClient translations={translations} />;
}
