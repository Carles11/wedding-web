"use client";

import { getDomainSuffix } from "@/4-shared/helpers/subdomain/getSuffix";
import { notify } from "@/4-shared/lib/toast/toast";
import type { PlanType, Site } from "@/4-shared/types";
import { BuilderButton } from "@/4-shared/ui/builder";
import { copyToClipboard } from "@/4-shared/utils/copyToClipboard";
import { isValidSubdomain } from "@/4-shared/utils/validations";
import { useState } from "react";

interface Props {
  site: Site;
  refresh: () => void;
  translations: Record<string, string>;
  planType: PlanType;
  canEdit?: boolean;
}

const RESERVED = ["www", "admin", "api"];

export default function SubdomainManager({
  site,
  refresh,
  translations,
  planType,
  canEdit = true,
}: Props) {
  const [subdomain, setSubdomain] = useState(site.subdomain || "");
  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState<
    | "idle"
    | "saving"
    | "success"
    | "error"
    | "error_taken"
    | "error_reserved"
    | "error_invalid"
  >("idle");
  const [helpText, setHelpText] = useState<string>("");
  const domainSuffix = getDomainSuffix();

  async function handleSave() {
    if (!isValidSubdomain(subdomain)) {
      setStatus("error_invalid");
      setHelpText(translations["builder.domain.error_invalid"]);
      return;
    }
    setStatus("saving");
    // Uniqueness check
    try {
      const check = await fetch(
        `/api/sites/validate-subdomain?subdomain=${subdomain}`,
      );
      const { valid, reason } = await check.json();

      if (!valid) {
        setStatus(
          reason === "taken"
            ? "error_taken"
            : reason === "reserved"
              ? "error_reserved"
              : "error",
        );
        setHelpText(
          translations[`builder.domain.error_${reason}`] ||
            translations["builder.domain.error_generic"],
        );
        return;
      }
      // Save subdomain via PATCH/POST
      const res = await fetch(`/api/sites/${site.id}/subdomain`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subdomain }),
      });
      if (!res.ok) throw new Error();

      setStatus("success");
      setHelpText(translations["builder.domain.success_saved"]);
      // Update the displayed site.subdomain value so other parts of your UI see it
      site.subdomain = subdomain; // This mutates the prop, which is not recommended in React
      setSubdomain(subdomain); // But this updates local input—they are already in sync, so should be fine
      setEditing(false);

      notify.success(
        translations["builder.general.form.save_success"] ||
          "Saved successfully.",
      );
    } catch {
      setStatus("error");
      setHelpText(translations["builder.domain.error_generic"]);
      notify.error(
        translations["error.something_went_wrong"] ?? "Something went wrong",
      );
    }
  }

  return (
    <div className="space-y-4 max-w-xl">
      <div>
        <label>
          <h4 className="font-semibold mb-2">
            {translations["builder.domain.current_subdomain_label"]}
          </h4>
        </label>
        <div className="flex items-center gap-2 mt-1">
          <input
            readOnly
            value={site.subdomain || ""}
            className="bg-gray-100 border rounded px-2 py-1 text-sm w-fit font-mono"
            tabIndex={-1}
            aria-label={translations["builder.domain.current_subdomain_label"]}
          />
          <BuilderButton
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => copyToClipboard(`${site.subdomain}.${domainSuffix}`)}
          >
            {translations["builder.domain.copy_url"] || "Copy URL"}
          </BuilderButton>
        </div>
        <div className="mt-1 text-xs text-gray-500">
          {translations["builder.domain.example_url"] || "Example URL"}:{" "}
          <span className="font-mono">{`https://${site.subdomain}.${domainSuffix}`}</span>
        </div>
      </div>

      {/* Edit */}
      {canEdit && (
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            {translations["builder.domain.subdomain_label"] || "Subdomain"}
          </label>
          <input
            value={subdomain}
            onChange={(e) => {
              setSubdomain(e.target.value.toLowerCase());
              setStatus("idle");
              setHelpText("");
            }}
            className="border px-2 py-1 rounded w-48 font-mono"
            pattern="^[a-z0-9]([a-z0-9\-]{1,61}[a-z0-9])?$"
            minLength={3}
            maxLength={63}
            disabled={status === "saving"}
            spellCheck={false}
          />
          <p className="text-xs text-gray-500">
            {translations["builder.domain.subdomain_desc"] ||
              "Enter your desired subdomain."}
          </p>
          {status !== "idle" && (
            <p
              className={`text-xs mt-1 ${status.startsWith("error") ? "text-(--builder-color-danger)" : "text-green-700"}`}
            >
              {helpText}
            </p>
          )}
          <BuilderButton
            type="button"
            onClick={handleSave}
            disabled={
              !subdomain ||
              subdomain === site.subdomain ||
              status === "saving" ||
              !isValidSubdomain(subdomain)
            }
            loading={status === "saving"}
            className="mt-2"
          >
            {translations["builder.domain.save_btn"] || "Save domain"}
          </BuilderButton>
        </div>
      )}
    </div>
  );
}
