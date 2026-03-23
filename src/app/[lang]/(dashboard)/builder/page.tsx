"use server";

import BuilderClient from "@/0-pages/(builder)/BuilderClient";
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

  // Check if user has completed onboarding
  const user = await getCurrentUser();
  if (user) {
    const supabase = await createSupabaseSSRClient();
    const { data: userProfile } = await supabase
      .from("user_profiles")
      .select("onboarding_completed")
      .eq("id", user.id)
      .maybeSingle();

    if (userProfile && userProfile.onboarding_completed === false) {
      redirect(`/${lang}/builder/onboarding`);
    }
  }

  const supabase = await createSupabaseSSRClient();
  const translations = await fetchBuilderTranslations(supabase, lang, "en");

  return (
    <div className="min-h-screen bg-gray-50">
      <BuilderClient initialLang={lang} translations={translations} />
    </div>
  );
}
