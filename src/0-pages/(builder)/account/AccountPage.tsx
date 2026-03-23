"use client";

import { StepLayout } from "@/1-widgets/builder/step-layout/ui/StepLayout";
import {
  deleteAccount,
  updateAccountInfo,
} from "@/3-entities/account/api/accountCrud";

import { notify } from "@/4-shared/lib/toast/toast";
import { BuilderButton } from "@/4-shared/ui/builder";
import { useState } from "react";
import { PreferencesTab } from "./ui/tabs/PreferencesTab";
import { ProfileTab } from "./ui/tabs/ProfileTab";
import { SecurityTab } from "./ui/tabs/SecurityTab";

interface Props {
  account: any;
  translations: Record<string, string>;
}

export default function AccountPage({ account, translations }: Props) {
  if (!account) {
    return (
      <div className="text-(--builder-color-danger) p-8 text-center">
        {translations["builder.account.page.error_not_found"] ||
          "Account not found."}
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
    : translations["builder.account.page.default_language"] || "EN";

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
                {account.full_name ||
                  translations["builder.account.page.welcome_back"] ||
                  "Welcome back!"}
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
                {account.preferred_language?.toUpperCase() ||
                  translations["builder.account.page.default_language"] ||
                  "EN"}
              </span>
              {account.onboarding_completed && (
                <span className="px-3 py-1.5 text-xs font-medium rounded-full bg-green-100 text-green-700">
                  {translations["builder.account.page.onboarded"] ||
                    "Onboarded"}
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
            {translations["builder.account.tabs.profile.tab_label"] ||
              "Profile Information"}
          </button>
          <button
            className={tabClass("security")}
            onClick={() => setActiveTab("security")}
          >
            {translations["builder.account.tabs.security.tab_label"] ||
              "Security"}
          </button>
          <button
            className={tabClass("preferences")}
            onClick={() => setActiveTab("preferences")}
          >
            {translations["builder.account.tabs.preferences.tab_label"] ||
              "Preferences"}
          </button>
        </div>

        {activeTab === "profile" && (
          <ProfileTab
            account={account}
            translations={translations}
            editName={editName}
            setEditName={setEditName}
            editEmail={editEmail}
            setEditEmail={setEditEmail}
            inputClass={inputClass}
            labelClass={labelClass}
            cardClass={cardClass}
          />
        )}

        {activeTab === "security" && (
          <SecurityTab translations={translations} cardClass={cardClass} />
        )}

        {activeTab === "preferences" && (
          <PreferencesTab
            account={account}
            translations={translations}
            cardClass={cardClass}
          />
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
                {translations["builder.account.page.danger_zone_title"] ||
                  "Delete Account"}
              </h3>
              <p className="text-sm text-(--builder-color-danger) mt-1 opacity-80">
                {translations["builder.account.page.delete_warning"] ||
                  "Once you delete your account, there is no going back. Please be certain."}
              </p>
            </div>
          </div>

          <div className="pl-13">
            <label className="block text-sm font-medium text-(--builder-color-danger) mb-2">
              {translations["builder.account.page.delete_confirm_label"] ||
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
                className="px-6! py-2.5! whitespace-nowrap"
              >
                {saving
                  ? translations["builder.account.page.deleting"] ||
                    "Deleting..."
                  : translations["builder.account.page.delete_btn"] ||
                    "Delete account"}
              </BuilderButton>
            </div>
          </div>
        </div>
      </div>
    </StepLayout>
  );
}
