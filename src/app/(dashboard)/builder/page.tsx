// Remove ALL fetching/redirecting for user here!
import BuilderClient from "@/0-pages/(builder)/BuilderClient";
import { getCurrentUser } from "@/3-entities/user/api/getCurrentUser";
import { fetchBuilderTranslations } from "@/4-shared/api/builder/getTranslations";
import { isValidLanguage } from "@/4-shared/helpers/isValidLanguage";
import { supabaseAdmin } from "@/4-shared/lib/supabase/supabaseServer";
import { redirect } from "next/navigation";

export default async function BuilderPage({
  searchParams,
}: {
  searchParams: { lang?: string };
}) {
  // Check if user has completed onboarding
  const user = await getCurrentUser();
  if (user) {
    const { data: userProfile } = await supabaseAdmin
      .from("user_profiles")
      .select("onboarding_completed")
      .eq("id", user.id)
      .maybeSingle();

    if (userProfile && userProfile.onboarding_completed === false) {
      redirect("/builder/onboarding");
    }
  }

  const params = await searchParams;
  const requested = params?.lang;
  const lang = isValidLanguage(requested) ? requested : "en";
  const translations = await fetchBuilderTranslations(lang, "en");

  return (
    <div className="min-h-screen bg-gray-50">
      <BuilderClient initialLang={lang} translations={translations} />
    </div>
  );
}
