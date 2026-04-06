import { AccountInfo } from "@/4-shared/types/account";
import { BuilderButton } from "@/4-shared/ui/builder";

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
  const isConfirmDisabled =
    saving || deleteConfirm !== account.email || !deleteAcknowledge;

  return (
    <div className="rounded-xl border border-red-300 bg-white overflow-hidden shadow-sm transition-all duration-200">
      {/* Top Header - The "Alert" feel */}
      <div className="p-6 border-b border-gray-50 bg-gray-50/30">
        <div className="flex items-center gap-4">
          <div className="shrink-0 w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center border border-red-100">
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
            <h3 className="text-lg font-semibold text-gray-900">
              {translations["builder.account.page.danger_zone_title"] ||
                "Delete Account"}
            </h3>
            <p className="text-sm text-gray-500 mt-1 max-w-md">
              {translations["builder.account.page.delete_warning"] ||
                "Once you delete your account, there is no going back. All your data will be permanently removed."}
            </p>
          </div>
        </div>
      </div>

      {/* Confirmation Area */}
      <div className="p-6 space-y-5">
        <div className="max-w-md">
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
            {translations["builder.account.page.delete_confirm_label"] ||
              "Confirm by typing your email"}
          </label>
          <input
            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-300 transition-all duration-200"
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
              className="w-4 h-4 rounded border-gray-300 text-(--builder-color-danger) focus:ring-(--builder-color-danger) cursor-pointer"
              disabled={saving}
            />
          </div>
          <label
            htmlFor="delete-acknowledge"
            className="text-sm text-gray-600 cursor-pointer leading-tight"
          >
            {translations["builder.account.page.delete_acknowledge"] ||
              "I understand this action is permanent and cannot be undone."}
          </label>
        </div>

        <div className="pt-2">
          <BuilderButton
            type="button"
            tone="danger"
            onClick={handleDelete}
            disabled={isConfirmDisabled}
            className={`px-8 py-3 rounded-lg font-medium transition-all duration-200 ${
              isConfirmDisabled
                ? "grayscale opacity-50"
                : "shadow-lg shadow-red-100 hover:shadow-red-200"
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
    </div>
  );
}
