// 4-shared/ui/AnalyticsWithConsent.tsx
import { getAccountInfo } from "@/3-entities/account/api/getAccountInfo";
import { fetchMarketingTranslations } from "../api/marketing";
import { SupportedLanguage } from "../config/i18n";
import { AnalyticsConsentClient } from "./AnalyticsConsentClient";

export async function AnalyticsWithConsent({ lang }: { lang: string }) {
  // Fetch data on the server
  const userProfile = await getAccountInfo();
  const translations = await fetchMarketingTranslations(
    lang as SupportedLanguage,
    "en",
  );

  // Pass it down to the Client Component
  return (
    <AnalyticsConsentClient
      lang={lang}
      userProfile={userProfile}
      translations={translations}
    />
  );
}
