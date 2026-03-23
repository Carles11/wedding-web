import { formatAccountDate } from "@/4-shared/helpers/formatAccountDate";

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
}: ProfileTabProps) {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Editable fields card */}
      <div className={cardClass}>
        <div className="p-6 border-b border-(--builder-color-border) bg-(--builder-color-muted-surface)/30">
          <h2 className="text-lg font-semibold text-(--builder-color-text)">
            {translations["builder.account.tabs.profile.section_profile"] ||
              "Profile Information"}
          </h2>
          <p className="text-sm text-(--builder-color-text-muted) mt-1">
            {translations["builder.account.tabs.profile.update_info"] ||
              "Update your personal information"}
          </p>
        </div>
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>
                {translations["builder.account.tabs.profile.label_full_name"] ||
                  "Full name"}
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
  );
}
