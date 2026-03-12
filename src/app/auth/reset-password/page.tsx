import ResetPasswordForm from "@/2-features/auth/ui/ResetPasswordForm";
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
    title: translations["auth.reset.page_title"] ?? "Reset Password | WeddWeb",
    description:
      translations["auth.reset.page_description"] ?? "Set your new password",
  };
}

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const params = await searchParams;
  const requested = params?.lang;
  const lang = isValidLanguage(requested) ? requested : "en";
  const translations = await fetchGlobalTranslations(lang, "en");

  return <ResetPasswordForm translations={translations} />;
}
