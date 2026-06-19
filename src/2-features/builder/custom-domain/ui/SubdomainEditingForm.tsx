import { BuilderButton } from "@/4-shared/ui/builder";
import React from "react";

interface Props {
  subdomain: string;
  domainSuffix: string;
  status: string;
  helpText: string;
  isSaving: boolean;
  isOriginal: boolean;
  translations: Record<string, string>;
  setSubdomain: (val: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export const SubdomainEditingForm: React.FC<Props> = ({
  subdomain,
  domainSuffix,
  status,
  helpText,
  isSaving,
  isOriginal,
  translations,
  setSubdomain,
  onSave,
  onCancel,
}) => {
  return (
    <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
      <div className="flex flex-col gap-2">
        <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-[#6ABDA6]/20 transition-all">
          <span className="bg-gray-50 dark:bg-gray-900 px-3 py-2 text-xs text-gray-400 dark:text-gray-500   border-r select-none">
            https://
          </span>
          <input
            autoFocus
            value={subdomain}
            onChange={(e) =>
              setSubdomain(e.target.value.toLowerCase().replace(/\s+/g, ""))
            }
            className="flex-1 px-3 py-2 text-sm   outline-none"
            spellCheck={false}
            disabled={isSaving}
          />
          <span className="bg-gray-50 dark:bg-gray-900 px-3 py-2 text-xs text-gray-400 dark:text-gray-500   border-l select-none">
            .{domainSuffix}
          </span>
        </div>

        {status !== "idle" && (
          <p
            className={`text-xs font-medium ${status.startsWith("error") ? "text-red-500 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}
          >
            {helpText}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <BuilderButton
          size="sm"
          onClick={onSave}
          loading={isSaving}
          disabled={isOriginal || !subdomain}
        >
          {translations["builder.domain.save_btn"]}
        </BuilderButton>
        <button
          onClick={onCancel}
          className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 font-medium"
          disabled={isSaving}
        >
          {translations["builder.actions.cancel"] || "Cancel"}
        </button>
      </div>
    </div>
  );
};
