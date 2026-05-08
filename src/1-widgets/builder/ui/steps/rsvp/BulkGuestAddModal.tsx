"use client";

import { SUPPORTED_LANGUAGES } from "@/4-shared/config/i18n";
import { BuilderButton, FileUploader } from "@/4-shared/ui/builder";
import MainModal from "@/4-shared/ui/commons/modals/MainModal";
import { useEffect, useMemo, useState } from "react";

type Props = {
  open: boolean;
  siteId: string;
  translations: Record<string, string>;
  defaultPreferredLang: string;
  onClose: () => void;
  onImported: (summary: BulkGuestAddSummary) => Promise<void> | void;
};

type ImportMode = "upload" | "paste";

type PreviewRow = {
  rowNumber: number;
  name: string;
  email: string;
  preferred_lang: string;
  max_guests: number;
  errors: string[];
};

type BulkGuestAddJson =
  | {
      success: true;
      summary: BulkGuestAddSummary;
      error: string;
    }
  | {
      success: false;
      error: string;
      results?: Array<{
        rowNumber: number;
        name: string;
        email: string;
        action: "failed";
        error: string;
      }>;
    };

export type BulkGuestAddSummary = {
  totalRows: number;
  created: number;
  updated: number;
  failed: number;
  results: Array<{
    rowNumber: number;
    name: string;
    email: string;
    action: "created" | "updated" | "failed";
    error?: string;
  }>;
};

function isEmail(input: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
}

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = "";
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        currentField += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      currentRow.push(currentField.trim());
      currentField = "";
      continue;
    }

    if (char === "\n" && !inQuotes) {
      currentRow.push(currentField.trim());
      rows.push(currentRow);
      currentRow = [];
      currentField = "";
      continue;
    }

    if (char !== "\r") {
      currentField += char;
    }
  }

  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    rows.push(currentRow);
  }

  return rows.filter((row) => row.some((field) => field.trim() !== ""));
}

function normalizeHeader(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
}

function resolveHeaderIndex(headers: string[], aliases: string[]): number {
  return headers.findIndex((header) => aliases.includes(header));
}

function buildPreviewRows(
  text: string,
  defaultPreferredLang: string,
): PreviewRow[] {
  const rows = parseCsv(text);
  if (rows.length === 0) return [];

  const normalizedDefaultLanguage = SUPPORTED_LANGUAGES.includes(
    defaultPreferredLang as (typeof SUPPORTED_LANGUAGES)[number],
  )
    ? defaultPreferredLang
    : "en";

  const firstRowHeaders = rows[0].map(normalizeHeader);
  const looksLikeHeader =
    firstRowHeaders.includes("name") && firstRowHeaders.includes("email");

  const headerRow = looksLikeHeader ? firstRowHeaders : [];
  const dataRows = looksLikeHeader ? rows.slice(1) : rows;

  const nameIndex = looksLikeHeader
    ? resolveHeaderIndex(headerRow, [
        "name",
        "guest",
        "guest_name",
        "full_name",
      ])
    : 0;
  const emailIndex = looksLikeHeader
    ? resolveHeaderIndex(headerRow, ["email", "e_mail", "mail"])
    : 1;
  const langIndex = looksLikeHeader
    ? resolveHeaderIndex(headerRow, ["preferred_lang", "language", "lang"])
    : 2;
  const maxGuestsIndex = looksLikeHeader
    ? resolveHeaderIndex(headerRow, ["max_guests", "max_guest", "guests"])
    : 3;

  return dataRows.map((row, offset) => {
    const rowNumber = looksLikeHeader ? offset + 2 : offset + 1;
    const name = (row[nameIndex] ?? "").trim();
    const email = (row[emailIndex] ?? "").trim().toLowerCase();
    const preferred_lang = (row[langIndex] ?? normalizedDefaultLanguage)
      .trim()
      .toLowerCase();
    const rawMaxGuests = (row[maxGuestsIndex] ?? "1").trim();
    const max_guests = rawMaxGuests ? Number.parseInt(rawMaxGuests, 10) : 1;
    const errors: string[] = [];

    if (!name) {
      errors.push("Name is required.");
    }
    if (!email) {
      errors.push("Email is required.");
    } else if (!isEmail(email)) {
      errors.push("Email format is invalid.");
    }
    if (
      !SUPPORTED_LANGUAGES.includes(
        preferred_lang as (typeof SUPPORTED_LANGUAGES)[number],
      )
    ) {
      errors.push("Preferred language is not supported.");
    }
    if (!Number.isInteger(max_guests) || max_guests < 1) {
      errors.push("Max guests must be an integer greater than or equal to 1.");
    }

    return {
      rowNumber,
      name,
      email,
      preferred_lang,
      max_guests,
      errors,
    };
  });
}

