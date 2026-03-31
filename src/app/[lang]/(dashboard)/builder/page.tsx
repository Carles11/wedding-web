"use server";

import BuilderClient from "@/0-pages/(builder)/BuilderClient";
import { getAccountInfo } from "@/3-entities/account/api/getAccountInfo";
import { fetchBuilderTranslations } from "@/4-shared/api/builder/getTranslations";
import { isValidLanguage } from "@/4-shared/helpers/isValidLanguage";
import { createSupabaseSSRClient } from "@/4-shared/lib/supabase/server";
import { AccountInfo } from "@/4-shared/types";
import { redirect } from "next/navigation";

export default async function BuilderPage({
  params,
}: {
  params?: Promise<{ lang?: string }>;
}) {
  // Use the [lang] path segment for language
  const resolvedParams = params ? await params : { lang: "en" };
  const langFromPath = resolvedParams.lang ?? "en";
  const lang = isValidLanguage(langFromPath) ? langFromPath : "en";
  const account = await getAccountInfo();

  const supabase = await createSupabaseSSRClient();

  // Check if user has completed onboarding
  const userProfile: AccountInfo | null = await getAccountInfo();
  const translations = await fetchBuilderTranslations(supabase, lang, "en");

  if (userProfile && userProfile.onboarding_completed === false) {
    redirect(`/${lang}/builder/onboarding`);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <BuilderClient
        initialLang={lang}
        translations={translations}
        userId={userProfile?.id ?? null}
        userProfile={userProfile}
        account={account}
      />
    </div>
  );
}
