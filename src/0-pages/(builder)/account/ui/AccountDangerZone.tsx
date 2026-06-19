import DeleteAccountConfirmModal from "@/0-pages/(builder)/account/ui/DeleteAccountConfirmModal";
import { AccountInfo } from "@/4-shared/types/account";
import { BuilderButton } from "@/4-shared/ui/builder";
import { useState } from "react";

interface AccountDangerZoneProps {
  account: AccountInfo;
  translations: Record<string, string>;
  saving: boolean;
  deleteConfirm: string;
  setDeleteConfirm: (val: string) => void;
  deleteAcknowledge: boolean;
  setDeleteAcknowledge: (val: boolean) => void;
  handleDelete: () => void;
}

export default function AccountDangerZone({
  account,
  translations,
  saving,
  deleteConfirm,
  setDeleteConfirm,
  handleDelete,
  deleteAcknowledge,
  setDeleteAcknowledge,
}: AccountDangerZoneProps) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const isConfirmDisabled =
    saving || deleteConfirm !== account.email || !deleteAcknowledge;

  return (
    <div className="rounded-xl border border-red-300 dark:border-red-800/50 bg-white dark:bg-gray-800 overflow-hidden shadow-sm transition-all duration-200">
      {/* Top Header - The "Alert" feel */}
      <div className="p-6 border-b border-gray-50 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-900/30">
        <div className="flex items-center gap-4">
          <div className="shrink-0 w-12 h-12 rounded-lg bg-red-50 dark:bg-red-950/30 flex items-center justify-center border border-red-100 dark:border-red-800/50">
            <svg
              className="w-6 h-6 text-(--builder-color-danger)"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {translations["builder.account.page.danger_zone_title"] ||
                "Delete Account"}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-md">
              {translations["builder.account.page.delete_warning"] ||
                "Once you delete your account, there is no going back. All your data will be permanently removed."}
            </p>
          </div>
        </div>
      </div>

      {/* Confirmation Area */}
      <div className="p-6 space-y-5">
        <div className="max-w-md">
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">
            {translations["builder.account.page.delete_confirm_label"] ||
              "Confirm by typing your email"}
          </label>
          <input
            className="w-full rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-2.5 text-sm bg-gray-50/50 dark:bg-gray-900/50 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-red-100 dark:focus:ring-red-900/30 focus:border-red-300 dark:focus:border-red-600 transition-all duration-200"
            value={deleteConfirm}
            onChange={(e) => setDeleteConfirm(e.target.value)}
            type="email"
            placeholder={account.email}
          />
        </div>

        <div className="flex items-start gap-3">
          <div className="flex items-center h-5">
            <input
              id="delete-acknowledge"
              type="checkbox"
              checked={deleteAcknowledge}
              onChange={(e) => setDeleteAcknowledge(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-(--builder-color-danger) focus:ring-(--builder-color-danger) cursor-pointer"
              disabled={saving}
            />
          </div>
          <label
            htmlFor="delete-acknowledge"
            className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer leading-tight"
          >
            {translations["builder.account.page.delete_acknowledge"] ||
              "I understand this action is permanent and cannot be undone."}
          </label>
        </div>

        <div className="pt-2">
          <BuilderButton
            type="button"
            tone="danger"
            onClick={() => setDeleteModalOpen(true)}
            disabled={isConfirmDisabled}
            className={`px-8 py-3 rounded-lg font-medium transition-all duration-200 ${
              isConfirmDisabled
                ? "grayscale opacity-50"
                : "shadow-lg shadow-red-100 dark:shadow-red-900/30 hover:shadow-red-200 dark:hover:shadow-red-900/50"
            }`}
          >
            {saving
              ? translations["builder.account.page.deleting"] ||
                "Deleting Account..."
              : translations["builder.account.page.delete_btn"] ||
                "Permanently Delete Account"}
          </BuilderButton>
        </div>
      </div>

      <DeleteAccountConfirmModal
        open={deleteModalOpen}
        translations={translations}
        loading={saving}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={() => {
          setDeleteModalOpen(false);
          handleDelete();
        }}
      />
    </div>
  );
}
