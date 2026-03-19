"use client";

import { StepLayout } from "@/1-widgets/builder/step-layout/ui/StepLayout";
import {
  deleteAccount,
  updateAccountInfo,
} from "@/3-entities/account/api/accountCrud";
import { notify } from "@/4-shared/lib/toast/toast";
import { BuilderButton } from "@/4-shared/ui/builder/BuilderButton";
import { useState } from "react";

interface Props {
  account: any;
  translations: Record<string, string>;
}

export default function AccountPage({ account, translations }: Props) {
  if (!account) {
    return (
      <div className="text-(--builder-color-danger) p-8 text-center">
        {translations["account.error_not_found"] || "Account not found."}
      </div>
    );
  }

  const [editName, setEditName] = useState(account.full_name || "");
  const [editEmail, setEditEmail] = useState(account.email);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [activeTab, setActiveTab] = useState<
    "profile" | "security" | "preferences"
  >("profile");

  const handleSave = async () => {
    setSaving(true);
    try {
      const result = await updateAccountInfo(account.id, {
        full_name: editName,
        email: editEmail,
      });
      if (result.success) {
        notify.success(
          translations["account.save_success"] || "Changes saved successfully!",
        );
      } else {
        notify.error(result.error?.message || "Update failed.");
      }
    } catch (err) {
      notify.error(
        err instanceof Error
          ? err.message
          : translations["error.something_went_wrong"] ||
              "Something went wrong.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (deleteConfirm !== account.email) {
      notify.error(
        translations["account.delete_confirm_error"] ||
          "Please type your email to confirm deletion.",
      );
      return;
    }
    setSaving(true);
    try {
      const result = await deleteAccount(account.id);
      if (result.success) {
        notify.success(
          translations["account.delete_success"] ||
            "Account deleted successfully.",
        );
      } else {
        notify.error(result.error?.message || "Delete failed.");
      }
    } catch (err) {
      notify.error(
        err instanceof Error
          ? err.message
          : translations["error.something_went_wrong"] ||
              "Something went wrong.",
      );
    } finally {
      setSaving(false);
    }
  };

  const initials = account.full_name
    ? account.full_name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : account.email.substring(0, 2).toUpperCase();

  const inputClass =
    "mt-1 block w-full rounded-lg border border-(--builder-color-border) bg-(--builder-color-surface) px-4 py-2.5 text-sm text-(--builder-color-text) placeholder:text-(--builder-color-text-muted) focus:outline-none focus:ring-2 focus:ring-(--builder-color-primary)/20 focus:border-(--builder-color-primary) transition-all duration-200";

  const labelClass =
    "block text-sm font-medium text-(--builder-color-text-muted) mb-1.5";

  const cardClass =
    "rounded-xl border border-(--builder-color-border) bg-(--builder-color-surface) overflow-hidden transition-all duration-200 hover:shadow-lg";

  const tabClass = (tab: string) => `
    px-4 py-2.5 text-sm font-medium transition-all duration-200 relative
    ${
      activeTab === tab
        ? "text-(--builder-color-primary) after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-(--builder-color-primary) after:rounded-t-full"
        : "text-(--builder-color-text-muted) hover:text-(--builder-color-text)"
    }
  `;

  return (
    <StepLayout
      nextLabel={translations["account.save_btn"] || "Save changes"}
      backLabel={translations["account.cancel_btn"] || "Cancel"}
      onNext={handleSave}
      nextDisabled={saving}
      nextLoading={saving}
      translations={translations}
      onBack={() => {}}
    >
      <div className="max-w-4xl mx-auto space-y-6 px-4 py-6">
        {/* Header with gradient */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-(--builder-color-primary)/5 to-transparent rounded-2xl" />
          <div className="relative flex items-center gap-4 p-6">
            <div className="relative">
              {account.avatar_url ? (
                <img
                  src={account.avatar_url}
                  alt="avatar"
                  className="w-20 h-20 rounded-2xl object-cover ring-4 ring-(--builder-color-primary)/10"
                />
              ) : (
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-semibold ring-4 ring-(--builder-color-primary)/10"
                  style={{
                    background: `linear-gradient(135deg, var(--builder-color-primary) 0%, var(--builder-color-primary)/80 100%)`,
                    color: "white",
                  }}
                >
                  {initials}
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full ring-4 ring-(--builder-color-surface)" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-(--builder-color-text) truncate">
                {account.full_name || "Welcome back!"}
              </h1>
              <p className="text-(--builder-color-text-muted) flex items-center gap-2 mt-1">
                <svg
                  className="w-4 h-4"
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
                {account.email}
              </p>
            </div>
            <div className="flex gap-2">
              <span
                className="px-3 py-1.5 text-xs font-medium rounded-full"
                style={{
                  background: "rgba(79,70,229,0.08)",
                  color: "var(--builder-color-primary)",
                }}
              >
                {account.preferred_language?.toUpperCase() || "EN"}
              </span>
              {account.onboarding_completed && (
                <span className="px-3 py-1.5 text-xs font-medium rounded-full bg-green-100 text-green-700">
                  Onboarded
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Modern tabs navigation */}
        <div className="border-b border-(--builder-color-border) flex gap-6">
          <button
            className={tabClass("profile")}
            onClick={() => setActiveTab("profile")}
          >
            Profile Information
          </button>
          <button
            className={tabClass("security")}
            onClick={() => setActiveTab("security")}
          >
            Security
          </button>
          <button
            className={tabClass("preferences")}
            onClick={() => setActiveTab("preferences")}
          >
            Preferences
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="space-y-6 animate-fadeIn">
            {/* Editable fields card */}
            <div className={cardClass}>
              <div className="p-6 border-b border-(--builder-color-border) bg-(--builder-color-muted-surface)/30">
                <h2 className="text-lg font-semibold text-(--builder-color-text)">
                  {translations["account.section.profile"] ||
                    "Profile Information"}
                </h2>
                <p className="text-sm text-(--builder-color-text-muted) mt-1">
                  Update your personal information
                </p>
              </div>
              <div className="p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>
                      {translations["account.label.full_name"] || "Full name"}
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
                        placeholder="John Doe"
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>
                      {translations["account.label.email"] || "Email"}
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
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Read-only metadata card */}
            <div className={cardClass}>
              <div className="p-6 border-b border-(--builder-color-border) bg-(--builder-color-muted-surface)/30">
                <h2 className="text-lg font-semibold text-(--builder-color-text)">
                  {translations["account.section.details"] || "Account Details"}
                </h2>
              </div>
              <div className="p-6">
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-(--builder-color-muted-surface)/20 rounded-lg p-4">
                    <dt className="text-xs font-medium text-(--builder-color-text-muted) uppercase tracking-wider mb-1">
                      {translations["account.label.member_since"] ||
                        "Member since"}
                    </dt>
                    <dd className="text-sm font-medium text-(--builder-color-text)">
                      {new Date(account.created_at).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        },
                      )}
                    </dd>
                  </div>
                  <div className="bg-(--builder-color-muted-surface)/20 rounded-lg p-4">
                    <dt className="text-xs font-medium text-(--builder-color-text-muted) uppercase tracking-wider mb-1">
                      {translations["account.label.updated_at"] ||
                        "Last updated"}
                    </dt>
                    <dd className="text-sm font-medium text-(--builder-color-text)">
                      {new Date(account.updated_at).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        },
                      )}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === "security" && (
          <div className="space-y-6 animate-fadeIn">
            <div className={cardClass}>
              <div className="p-6 border-b border-(--builder-color-border) bg-(--builder-color-muted-surface)/30">
                <h2 className="text-lg font-semibold text-(--builder-color-text)">
                  {translations["account.section.security"] ||
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
                        {translations["account.password_label"] || "Password"}
                      </p>
                      <p className="text-xs text-(--builder-color-text-muted) mt-0.5">
                        {translations["account.password_hint"] ||
                          "Last changed: 30 days ago"}
                      </p>
                    </div>
                  </div>
                  <BuilderButton
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      notify.info("Password change feature coming soon!");
                    }}
                    className="!px-4 !py-2"
                  >
                    Change password
                  </BuilderButton>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Preferences Tab */}
        {activeTab === "preferences" && (
          <div className="space-y-6 animate-fadeIn">
            <div className={cardClass}>
              <div className="p-6 border-b border-(--builder-color-border) bg-(--builder-color-muted-surface)/30">
                <h2 className="text-lg font-semibold text-(--builder-color-text)">
                  Language & Region
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
                        {translations["account.label.preferred_language"] ||
                          "Preferred Language"}
                      </p>
                      <p className="text-sm text-(--builder-color-primary) mt-0.5 font-medium">
                        {account.preferred_language?.toUpperCase() || "ENGLISH"}
                      </p>
                    </div>
                  </div>
                  <BuilderButton
                    type="button"
                    variant="secondary"
                    onClick={() =>
                      notify.info("Language preferences coming soon!")
                    }
                    className="!px-4 !py-2"
                  >
                    Change
                  </BuilderButton>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Danger zone - always visible but styled differently */}
        <div
          className="rounded-xl border p-6 space-y-4 transition-all duration-200"
          style={{
            borderColor: "var(--builder-color-danger-border)",
            background:
              "linear-gradient(to right, var(--builder-color-danger-hover-bg), transparent)",
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-(--builder-color-danger)/10 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-(--builder-color-danger)"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-(--builder-color-danger)">
                {translations["account.danger_zone_title"] || "Delete Account"}
              </h3>
              <p className="text-sm text-(--builder-color-danger) mt-1 opacity-80">
                {translations["account.delete_warning"] ||
                  "Once you delete your account, there is no going back. Please be certain."}
              </p>
            </div>
          </div>

          <div className="pl-13">
            <label className="block text-sm font-medium text-(--builder-color-danger) mb-2">
              {translations["account.delete_confirm_label"] ||
                "Type your email to confirm deletion"}
            </label>
            <div className="flex gap-3 flex-wrap sm:flex-nowrap">
              <input
                className="flex-1 rounded-lg border px-4 py-2.5 text-sm bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-red-200 transition-all duration-200"
                style={{ borderColor: "var(--builder-color-danger-border)" }}
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                type="email"
                placeholder={account.email}
              />
              <BuilderButton
                type="button"
                tone="danger"
                onClick={handleDelete}
                disabled={saving || deleteConfirm !== account.email}
                className="!px-6 !py-2.5 whitespace-nowrap"
              >
                {saving
                  ? "Deleting..."
                  : translations["account.delete_btn"] || "Delete account"}
              </BuilderButton>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </StepLayout>
  );
}
