import { updateAccountInfo } from "@/3-entities/account/api/accountCrud";
import { formatAccountDate } from "@/4-shared/helpers/formatAccountDate";
import { useSupabaseAuth } from "@/4-shared/hooks/useSupabaseAuth";
import { notify } from "@/4-shared/lib/toast/toast";
import { BuilderButton } from "@/4-shared/ui/builder/BuilderButton";
import Heading from "@/4-shared/ui/commons/typography/Heading";
import { useEffect, useState } from "react";
import AccountDangerZone from "../AccountDangerZone";
import EmailChangeInstructionsModal from "../EmailChangeInstructionsModal";

interface ProfileTabProps {
  account: any;
  translations: Record<string, string>;
  editName: string;
  setEditName: (v: string) => void;
  editEmail: string;
  setEditEmail: (v: string) => void;
  inputClass: string;
  labelClass: string;
  cardClass: string;
  saving: boolean;
  deleteConfirm: string;
  setDeleteConfirm: (val: string) => void;
  deleteAcknowledge: boolean;
  setDeleteAcknowledge: (val: boolean) => void;
  handleDelete: () => void;
  onNext?: () => void;
  onBack?: () => void;
  nextLoading?: boolean;
  nextDisabled?: boolean;
  backDisabled?: boolean;
  nextLabel?: string;
  backLabel?: string;
}

