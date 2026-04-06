"use server";

import BuilderClient from "@/0-pages/(builder)/BuilderClient";
import { getAccountInfo } from "@/3-entities/account/api/getAccountInfo";
import { fetchBuilderTranslations } from "@/4-shared/api/builder/getTranslations";
import { isValidLanguage } from "@/4-shared/helpers/isValidLanguage";
import { t } from "@/4-shared/helpers/t";
import { createSupabaseSSRClient } from "@/4-shared/lib/supabase/server";
import { AccountInfo } from "@/4-shared/types";
import { CustomLoader } from "@/4-shared/ui/commons/loader/CustomLoader";
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

  const supabase = await createSupabaseSSRClient();

  // Check if user has completed onboarding
  const userProfile: AccountInfo | null = await getAccountInfo();
  const translations = await fetchBuilderTranslations(supabase, lang, "en");

  if (!userProfile) {
    return (
      <CustomLoader
        message={t(
          translations,
          "checkout.status.wait",
          "Please wait, this may take a moment.",
        )}
      />
    );
  }

  if (userProfile && userProfile.onboarding_completed === false) {
    redirect(`/${lang}/builder/onboarding`);
  }

  const lastActivity = new Date(userProfile?.last_activity_at || Date.now());
  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - 6);

  const isLegacy = userProfile?.plan_type === "free" && lastActivity < cutoff;

  return (
    <div className="min-h-screen bg-gray-50">
      <BuilderClient
        initialLang={lang}
        translations={translations}
        userId={userProfile?.id ?? null}
        userProfile={userProfile}
        account={userProfile}
        isLegacyMode={isLegacy}
      />
    </div>
  );
}
