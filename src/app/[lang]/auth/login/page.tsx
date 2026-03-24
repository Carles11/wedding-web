import LoginForm from "@/2-features/auth/ui/LoginForm";
import { getSEOMetadata } from "@/4-shared/config/seo";
import { isValidLanguage } from "@/4-shared/helpers/isValidLanguage";
import { fetchGlobalTranslations } from "@/4-shared/lib/globalTranslations";
import { Heading } from "@/4-shared/ui/commons/typography/Heading";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const realParams = await params;
  const lang = isValidLanguage(realParams?.lang) ? realParams.lang : "en";
  const seo = getSEOMetadata(lang, "marketing", "auth-login");
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

export default async function LoginPage({
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
        <div className="text-center mt-8">
          <Heading as="h1">
            {translations["auth.login.welcome_back"] ?? "Welcome Back"}
          </Heading>
        </div>
        {/* Removed duplicate LoginForm without lang prop */}
        <LoginForm translations={translations} lang={lang} />
      </div>
    </main>
  );
}
