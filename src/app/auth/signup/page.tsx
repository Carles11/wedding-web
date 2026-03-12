import SignupForm from "@/2-features/auth/ui/SignupForm";
import { isValidLanguage } from "@/4-shared/helpers/isValidLanguage";
import { fetchGlobalTranslations } from "@/4-shared/lib/globalTranslations";
import type { Metadata } from "next";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}): Promise<Metadata> {
  const params = await searchParams;
  const requested = params?.lang;
  const lang = isValidLanguage(requested) ? requested : "en";
  const translations = await fetchGlobalTranslations(lang, "en");

  return {
    title: translations["auth.signup.page_title"] ?? "Sign Up | WeddWeb",
    description:
      translations["auth.signup.page_description"] ??
      "Create your wedding website account",
  };
}

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const params = await searchParams;
  const requested = params?.lang;
  const lang = isValidLanguage(requested) ? requested : "en";
  const translations = await fetchGlobalTranslations(lang, "en");

  return <SignupForm translations={translations} />;
}
