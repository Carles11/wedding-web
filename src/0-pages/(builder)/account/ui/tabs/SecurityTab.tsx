import { BuilderButton } from "@/4-shared/ui/builder/BuilderButton";
import { Toggle } from "@/4-shared/ui/commons/buttons/Toggle";
import { useState } from "react";
import { PasswordChangeModal } from "../PasswordChangeModal";

import { useSite } from "@/4-shared/hooks/useSite";
import { useSupabaseAuth } from "@/4-shared/hooks/useSupabaseAuth";
import type { Site } from "@/4-shared/types";

interface SecurityTabProps {
  translations: Record<string, string>;
  cardClass: string;
  site?: Site;
}

export const SecurityTab = ({ translations, cardClass }: SecurityTabProps) => {
  const { user } = useSupabaseAuth();
  const { site } = useSite(user ?? null);

  const [showModal, setShowModal] = useState(false);
  // SEO toggle state
  const [seoEnabled, setSeoEnabled] = useState(site?.seo_enabled ?? true);
  const [seoLoading, setSeoLoading] = useState(false);

  const handleSeoToggle = async (value: boolean) => {
    if (!site) return;
    setSeoLoading(true);
    setSeoEnabled(value);
    try {
      const supabase = await import("@/4-shared/lib/supabase/client");
      const client = supabase.createClient();
      const { error } = await client
        .from("sites")
        .update({ seo_enabled: value })
        .eq("id", site.id);
      // Optionally, you could refetch site info here if needed
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
        <div className="p-6 space-y-6">
          {/* SEO Visibility Switcher */}
          <div className="mb-4 flex items-center gap-4">
            <Toggle
              checked={seoEnabled}
              onChange={handleSeoToggle}
              label={`SEO: ${translations["builder.domain.seo_visibility_label"] || "SEO: Allow search engines to index this site"}`}
              disabled={seoLoading}
            />
            {seoLoading && (
              <span className="text-xs text-gray-500">Saving...</span>
            )}
          </div>
          {/* Password section */}
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
              </div>
            </div>
            <BuilderButton
              type="button"
              variant="secondary"
              onClick={() => setShowModal(true)}
              className="px-4! py-2!"
            >
              {translations[
                "builder.account.tabs.security.change_password_btn"
              ] || "Change password"}
            </BuilderButton>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
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
