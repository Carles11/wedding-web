import ForgotPasswordForm from "@/2-features/auth/ui/ForgotPasswordForm";
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
    title:
      translations["auth.forgot.page_title"] ?? "Forgot Password | WeddWeb",
    description:
      translations["auth.forgot.page_description"] ?? "Reset your password",
  };
}

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const params = await searchParams;
  const requested = params?.lang;
  const lang = isValidLanguage(requested) ? requested : "en";
  const translations = await fetchGlobalTranslations(lang, "en");

  return <ForgotPasswordForm translations={translations} />;
}
