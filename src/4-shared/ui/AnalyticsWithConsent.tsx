// 4-shared/ui/AnalyticsWithConsent.tsx
import { getAccountInfo } from "@/3-entities/account/api/getAccountInfo";
import { fetchMarketingTranslations } from "../api/marketing";
import { SupportedLanguage } from "../config/i18n";
import { AnalyticsConsentClient } from "./AnalyticsConsentClient"; // We will create this

export async function AnalyticsWithConsent({ lang }: { lang: string }) {
  // Fetch everything on the server
  const userProfile = await getAccountInfo();
  const translations = await fetchMarketingTranslations(
    lang as SupportedLanguage,
    "en",
  );

  console.log("AnalyticsWithConsent props:", {
    lang,
    userProfile,
    translations,
  });

  return (
    <AnalyticsConsentClient
      lang={lang}
      userProfile={userProfile}
      translations={translations}
    />
  );
}
