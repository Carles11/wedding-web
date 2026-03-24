import SignupForm from "@/2-features/auth/ui/SignupForm";
import { isValidLanguage } from "@/4-shared/helpers/isValidLanguage";
import { fetchGlobalTranslations } from "@/4-shared/lib/globalTranslations";
import { Heading } from "@/4-shared/ui/commons/typography/Heading";

import { getSEOMetadata } from "@/4-shared/config/seo";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const realParams = await params;
  const lang = isValidLanguage(realParams?.lang) ? realParams.lang : "en";
  const seo = getSEOMetadata(lang, "marketing", "auth-signup");
  return {
    title: seo.title,
    description: seo.description,
    openGraph: {
      title: seo.ogTitle,
      description: seo.ogDescription,
      images: seo.ogImage ? [seo.ogImage] : [],
    },
    twitter: {
      card: seo.twitterCard || "summary_large_image",
    },
    robots: { index: true, follow: true },
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
    <main className="min-h-screen flex items-center justify-center ">
      <div className="w-full max-w-[80%]">
        <div className="text-center mt-8">
          <Heading as="h1">
            {translations["auth.signup.welcome"] ?? "Welcome"}
          </Heading>
        </div>
        <SignupForm translations={translations} lang={lang} />{" "}
      </div>
    </main>
  );
}