export function ProfileTab({
  account,
  translations,
  editName,
  setEditName,
  editEmail,
  setEditEmail,
  inputClass,
  labelClass,
  cardClass,
  saving,
  deleteConfirm,
  setDeleteConfirm,
  nextLoading,
  handleDelete,
  deleteAcknowledge,
  setDeleteAcknowledge,
  onNext,
  onBack,
  nextDisabled,
  backDisabled,
  nextLabel,
  backLabel,
}: ProfileTabProps) {
  const { user, changeEmailWithPassword } = useSupabaseAuth();
  const [password, setPassword] = useState("");
  const [emailChanging, setEmailChanging] = useState(false);
  const [showEmailChangeModal, setShowEmailChangeModal] = useState(false);

  const resolvedNext =
    translations["builder.actions.save"] ||
    translations["builder.actions.next"] ||
    nextLabel ||
    "Next";
  const resolvedBack =
    translations["builder.actions.discard"] ||
    translations["builder.actions.back"] ||
    backLabel ||
    "Back";

  // --- Sync user_profiles.email with Auth user.email after confirmation ---
  // Only run if user is logged in and emails differ
  // Requires updateAccountInfo API
  useEffect(() => {
    if (user && user.email && user.email !== account.email && !emailChanging) {
      // Update user_profiles.email to match Auth user.email
      console.log("Syncing email from Auth to profile:", user.email);
      updateAccountInfo(account.id, { email: user.email }).then((result) => {
        if (result.success) {
          if (!user.email) {
            notify.error("No email found.");
            return;
          }
          setEditEmail(user.email);
          notify.success(
            translations[
              "builder.account.tabs.profile.email_db_sync_success"
            ] || "Email updated in your profile.",
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
      });
    }
    // Only run when user, account, or email changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.email, account.email, account.id]);

  const emailChanged = editEmail !== account.email;

  const handleChangeEmail = async () => {
    setEmailChanging(true);
    try {
      const result = await changeEmailWithPassword(
        account.email,
        editEmail,
        password,
      );
      console.log("Email change result:", result);
      if (result.success) {
        setShowEmailChangeModal(true);
      } else {
        notify.error(result.error?.message || "Email change failed.");
      }
    } catch (err) {
      notify.error(err instanceof Error ? err.message : "Email change failed.");
    } finally {
      setEmailChanging(false);
      setPassword("");
    }
  };

  return (
    <>
      <EmailChangeInstructionsModal
        open={showEmailChangeModal}
        onClose={() => setShowEmailChangeModal(false)}
        translations={translations}
      />
      <div className="space-y-6 animate-fadeIn">
        {/* Editable fields card */}
        <div className={cardClass}>
          <div className="p-6 border-b border-(--builder-color-border) bg-(--builder-color-muted-surface)/30">
            <Heading
              as="h2"
              className="text-lg font-semibold text-(--builder-color-text)"
            >
              {translations["builder.account.tabs.profile.section_profile"] ||
                "Profile Information"}
            </Heading>
            <p className="text-sm text-(--builder-color-text-muted) mt-1">
              {translations["builder.account.tabs.profile.update_info"] ||
                "Update your personal information"}
            </p>
          </div>
          <div className="p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>
                  {translations[
                    "builder.account.tabs.profile.label_full_name"
                  ] || "Full name"}
                </label>
                <div className="relative">
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-(--builder-color-text-muted)"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <input
                    className={`${inputClass} pl-10`}
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder={
                      translations[
                        "builder.account.tabs.profile.placeholder_full_name"
                      ] || "John Doe"
                    }
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>
                  {translations["builder.account.tabs.profile.label_email"] ||
                    "Email"}
                </label>
                <div className="relative">
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-(--builder-color-text-muted)"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <input
                    className={`${inputClass} pl-10`}
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    type="email"
                    placeholder={
                      translations[
                        "builder.account.tabs.profile.placeholder_email"
                      ] || "john@example.com"
                    }
                    disabled={!!user && user.email !== account.email}
                  />
                </div>
                {/* Show password and change button if email changed */}
                {emailChanged && (
                  <div className="mt-3 space-y-2">
                    <input
                      className={inputClass}
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={
                        translations[
                          "builder.account.tabs.profile.password_for_email_change"
                        ] || "Enter your password to confirm email change"
                      }
                    />
                    <button
                      type="button"
                      className="builder-btn builder-btn-primary builder-btn-sm"
                      onClick={handleChangeEmail}
                      disabled={emailChanging || !password || !editEmail}
                    >
                      {emailChanging
                        ? translations[
                            "builder.account.tabs.profile.changing_email"
                          ] || "Changing..."
                        : translations[
                            "builder.account.tabs.profile.change_email_btn"
                          ] || "Change Email"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Read-only metadata card */}
        <div className={cardClass}>
          <div className="p-6 border-b border-(--builder-color-border) bg-(--builder-color-muted-surface)/30">
            <h2 className="text-lg font-semibold text-(--builder-color-text)">
              {translations["builder.account.tabs.profile.section_details"] ||
                "Account Details"}
            </h2>
          </div>
          <div className="p-6">
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-(--builder-color-muted-surface)/20 rounded-lg p-4">
                <dt className="text-xs font-medium text-(--builder-color-text-muted) uppercase tracking-wider mb-1">
                  {translations[
                    "builder.account.tabs.profile.label_member_since"
                  ] || "Member since"}
                </dt>
                <dd className="text-sm font-medium text-(--builder-color-text)">
                  {formatAccountDate(account.created_at)}
                </dd>
              </div>
              <div className="bg-(--builder-color-muted-surface)/20 rounded-lg p-4">
                <dt className="text-xs font-medium text-(--builder-color-text-muted) uppercase tracking-wider mb-1">
                  {translations[
                    "builder.account.tabs.profile.label_updated_at"
                  ] || "Last updated"}
                </dt>
                <dd className="text-sm font-medium text-(--builder-color-text)">
                  {formatAccountDate(account.updated_at)}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
      {/* Danger zone - always visible but styled differently */}
      <AccountDangerZone
        account={account}
        translations={translations}
        saving={saving}
        deleteConfirm={deleteConfirm}
        setDeleteConfirm={setDeleteConfirm}
        deleteAcknowledge={deleteAcknowledge}
        setDeleteAcknowledge={setDeleteAcknowledge}
        handleDelete={handleDelete}
      />
      <div className={`items-center justify-center gap-3 border-t px-6 py-4`}>
        <BuilderButton
          variant="secondary"
          onClick={onBack}
          disabled={backDisabled}
        >
          {resolvedBack}
        </BuilderButton>

        <BuilderButton
          onClick={onNext}
          disabled={nextDisabled}
          loading={nextLoading}
          loadingLabel={translations["builder.actions.saving"] || "Saving..."}
        >
          {resolvedNext}
        </BuilderButton>
      </div>
    </>
  );
}
