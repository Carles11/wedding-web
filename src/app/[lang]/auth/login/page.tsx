import LoginForm from "@/2-features/auth/ui/LoginForm";
import { getSEOMetadata } from "@/4-shared/config/seo";
import { isValidLanguage } from "@/4-shared/helpers/isValidLanguage";
import { fetchGlobalTranslations } from "@/4-shared/lib/globalTranslations";
import { getMetadataBase } from "@/4-shared/lib/seo/getMetadataBase"; // Import Helper
import { Heading } from "@/4-shared/ui/commons/typography/Heading";
import type { Metadata } from "next";
import { headers } from "next/headers";

/**
 * Login Page Metadata
 * SHIELDED: Explicitly tells bots NOT to index this page.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const realParams = await params;
  const lang = isValidLanguage(realParams?.lang) ? realParams.lang : "en";
  const seo = getSEOMetadata(lang, "marketing", "auth-login");

  const host = (await headers()).get("host");
  // Marketing context for the base URL
  const { metadataBase } = getMetadataBase(host, false);

  const ogImage = seo.ogImage || "/assets/og/weddweb-OG.png";

  return {
    metadataBase,
    title: seo.title,
    description: seo.description,
    // THE SHIELD: Preventing "Thin Content" indexing.
    // Adding googleBot ensures standard compliance for AI and Search.
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

export default async function LoginPage({
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
            {translations["auth.login.welcome_back"] ?? "Welcome Back"}
          </Heading>
        </div>
        <LoginForm translations={translations} lang={lang} />
      </div>
    </main>
  );
}
