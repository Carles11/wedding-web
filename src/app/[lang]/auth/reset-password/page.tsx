import ResetPasswordForm from "@/2-features/auth/ui/ResetPasswordForm";
import { isValidLanguage } from "@/4-shared/helpers/isValidLanguage";
import { fetchGlobalTranslations } from "@/4-shared/lib/globalTranslations";
import { getMetadataBase } from "@/4-shared/lib/seo/getMetadataBase"; // Import Helper
import type { Metadata } from "next";
import { headers } from "next/headers";

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

  const host = (await headers()).get("host");
  // Main app context for the base URL logic
  const { metadataBase } = getMetadataBase(host, false);

  const ogImage = "/assets/og/weddweb-OG.png";

  return {
    metadataBase,
    title: translations["auth.reset.page_title"] ?? "Reset Password | WeddWeb",
    description:
      translations["auth.reset.page_description"] ?? "Set your new password",
    // THE SHIELD: Hard-coding no-index for security and crawl budget
    // Standardizing robots with googleBot for the Best SEO Ever.
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
      title: translations["auth.reset.page_title"] ?? "Reset Password",
      description:
        translations["auth.reset.page_description"] ?? "Set your new password",
      images: [ogImage],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      images: [ogImage],
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
    <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md p-4">
        <ResetPasswordForm translations={translations} lang={lang} />
      </div>
    </main>
  );
}
