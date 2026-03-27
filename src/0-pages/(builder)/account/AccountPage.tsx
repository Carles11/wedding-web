"use client";

import { deleteAccountAction } from "@/3-entities/account/actions/deleteAccount";
import { updateAccountInfo } from "@/3-entities/account/api/accountCrud";
import { getAccountById } from "@/3-entities/account/api/getAccountById";
import { useSupabaseAuth } from "@/4-shared/hooks/useSupabaseAuth";
import { notify } from "@/4-shared/lib/toast/toast";
import UnderlinedLink from "@/4-shared/ui/commons/link/UnderlinedLink";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PreferencesTab } from "./ui/tabs/PreferencesTab";
import { ProfileTab } from "./ui/tabs/ProfileTab";
import { SecurityTab } from "./ui/tabs/SecurityTab";

import type { Site } from "@/4-shared/types";

interface Props {
  account: any;
  translations: Record<string, string>;
  site?: Site;
}

export default function AccountPage({ account, translations, site }: Props) {
  const router = useRouter();

  const [currentAccount, setCurrentAccount] = useState(account);
  const [editName, setEditName] = useState(account.full_name || "");
  const [editEmail, setEditEmail] = useState(account.email);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [activeTab, setActiveTab] = useState<
    "profile" | "security" | "preferences"
  >("profile");
  const [deleteAcknowledge, setDeleteAcknowledge] = useState(false);
  const { user, signOut } = useSupabaseAuth();

  useEffect(() => {
    async function refetchAccount() {
      if (user?.id && user?.email && user.email !== currentAccount.email) {
        const result = await getAccountById(user.id);
        if (result.success && result.data) {
          setCurrentAccount(result.data);
          setEditName(result.data.full_name || "");
          setEditEmail(result.data.email);
        }
      }
    }
    refetchAccount();
  }, [user?.email]);

  if (!currentAccount) {
    return (
      <div className="text-(--builder-color-danger) p-8 text-center">
        {translations["builder.account.page.error_not_found"] ||
          "Account not found."}
      </div>
    );
  }

  const handleSave = async () => {
    setSaving(true);
    try {
      const updates: any = {};
      if (editName !== account.full_name) updates.full_name = editName;
      if (Object.keys(updates).length === 0) {
        notify.success(
          translations["builder.general.form.save_success"] ||
            "Changes saved successfully!",
        );
        return;
      }
      const result = await updateAccountInfo(account.id, updates);
      if (result.success) {
        notify.success(
          translations["builder.general.form.save_success"] ||
            "Changes saved successfully!",
        );
        setEditEmail(account.email);
      } else {
        notify.error("Update failed.");
      }
    } catch (err) {
      notify.error("Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteAcknowledge || deleteConfirm !== account.email) {
      notify.error("Please verify deletion requirements.");
      return;
    }
    setSaving(true);
    try {
      const result = await deleteAccountAction(account.id);
      if (result.success) {
        await signOut();
        router.push("/");
      }
    } finally {
      setSaving(false);
    }
  };

  const initials = currentAccount.full_name
    ? currentAccount.full_name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "EN";

  // Tailwind Classes
  const inputClass =
    "mt-1 block w-full rounded-lg border border-(--builder-color-border) bg-(--builder-color-surface) px-4 py-2.5 text-sm text-(--builder-color-text) focus:ring-2 focus:ring-(--builder-color-primary)/20 focus:border-(--builder-color-primary) transition-all";
  const labelClass =
    "block text-sm font-medium text-(--builder-color-text-muted) mb-1.5";
  const cardClass =
    "rounded-xl border border-(--builder-color-border) bg-(--builder-color-surface) overflow-hidden transition-all hover:shadow-lg";

  const tabClass = (tab: string) =>
    [
      "px-4 py-2.5 text-sm font-medium transition-all relative whitespace-nowrap",
      activeTab === tab
        ? "text-(--builder-color-primary) after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-(--builder-color-primary)"
        : "text-(--builder-color-text-muted) hover:text-(--builder-color-text)",
    ].join(" ");

  return (
    <div className="builder-theme max-w-4xl mx-auto space-y-6 px-4 py-6">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-2xl border border-(--builder-color-border) bg-(--builder-color-surface) p-6 sm:p-8">
        <div className="absolute inset-0 bg-linear-to-br from-(--builder-color-primary)/5 to-transparent" />

        <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar */}
          <div className="shrink-0">
            {account.avatar_url ? (
              <img
                src={account.avatar_url}
                alt="avatar"
                className="w-24 h-24 rounded-2xl object-cover ring-4 ring-(--builder-color-primary)/10"
              />
            ) : (
              <div
                className="w-24 h-24 rounded-2xl flex items-center justify-center text-3xl font-bold text-white shadow-lg"
                style={{
                  background: `linear-gradient(135deg, var(--builder-color-primary) 0%, #6366f1 100%)`,
                }}
              >
                {initials}
              </div>
            )}
          </div>

          {/* Identity & Badges */}
          <div className="flex-1 text-center sm:text-left min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-(--builder-color-text) truncate">
                {account.full_name ||
                  translations["builder.account.page.welcome_back"] ||
                  "Welcome!"}
              </h1>
              {account.onboarding_completed && (
                <div className="flex justify-center">
                  <span className="px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-bold rounded-full bg-green-100 text-green-700 border border-green-200">
                    {translations["builder.account.page.onboarded"] ||
                      "Onboarded"}
                  </span>
                </div>
              )}
            </div>

            <p className="text-(--builder-color-text-muted) flex items-center justify-center sm:justify-start gap-2 text-sm sm:text-base mb-4">
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
              <span className="truncate">{account.email}</span>
            </p>

            <div className="pt-2 border-t border-(--builder-color-border) inline-block">
              <UnderlinedLink
                href={`/${account.preferred_language?.toLowerCase() || "en"}/builder`}
                thicknessClass="h-0.5"
                durationMs={350}
                ariaLabel="Back to dashboard"
              >
                <span className="text-sm font-medium uppercase tracking-wide">
                  ←{" "}
                  {translations["builder.actions.back"] || "Back to dashboard"}
                </span>
              </UnderlinedLink>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation - Scrollable on mobile */}
      <div className="flex border-b border-(--builder-color-border) overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
        <button
          className={tabClass("profile")}
          onClick={() => setActiveTab("profile")}
        >
          {translations["builder.account.tabs.profile.tab_label"] || "Profile"}
        </button>
        <button
          className={tabClass("security")}
          onClick={() => setActiveTab("security")}
        >
          {translations["builder.account.tabs.security.tab_label"] ||
            "Security and Privacy"}
        </button>
        <button
          className={tabClass("preferences")}
          onClick={() => setActiveTab("preferences")}
        >
          {translations["builder.account.tabs.preferences.tab_label"] ||
            "Preferences"}
        </button>
      </div>

      {/* Content Rendering */}
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        {activeTab === "profile" && (
          <ProfileTab
            account={currentAccount}
            translations={translations}
            editName={editName}
            setEditName={setEditName}
            editEmail={editEmail}
            setEditEmail={setEditEmail}
            inputClass={inputClass}
            labelClass={labelClass}
            cardClass={cardClass}
            saving={saving}
            deleteConfirm={deleteConfirm}
            setDeleteConfirm={setDeleteConfirm}
            deleteAcknowledge={deleteAcknowledge}
            setDeleteAcknowledge={setDeleteAcknowledge}
            handleDelete={handleDelete}
            nextLabel={translations["account.save_btn"] || "Save changes"}
            backLabel={translations["account.cancel_btn"] || "Cancel"}
            onNext={handleSave}
            nextDisabled={saving}
            nextLoading={saving}
          />
        )}
        {activeTab === "security" && (
          <SecurityTab
            translations={translations}
            cardClass={cardClass}
            site={site}
          />
        )}
        {activeTab === "preferences" && (
          <PreferencesTab
            account={account}
            translations={translations}
            cardClass={cardClass}
          />
        )}
      </div>
    </div>
  );
}
