import CheckoutClient from "@/0-pages/(builder)/checkout/CheckoutClient";
import { fetchBuilderTranslations } from "@/4-shared/api/builder/getTranslations";
import { isValidLanguage } from "@/4-shared/helpers/isValidLanguage";
import { createSupabaseSSRClient } from "@/4-shared/lib/supabase/server";

type CheckoutPageProps = {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function CheckoutPage({
  params,
  searchParams,
}: CheckoutPageProps) {
  // Next.js 15 requires awaiting both params and searchParams
  const { lang: langParam } = await params;
  const resolvedSearchParams = await searchParams;

  const plan = resolvedSearchParams.plan as string | undefined;
  const success = resolvedSearchParams.success === "true";
  const sessionId = resolvedSearchParams.session_id as string | undefined;

  const lang = isValidLanguage(langParam) ? langParam : "en";
  const supabase = await createSupabaseSSRClient();
  const translations = await fetchBuilderTranslations(supabase, lang, "en");

  return (
    <CheckoutClient
      t={translations}
      lang={lang}
      initialPlan={plan}
      isSuccess={success}
      sessionId={sessionId}
    />
  );
}
