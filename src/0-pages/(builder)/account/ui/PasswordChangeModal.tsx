import { useSupabaseAuth } from "@/4-shared/hooks/useSupabaseAuth";
import { notify } from "@/4-shared/lib/toast/toast";
import { isValidPassword, passwordsMatch } from "@/4-shared/utils/validations";
import { useState } from "react";

interface PasswordChangeModalProps {
  open: boolean;
  onClose: () => void;
  translations: Record<string, string>;
}

export function PasswordChangeModal({
  open,
  onClose,
  translations,
}: PasswordChangeModalProps) {
  const { user } = useSupabaseAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

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
      const supabase = (
        await import("@/4-shared/lib/supabase/client")
      ).createClient();
      if (!user?.email) {
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
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (updateError) {
        setError(updateError.message);
        setLoading(false);
        return;
      }
      onClose();
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-xl shadow-lg max-w-sm w-full p-6 space-y-4">
        <h3 className="text-lg font-semibold mb-2">
          {translations["auth.common.change_password_title"] ||
            "Change Password"}
        </h3>
        <div className="space-y-3 mt-4">
          <input
            type="password"
            className="w-full border rounded px-3 py-2"
            placeholder={
              translations["auth.common.current_password"] || "Current password"
            }
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            autoFocus
            disabled={loading}
          />
          <input
            type="password"
            className="w-full border rounded px-3 py-2"
            placeholder={
              translations["auth.common.new_password"] || "New password"
            }
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={loading}
          />
          <input
            type="password"
            className="w-full border rounded px-3 py-2"
            placeholder={
              translations["auth.common.confirm_new_password"] ||
              "Confirm new password"
            }
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
          />
          {error && <div className="text-red-600 text-sm mt-1">{error}</div>}
        </div>
        <div className="flex gap-2 justify-end mt-4">
          <button
            className="px-4 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200"
            onClick={() => {
              onClose();
              setCurrentPassword("");
              setNewPassword("");
              setConfirmPassword("");
              setError("");
            }}
            disabled={loading}
          >
            {translations["auth.common.cancel"] || "Cancel"}
          </button>
          <button
            className="px-4 py-2 rounded bg-(--builder-color-primary) text-white hover:bg-(--builder-color-primary)/90 disabled:opacity-60"
            onClick={handleChangePassword}
            disabled={loading}
          >
            {loading
              ? translations["auth.common.saving"] || "Saving..."
              : translations["auth.common.save"] || "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