function createFailedRowsCsv(summary: BulkGuestAddSummary): string {
  const failedRows = summary.results.filter((row) => row.action === "failed");
  const lines = failedRows.map((row) => {
    const error = row.error ?? "Unknown error";
    return [row.rowNumber, row.name, row.email, error]
      .map((value) => `"${String(value).replaceAll('"', '""')}"`)
      .join(",");
  });

  return [["rowNumber", "name", "email", "error"].join(","), ...lines].join(
    "\n",
  );
}

export function BulkGuestAddModal({
  open,
  siteId,
  translations,
  defaultPreferredLang,
  onClose,
  onImported,
}: Props) {
  const [mode, setMode] = useState<ImportMode>("upload");
  const [pasteValue, setPasteValue] = useState("");
  const [sourceLabel, setSourceLabel] = useState<string | null>(null);
  const [previewRows, setPreviewRows] = useState<PreviewRow[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [summary, setSummary] = useState<BulkGuestAddSummary | null>(null);
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    if (!open) {
      setMode("upload");
      setPasteValue("");
      setSourceLabel(null);
      setPreviewRows([]);
      setSubmitError(null);
      setSubmitting(false);
      setSummary(null);
      setResetKey((value) => value + 1);
    }
  }, [open]);

  const validRows = useMemo(
    () => previewRows.filter((row) => row.errors.length === 0),
    [previewRows],
  );

  const invalidRows = useMemo(
    () => previewRows.filter((row) => row.errors.length > 0),
    [previewRows],
  );

  async function handleFile(file: File) {
    const text = await file.text();
    setMode("upload");
    setPasteValue(text);
    setSourceLabel(file.name);
    setPreviewRows(buildPreviewRows(text, defaultPreferredLang));
    setSummary(null);
    setSubmitError(null);
  }

  function handlePreviewPaste() {
    setSourceLabel("Pasted guest list");
    setPreviewRows(buildPreviewRows(pasteValue, defaultPreferredLang));
    setSummary(null);
    setSubmitError(null);
  }

  async function handleSubmit() {
    if (validRows.length === 0) {
      setSubmitError(
        t(
          translations,
          "builder.rsvp.guests.bulk_add.empty_valid",
          "Add at least one valid guest row before importing.",
        ),
      );
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch(`/api/sites/${siteId}/bulk-add-guests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rows: validRows.map((row) => ({
            name: row.name,
            email: row.email,
            preferred_lang: row.preferred_lang,
            max_guests: row.max_guests,
          })),
        }),
      });

      const json = (await res.json()) as BulkGuestAddJson;

      if (!res.ok || !json.success) {
        setSubmitError(
          json.error ||
            t(
              translations,
              "builder.rsvp.guests.bulk_add.submit.error",
              "Failed to import guests.",
            ),
        );
        return;
      }

      setSummary(json.summary);
      await onImported(json.summary);
    } catch {
      setSubmitError(
        t(
          translations,
          "builder.rsvp.guests.bulk_add.submit.error",
          "Failed to import guests.",
        ),
      );
    } finally {
      setSubmitting(false);
    }
  }

  function handleDownloadFailedRows() {
    if (!summary || summary.failed === 0) return;

    const blob = new Blob([createFailedRowsCsv(summary)], {
      type: "text/csv;charset=utf-8",
    });
    const objectUrl = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = objectUrl;
    anchor.download = "bulk-guest-import-failures.csv";
    anchor.click();
    URL.revokeObjectURL(objectUrl);
  }

  return (
    <MainModal
      open={open}
      onClose={() => {
        if (!submitting) onClose();
      }}
      title={
        translations["builder.rsvp.guests.bulk_add.title"] ||
        "Add guests in bulk"
      }
    >
      <div className="space-y-5">
        <p className="text-sm text-(--builder-color-text-muted)">
          {translations["builder.rsvp.guests.bulk_add.description"] ||
            "Upload a CSV or paste guest rows using name,email,preferred_lang,max_guests. Language and max guests are optional."}
        </p>

        <div className="flex items-center gap-2">
          <BuilderButton
            variant={mode === "upload" ? "primary" : "secondary"}
            size="sm"
            onClick={() => setMode("upload")}
            disabled={submitting}
          >
            {translations["builder.rsvp.guests.bulk_add.mode.upload"] ||
              "File upload"}
          </BuilderButton>
          <BuilderButton
            variant={mode === "paste" ? "primary" : "secondary"}
            size="sm"
            onClick={() => setMode("paste")}
            disabled={submitting}
          >
            {translations["builder.rsvp.guests.bulk_add.mode.paste"] ||
              "Paste list"}
          </BuilderButton>
        </div>

        {mode === "upload" ? (
          <FileUploader
            onFile={handleFile}
            translations={translations}
            disabled={submitting}
            accept={{
              "text/csv": [".csv"],
              "text/plain": [".txt"],
            }}
            label={
              translations["builder.rsvp.guests.bulk_add.upload_label"] ||
              "Upload guest CSV"
            }
            resetKey={resetKey}
          />
        ) : (
          <div className="space-y-3">
            <textarea
              value={pasteValue}
              onChange={(event) => setPasteValue(event.target.value)}
              placeholder={
                translations[
                  "builder.rsvp.guests.bulk_add.paste_placeholder"
                ] ||
                "name,email,preferred_lang,max_guests\nTaylor,taylor@example.com,en,2"
              }
              rows={8}
              className="w-full rounded-md border border-(--builder-color-border) px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-(--builder-color-primary)"
              disabled={submitting}
            />
            <div className="flex justify-end">
              <BuilderButton
                variant="secondary"
                size="sm"
                onClick={handlePreviewPaste}
                disabled={submitting || !pasteValue.trim()}
              >
                {translations["builder.rsvp.guests.bulk_add.preview"] ||
                  "Preview guests"}
              </BuilderButton>
            </div>
          </div>
        )}

        {sourceLabel && (
          <p className="text-xs text-(--builder-color-text-muted)">
            {(translations["builder.rsvp.guests.bulk_add.source"] || "Source") +
              ": " +
              sourceLabel}
          </p>
        )}

        {previewRows.length > 0 && (
          <div className="space-y-3 rounded-lg border border-(--builder-color-border) p-4">
            <div className="flex flex-wrap items-center gap-3 text-sm text-(--builder-color-text)">
              <span>
                {(translations["builder.rsvp.guests.bulk_add.rows"] || "Rows") +
                  ": " +
                  previewRows.length}
              </span>
              <span>
                {(translations["builder.rsvp.guests.bulk_add.valid"] ||
                  "Valid") +
                  ": " +
                  validRows.length}
              </span>
              <span>
                {(translations["builder.rsvp.guests.bulk_add.invalid"] ||
                  "Invalid") +
                  ": " +
                  invalidRows.length}
              </span>
            </div>

            <div className="max-h-72 overflow-auto rounded border border-(--builder-color-border)">
              <table className="min-w-full text-sm">
                <thead className="bg-(--builder-color-surface) text-xs uppercase tracking-wide text-(--builder-color-text-muted)">
                  <tr>
                    <th className="px-3 py-2 text-left">#</th>
                    <th className="px-3 py-2 text-left">
                      {translations["builder.rsvp.guests.col.name"] || "Name"}
                    </th>
                    <th className="px-3 py-2 text-left">
                      {translations["builder.rsvp.guests.col.email"] || "Email"}
                    </th>
                    <th className="px-3 py-2 text-left">
                      {translations["builder.rsvp.guests.col.lang"] || "Lang"}
                    </th>
                    <th className="px-3 py-2 text-center">
                      {translations["builder.rsvp.guests.col.max_guests"] ||
                        "Max guests"}
                    </th>
                    <th className="px-3 py-2 text-left">
                      {translations["builder.rsvp.guests.bulk_add.issues"] ||
                        "Issues"}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-(--builder-color-border) bg-white">
                  {previewRows.map((row) => (
                    <tr key={row.rowNumber}>
                      <td className="px-3 py-2 text-(--builder-color-text-muted)">
                        {row.rowNumber}
                      </td>
                      <td className="px-3 py-2">{row.name || "-"}</td>
                      <td className="px-3 py-2">{row.email || "-"}</td>
                      <td className="px-3 py-2 uppercase">
                        {row.preferred_lang}
                      </td>
                      <td className="px-3 py-2 text-center">
                        {row.max_guests}
                      </td>
                      <td className="px-3 py-2 text-xs">
                        {row.errors.length === 0 ? (
                          <span className="text-green-700">
                            {translations[
                              "builder.rsvp.guests.bulk_add.ready"
                            ] || "Ready"}
                          </span>
                        ) : (
                          <span className="text-red-700">
                            {row.errors.join(" ")}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {submitError && (
          <div className="rounded border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
            {submitError}
          </div>
        )}

        {summary && (
          <div className="space-y-3 rounded-lg border border-(--builder-color-border) p-4">
            <div className="flex flex-wrap items-center gap-3 text-sm text-(--builder-color-text)">
              <span>
                {(translations["builder.rsvp.guests.bulk_add.created"] ||
                  "Created") +
                  ": " +
                  summary.created}
              </span>
              <span>
                {(translations["builder.rsvp.guests.bulk_add.updated"] ||
                  "Updated") +
                  ": " +
                  summary.updated}
              </span>
              <span>
                {(translations["builder.rsvp.guests.bulk_add.failed"] ||
                  "Failed") +
                  ": " +
                  summary.failed}
              </span>
            </div>
            {summary.failed > 0 && (
              <div className="flex justify-end">
                <BuilderButton
                  variant="secondary"
                  size="sm"
                  onClick={handleDownloadFailedRows}
                >
                  {translations[
                    "builder.rsvp.guests.bulk_add.download_failed"
                  ] || "Download failed rows"}
                </BuilderButton>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-end gap-2">
          <BuilderButton
            variant="secondary"
            size="sm"
            onClick={onClose}
            disabled={submitting}
          >
            {translations["builder.rsvp.guests.bulk_add.cancel"] || "Close"}
          </BuilderButton>
          <BuilderButton
            variant="primary"
            size="sm"
            onClick={handleSubmit}
            disabled={submitting || validRows.length === 0}
          >
            {submitting
              ? translations["builder.rsvp.guests.bulk_add.importing"] ||
                "Importing..."
              : translations["builder.rsvp.guests.bulk_add.submit"] ||
                "Import guests"}
          </BuilderButton>
        </div>
      </div>
    </MainModal>
  );
}

function t(
  translations: Record<string, string>,
  key: string,
  fallback: string,
): string {
  return translations[key] || fallback;
}
