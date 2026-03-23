import { notify } from "@/4-shared/lib/toast/toast";
import { BuilderButton } from "@/4-shared/ui/builder/BuilderButton";

interface SecurityTabProps {
  translations: Record<string, string>;
  cardClass: string;
}

export function SecurityTab({ translations, cardClass }: SecurityTabProps) {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className={cardClass}>
        <div className="p-6 border-b border-(--builder-color-border) bg-(--builder-color-muted-surface)/30">
          <h2 className="text-lg font-semibold text-(--builder-color-text)">
            {translations["builder.account.tabs.security.section_security"] ||
              "Security Settings"}
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
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <div>
                <p className="font-medium text-(--builder-color-text)">
                  {translations[
                    "builder.account.tabs.security.password_label"
                  ] || "Password"}
                </p>
                <p className="text-xs text-(--builder-color-text-muted) mt-0.5">
                  {translations[
                    "builder.account.tabs.security.password_hint"
                  ] || "Last changed: 30 days ago"}
                </p>
              </div>
            </div>
            <BuilderButton
              type="button"
              variant="secondary"
              onClick={() => {
                notify.info(
                  translations[
                    "builder.account.tabs.security.password_coming_soon"
                  ] || "Password change feature coming soon!",
                );
              }}
              className="px-4! py-2!"
            >
              {translations[
                "builder.account.tabs.security.change_password_btn"
              ] || "Change password"}
            </BuilderButton>
          </div>
        </div>
      </div>
    </div>
  );
}
