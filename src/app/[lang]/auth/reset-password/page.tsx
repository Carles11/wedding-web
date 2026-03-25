import ResetPasswordForm from "@/2-features/auth/ui/ResetPasswordForm";
import { isValidLanguage } from "@/4-shared/helpers/isValidLanguage";
import { fetchGlobalTranslations } from "@/4-shared/lib/globalTranslations";
import type { Metadata } from "next";

/**
 * Reset Password Metadata
 * SHIELDED: Prevents indexing of sensitive utility pages.
 */
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
    // THE SHIELD: Hard-coding no-index for security and crawl budget
    robots: {
      index: false,
      follow: false,
      nocache: true,
    },
    openGraph: {
      title: translations["auth.reset.page_title"] ?? "Reset Password",
      images: [`https://weddweb.com/assets/og/weddweb-OG.png`],
    },
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

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-4">
        <ResetPasswordForm translations={translations} lang={lang} />
      </div>
    </main>
  );
}
