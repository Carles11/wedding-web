import { useSupabaseAuth } from "@/4-shared/hooks/useSupabaseAuth";
import { notify } from "@/4-shared/lib/toast/toast";
import { BuilderButton } from "@/4-shared/ui/builder/BuilderButton";
import { isValidPassword, passwordsMatch } from "@/4-shared/utils/validations";
import { useState } from "react";
import { PasswordChangeModal } from "../PasswordChangeModal";

interface SecurityTabProps {
  translations: Record<string, string>;
  cardClass: string;
}

export function SecurityTab({ translations, cardClass }: SecurityTabProps) {
  const { user } = useSupabaseAuth();
  const [showModal, setShowModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChangePassword = async () => {
    setError("");
    if (!isValidPassword(newPassword)) {
      setError(
        translations["auth.common.password_invalid"] ||
          "Password must be at least 8 characters, include a letter and a number.",
      );
      return;
    }
    if (!passwordsMatch(newPassword, confirmPassword)) {
      setError(
        translations["auth.common.passwords_do_not_match"] ||
          "Passwords do not match.",
      );
      return;
    }
    setLoading(true);
    try {
      // Re-authenticate
      const supabase = (
        await import("@/4-shared/lib/supabase/client")
      ).createClient();
      if (!user?.email) {
        setError("No email found for user.");
        setLoading(false);
        notify.error("No email found for user.");
        return;
      }
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email,
        password: currentPassword,
      });
      if (signInError) {
        setError(
          translations["auth.common.password_incorrect"] ||
            "Current password is incorrect.",
        );
        setLoading(false);
        return;
      }
      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (updateError) {
        setError(updateError.message);
        setLoading(false);
        return;
      }
      setShowModal(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      notify.success(
        translations["auth.common.password_change_success"] ||
          "Password changed successfully.",
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
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
}
