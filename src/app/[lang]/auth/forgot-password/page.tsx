import ForgotPasswordForm from "@/2-features/auth/ui/ForgotPasswordForm";
import { isValidLanguage } from "@/4-shared/helpers/isValidLanguage";
import { fetchGlobalTranslations } from "@/4-shared/lib/globalTranslations";
import { getMetadataBase } from "@/4-shared/lib/seo/getMetadataBase"; // Import Helper
import type { Metadata } from "next";
import { headers } from "next/headers";

/**
 * Forgot Password Metadata
 * SHIELDED: Protects crawl budget and prevents indexing of utility forms.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const realParams = await params;
  const lang = isValidLanguage(realParams?.lang) ? realParams.lang : "en";
  const translations = await fetchGlobalTranslations(lang, "en");

  const host = (await headers()).get("host");
  // Main app context
  const { metadataBase } = getMetadataBase(host, false);

  const ogImage = "/assets/og/weddweb-OG.png";

  return {
    metadataBase,
    title:
      translations["auth.forgot.page_title"] ?? "Forgot Password | WeddWeb",
    description:
      translations["auth.forgot.page_description"] ?? "Reset your password",
    // THE SHIELD: Hard-coding no-index to keep utility pages out of SERPs
    // Also added googleBot for consistent protection across all shielded pages.
    robots: {
      index: false,
      follow: false,
      nocache: true,
      googleBot: {
        index: false,
        follow: false,
      },
    },
    openGraph: {
      title: translations["auth.forgot.page_title"] ?? "Forgot Password",
      description:
        translations["auth.forgot.page_description"] ?? "Reset your password",
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      images: [ogImage],
    },
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
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <ForgotPasswordForm translations={translations} lang={lang} />
      </div>
    </main>
  );
}
