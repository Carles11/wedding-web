import { BuilderButton } from "@/4-shared/ui/builder/BuilderButton";
import { UpgradeCTAModal } from "@/4-shared/ui/builder/UpgradeCTAModal";
import { Toggle } from "@/4-shared/ui/commons/buttons/Toggle";
import { useState } from "react";
import { PasswordChangeModal } from "../PasswordChangeModal";

import { useSite } from "@/4-shared/hooks/useSite";
import { useSupabaseAuth } from "@/4-shared/hooks/useSupabaseAuth";
import { usePlan } from "@/app/providers";

interface SecurityTabProps {
  translations: Record<string, string>;
  cardClass: string;
  router?: any;
}

export const SecurityTab = ({
  translations,
  cardClass,
  router,
}: SecurityTabProps) => {
  const { user } = useSupabaseAuth();
  const { site } = useSite(user ?? null);
  const { planType } = usePlan();
  const userIsPremium = planType === "premium";

  const [showModal, setShowModal] = useState(false);
  const [seoEnabled, setSeoEnabled] = useState(site?.seo_enabled ?? true);
  const [seoLoading, setSeoLoading] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);

  function goToPricing() {
    console.log("site?.default_lang", site?.default_lang);
    // Use language-prefixed routing, not query param
    router.push(`/${site?.default_lang || "en"}/pricing`);
  }

  const handleSeoToggle = async (value: boolean) => {
    if (!userIsPremium) {
      setShowUpgrade(true);
      return;
    }
    if (!site) return;
    setSeoLoading(true);
    setSeoEnabled(value);
    try {
      const { createClient } = await import("@/4-shared/lib/supabase/client");
      const client = createClient();
      await client
        .from("sites")
        .update({ seo_enabled: value })
        .eq("id", site.id);
    } finally {
      setSeoLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className={cardClass}>
        <div className="p-6 border-b border-(--builder-color-border) bg-(--builder-color-muted-surface)/30">
          <h2 className="text-lg font-semibold text-(--builder-color-text)">
            {translations["builder.account.tabs.security.section_security"] ||
              "Security Settings"}
          </h2>
        </div>

        <div className="p-6 space-y-4">
          {/* SEO Visibility Row (Matches Password Row Style) */}
          <div className="flex items-center justify-between p-4 bg-(--builder-color-muted-surface)/20 rounded-lg border border-transparent hover:border-(--builder-color-primary)/10 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <div className="max-w-200px sm:max-w-none">
                <p className="font-medium text-(--builder-color-text)">
                  {translations["builder.domain.seo_visibility_title"] ||
                    "Search Engine Indexing"}
                </p>
                <p className="text-xs text-(--builder-color-text-muted)">
                  {translations["builder.domain.seo_visibility_desc"] ||
                    "Allow Google and other engines to find this site."}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {seoLoading && (
                <span className="text-[10px] uppercase tracking-widest text-gray-400 animate-pulse">
                  Saving...
                </span>
              )}
              <Toggle
                checked={seoEnabled}
                onChange={handleSeoToggle}
                disabled={seoLoading}
                aria-label="Toggle SEO"
              />
              {/* Upgrade Modal for Free Users */}
              <UpgradeCTAModal
                open={showUpgrade}
                onClose={() => setShowUpgrade(false)}
                onUpgrade={goToPricing}
                title={
                  translations["builder.account.upgrade_cta_title"] ||
                  "Upgrade to Premium"
                }
                description={
                  translations["builder.account.upgrade_cta_desc"] ||
                  "SEO visibility is a premium feature. Upgrade to enable search engine indexing."
                }
              />
            </div>
          </div>

          {/* Password Row */}
          <div className="flex items-center justify-between p-4 bg-(--builder-color-muted-surface)/20 rounded-lg border border-transparent hover:border-(--builder-color-primary)/10 transition-colors">
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
                <p className="text-xs text-(--builder-color-text-muted)">
                  Last updated recently
                </p>
              </div>
            </div>
            <BuilderButton
              type="button"
              variant="secondary"
              onClick={() => setShowModal(true)}
              className="px-4! py-2! text-xs!"
            >
              {translations[
                "builder.account.tabs.security.change_password_btn"
              ] || "Change password"}
            </BuilderButton>
          </div>
        </div>
      </div>

      {showModal && (
        <PasswordChangeModal
          open={showModal}
          onClose={() => setShowModal(false)}
          translations={translations}
        />
      )}
    </div>
  );
};
