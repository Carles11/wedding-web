"use client";

import React, { useState } from "react";

interface Props {
  planType: "free" | "monthly" | "yearly";
  translations: Record<string, string>;
  customDomain?: string | null;
  onUpgradeClick: () => void;
  onSave?: (domain: string) => Promise<void>;
  loading?: boolean;
  status?: "idle" | "saving" | "success" | "error" | "pending" | "verified";
  statusMessage?: string;
  dnsInstructions?: string | null;
}

export const CustomDomainSection: React.FC<Props> = ({
  planType,
  translations,
  customDomain,
  onUpgradeClick,
  onSave,
  loading = false,
  status = "idle",
  statusMessage = "",
  dnsInstructions = null,
}) => {
  const [value, setValue] = useState(customDomain ?? "");
  const [dirty, setDirty] = useState(false);
  const [localStatus, setLocalStatus] = useState<"" | "success" | "error">("");
  const [localMsg, setLocalMsg] = useState<string | null>(null);

  const isPaid = planType !== "free";

  const handleSave = async () => {
    if (!onSave) return;
    try {
      setLocalStatus("");
      setLocalMsg(null);
      await onSave(value);
      setLocalStatus("success");
      setLocalMsg(
        translations["builder.domain.success_saved"] || "Custom domain saved!",
      );
    } catch (err: Error | unknown) {
      setLocalStatus("error");
      const errorMessage = err instanceof Error ? err.message : undefined;
      setLocalMsg(
        errorMessage ||
          translations["builder.domain.error_generic"] ||
          "Error saving custom domain.",
      );
    }
  };

  return (
    <section className="mt-8">
      <h4 className="font-semibold mb-2">
        {translations["builder.domain.custom_domain_title"]}
      </h4>

      {!isPaid ? (
        <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded text-gray-500">
          <span aria-hidden className="inline-block text-xl">
            🔒
          </span>
          <span>{translations["builder.domain.custom_domain_locked"]}</span>
          <button
            className="ml-auto px-3 py-1 bg-blue-600 text-white rounded text-sm"
            onClick={onUpgradeClick}
            type="button"
          >
            {translations["builder.domain.upgrade_btn"]}
          </button>
        </div>
      ) : (
        <form
          className="flex flex-col gap-2 max-w-lg"
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          <label className="sr-only" htmlFor="custom-domain-input">
            {translations["builder.domain.custom_domain_placeholder"]}
          </label>
          <input
            id="custom-domain-input"
            type="text"
            className="border px-2 py-1 rounded w-72"
            placeholder={
              translations["builder.domain.custom_domain_placeholder"]
            }
            disabled={loading || status === "saving"}
            value={value}
            onChange={(e) => {
              setValue(e.target.value.trim());
              setDirty(true);
              setLocalStatus("");
              setLocalMsg(null);
            }}
            aria-label={
              translations["builder.domain.custom_domain_placeholder"]
            }
            autoComplete="off"
          />

          {dnsInstructions && (
            <div className="rounded bg-blue-50 px-3 py-2 my-1 text-xs border border-blue-100 text-blue-800">
              {dnsInstructions}
            </div>
          )}

          {(!!statusMessage || !!localMsg) && (
            <div
              className={`text-xs mt-1 ${
                status === "success" || localStatus === "success"
                  ? "text-green-700"
                  : "text-red-600"
              }`}
            >
              {statusMessage || localMsg}
            </div>
          )}

          <button
            className="mt-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-500"
            type="submit"
            disabled={
              loading ||
              status === "saving" ||
              !dirty ||
              !value ||
              value === (customDomain ?? "")
            }
          >
            {translations["builder.domain.save_btn"]}
          </button>
        </form>
      )}
    </section>
  );
};

export default CustomDomainSection;
