import SignupForm from "@/2-features/auth/ui/SignupForm";
import { getSEOMetadata } from "@/4-shared/config/seo";
import { isValidLanguage } from "@/4-shared/helpers/isValidLanguage";
import { fetchGlobalTranslations } from "@/4-shared/lib/globalTranslations";
import { getMetadataBase } from "@/4-shared/lib/seo/getMetadataBase"; // Import Helper
import { Heading } from "@/4-shared/ui/commons/typography/Heading";
import type { Metadata } from "next";
import { headers } from "next/headers";

/**
 * Signup Page Metadata
 * SHIELDED: Prevents "Thin Content" indexing to protect Crawl Budget.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const realParams = await params;
  const lang = isValidLanguage(realParams?.lang) ? realParams.lang : "en";
  const seo = getSEOMetadata(lang, "marketing", "auth-signup");

  const host = (await headers()).get("host");
  // Marketing context
  const { metadataBase } = getMetadataBase(host, false);

  const ogImage = seo.ogImage || "/assets/og/weddweb-OG.png";

  return {
    metadataBase,
    title: seo.title,
    description: seo.description,
    // THE SHIELD: Hard signal to bots to stay away
    // Standardizing with googleBot for maximum SEO health.
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
      title: seo.ogTitle || seo.title,
      description: seo.ogDescription || seo.description,
      images: [ogImage],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      images: [ogImage],
    },
  };
}

export default async function SignupPage({
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
        <div className="text-center mt-8">
          <Heading as="h1">
            {translations["auth.signup.welcome"] ?? "Welcome"}
          </Heading>
        </div>
        <SignupForm translations={translations} lang={lang} />
      </div>
    </main>
  );
}
