import { updateAccountInfo } from "@/3-entities/account/api/accountCrud";
import type { SupportedLanguage } from "@/4-shared/config/i18n";
import { useSupabaseAuth } from "@/4-shared/hooks/useSupabaseAuth";
import { notify } from "@/4-shared/lib/toast/toast";
import LanguageSelector from "@/4-shared/ui/builder/LanguageSelector";
import Heading from "@/4-shared/ui/commons/typography/Heading";
import { useState } from "react";

interface PreferencesTabProps {
  account: any;
  translations: Record<string, string>;
  cardClass: string;
}

export function PreferencesTab({
  account,
  translations,
  cardClass,
}: PreferencesTabProps) {
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>(
    (account.preferred_language as SupportedLanguage) || "en",
  );
  const [loading, setLoading] = useState(false);
  const { user } = useSupabaseAuth();

  const handleLanguageChange = async (lang: string) => {
    if (lang === currentLang) return;
    if (!user) {
      return;
    }
    setLoading(true);

    const result = await updateAccountInfo(user.id, {
      preferred_language: lang,
    });
    setLoading(false);
    if (result.success) {
      setCurrentLang(lang as SupportedLanguage);
      notify.success(
        translations[
          "builder.account.tabs.preferences.language_changed_success"
        ] || "Preferred language updated!",
      );
    } else {
      const errorMsg =
        typeof result.error === "string"
          ? result.error
          : result.error && "message" in result.error
            ? result.error.message
            : "Failed to update language.";
      notify.error(errorMsg);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className={cardClass}>
        <div className="p-6 border-b border-(--builder-color-border) bg-(--builder-color-muted-surface)/30">
          <Heading
            as="h2"
            className="text-lg font-semibold text-(--builder-color-text)"
          >
            {translations[
              "builder.account.tabs.preferences.section_language_region"
            ] || "Language & Region"}
          </Heading>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between p-4 bg-(--builder-color-muted-surface)/20 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-(--builder-color-primary)/10 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-(--builder-color-primary)"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                  />
                </svg>
              </div>
              <div>
                <p className="font-medium text-(--builder-color-text)">
                  {translations[
                    "builder.account.tabs.preferences.label_preferred_language"
                  ] || "Preferred Language"}
                </p>
              </div>
            </div>
            <div>
              <LanguageSelector
                currentLang={currentLang}
                onLanguageChange={handleLanguageChange}
                label={
                  translations["builder.account.tabs.preferences.change_btn"] ||
                  "Change"
                }
                preferencesTab={true}
              />
              {loading && (
                <span className="ml-2 text-xs text-gray-400">Saving...</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
