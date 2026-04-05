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
  console.log("--- 🕵️ BUILDER DEBUG ---");
  console.log("Account ID:", account?.id);
  console.log("Plan:", account?.plan_type);
  console.log("Last Activity Raw:", account?.last_activity_at);
  const supabase = await createSupabaseSSRClient();

  // Check if user has completed onboarding
  const userProfile: AccountInfo | null = await getAccountInfo();
  const translations = await fetchBuilderTranslations(supabase, lang, "en");

  if (userProfile && userProfile.onboarding_completed === false) {
    redirect(`/${lang}/builder/onboarding`);
  }

  const planType = account?.plan_type || "free";
  const lastActivity = new Date(account?.last_activity_at || Date.now());
  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - 6);

  const isLegacy = account?.plan_type === "free" && lastActivity < cutoff;

  console.log("Is Legacy Calculation:", isLegacy);
  console.log("-----------------------");
  return (
    <div className="min-h-screen bg-gray-50">
      <BuilderClient
        initialLang={lang}
        translations={translations}
        userId={userProfile?.id ?? null}
        userProfile={userProfile}
        account={account}
        isLegacyMode={isLegacy}
      />
    </div>
  );
}
