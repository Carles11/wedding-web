import { SUPPORTED_LANGUAGE_LABELS } from "@/4-shared/config/i18n";
import { notify } from "@/4-shared/lib/toast/toast";
import { BuilderButton } from "@/4-shared/ui/builder/BuilderButton";

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
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className={cardClass}>
        <div className="p-6 border-b border-(--builder-color-border) bg-(--builder-color-muted-surface)/30">
          <h2 className="text-lg font-semibold text-(--builder-color-text)">
            {translations[
              "builder.account.tabs.preferences.section_language_region"
            ] || "Language & Region"}
          </h2>
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
                <p className="text-sm text-(--builder-color-primary) mt-0.5 font-medium">
                  {account.preferred_language
                    ? SUPPORTED_LANGUAGE_LABELS[
                        account.preferred_language as keyof typeof SUPPORTED_LANGUAGE_LABELS
                      ]
                    : SUPPORTED_LANGUAGE_LABELS["en"]}
                </p>
              </div>
            </div>
            <BuilderButton
              type="button"
              variant="secondary"
              onClick={() =>
                notify.info(
                  translations[
                    "builder.account.tabs.preferences.language_coming_soon"
                  ] || "Language preferences coming soon!",
                )
              }
              className="px-4! py-2!"
            >
              {translations["builder.account.tabs.preferences.change_btn"] ||
                "Change"}
            </BuilderButton>
          </div>
        </div>
      </div>
    </div>
  );
}
