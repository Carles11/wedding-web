"use server";

import BuilderClient from "@/0-pages/(builder)/BuilderClient";
import { getAccountInfo } from "@/3-entities/account/api/getAccountInfo";
import { getCurrentUser } from "@/3-entities/user/api/getCurrentUser";
import { fetchBuilderTranslations } from "@/4-shared/api/builder/getTranslations";
import { isValidLanguage } from "@/4-shared/helpers/isValidLanguage";
import { createSupabaseSSRClient } from "@/4-shared/lib/supabase/server";
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
  const user = await getCurrentUser();

  let userProfile: any = null;
  let userId: string | null = null;
  if (user) {
    userId = user.id;
    const { data } = await supabase
      .from("user_profiles")
      .select(
        "onboarding_completed, cookie_consent, cookie_consent_at, cookie_consent_version",
      )
      .eq("id", user.id)
      .maybeSingle();
    userProfile = data;
    if (userProfile && userProfile.onboarding_completed === false) {
      redirect(`/${lang}/builder/onboarding`);
    }
  }

  const translations = await fetchBuilderTranslations(supabase, lang, "en");

  return (
    <div className="min-h-screen bg-gray-50">
      <BuilderClient
        initialLang={lang}
        translations={translations}
        userId={userId}
        userProfile={userProfile}
        account={account}
      />
    </div>
  );
}
