import LoginForm from "@/2-features/auth/ui/LoginForm";
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
    title: translations["auth.login.page_title"] ?? "Login | WeddWeb",
    description:
      translations["auth.login.page_description"] ??
      "Login to your wedding website dashboard",
  };
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const params = await searchParams;
  const requested = params?.lang;
  const lang = isValidLanguage(requested) ? requested : "en";
  const translations = await fetchGlobalTranslations(lang, "en");

  return (
    <main className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {translations["auth.login.welcome_back"] ?? "Welcome Back"}
          </h1>
        </div>
        <LoginForm translations={translations} />
      </div>
    </main>
  );
}
