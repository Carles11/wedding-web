import ForgotPasswordForm from "@/2-features/auth/ui/ForgotPasswordForm";
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
    title:
      translations["auth.forgot.page_title"] ?? "Forgot Password | WeddWeb",
    description:
      translations["auth.forgot.page_description"] ?? "Reset your password",
  };
}

export default async function ForgotPasswordPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const realParams = await params;
  const lang = isValidLanguage(realParams?.lang) ? realParams.lang : "en";
  const translations = await fetchGlobalTranslations(lang, "en");
  return (
    <main className="min-h-screen flex items-center justify-center ">
      <div className="w-full max-w-md">
        <ForgotPasswordForm translations={translations} lang={lang} />
      </div>
    </main>
  );
}
