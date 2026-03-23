import { BuilderButton } from "@/4-shared/ui/builder";

interface AccountDangerZoneProps {
  account: any;
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
  return (
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

      <div className="pl-13 space-y-2">
        <label className="block text-sm font-medium text-(--builder-color-danger) mb-2">
          {translations["builder.account.page.delete_confirm_label"] ||
            "Type your email to confirm deletion"}
        </label>
        <div className="flex gap-3 flex-wrap sm:flex-nowrap mb-2">
          <input
            className="flex-1 rounded-lg border px-4 py-2.5 text-sm bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-red-200 transition-all duration-200"
            style={{ borderColor: "var(--builder-color-danger-border)" }}
            value={deleteConfirm}
            onChange={(e) => setDeleteConfirm(e.target.value)}
            type="email"
            placeholder={account.email}
          />
        </div>
        <div className="flex items-center gap-2 mb-2">
          <input
            id="delete-acknowledge"
            type="checkbox"
            checked={deleteAcknowledge}
            onChange={(e) => setDeleteAcknowledge(e.target.checked)}
            className="accent-red-600"
            disabled={saving}
          />
          <label
            htmlFor="delete-acknowledge"
            className="text-sm text-(--builder-color-danger)"
          >
            {translations["builder.account.page.delete_acknowledge"] ||
              "I understand this action is permanent and cannot be undone."}
          </label>
        </div>
        <BuilderButton
          type="button"
          tone="danger"
          onClick={handleDelete}
          disabled={
            saving || deleteConfirm !== account.email || !deleteAcknowledge
          }
          className="px-6! py-2.5! whitespace-nowrap"
        >
          {saving
            ? translations["builder.account.page.deleting"] || "Deleting..."
            : translations["builder.account.page.delete_btn"] ||
              "Delete account"}
        </BuilderButton>
      </div>
    </div>
  );
}
