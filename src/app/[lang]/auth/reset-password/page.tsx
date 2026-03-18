import ResetPasswordForm from "@/2-features/auth/ui/ResetPasswordForm";
import { isValidLanguage } from "@/4-shared/helpers/isValidLanguage";
import { fetchGlobalTranslations } from "@/4-shared/lib/globalTranslations";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const realParams = await params;
  const lang = isValidLanguage(realParams?.lang) ? realParams.lang : "en";
  const translations = await fetchGlobalTranslations(lang, "en");
  return {
    title: translations["auth.reset.page_title"] ?? "Reset Password | WeddWeb",
    description:
      translations["auth.reset.page_description"] ?? "Set your new password",
  };
}

export default async function ResetPasswordPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const realParams = await params;
  const lang = isValidLanguage(realParams?.lang) ? realParams.lang : "en";
  const translations = await fetchGlobalTranslations(lang, "en");
  return <ResetPasswordForm translations={translations} lang={lang} />;
}
