"use client";

import type {
  RsvpResponseRow,
  RsvpResponseStatus,
  RsvpSubmission,
} from "@/3-entities/rsvp/model/types";
import { t } from "@/4-shared/helpers/t";
import { notify } from "@/4-shared/lib/toast/toast";
import { BuilderButton } from "@/4-shared/ui/builder";
import MainModal from "@/4-shared/ui/commons/modals/MainModal";
import { useCallback, useEffect, useMemo, useState } from "react";

type Props = {
  siteId: string;
  translations: Record<string, string>;
};

type StatusFilter = "all" | RsvpResponseStatus;

type ResponsesListJson = {
  success: boolean;
  rows?: RsvpResponseRow[];
  total?: number;
  page?: number;
  limit?: number;
  error?: string;
};

type SubmissionsListJson = {
  success: boolean;
  submissions?: RsvpSubmission[];
  total?: number;
  page?: number;
  limit?: number;
  error?: string;
};

const LIST_LIMIT = 20;
const DETAIL_SUBMISSIONS_LIMIT = 10;
const CSV_EXPORT_LIMIT = 200;

function formatDateTime(iso: string | null): string {
  if (!iso) return "-";
  try {
    return new Date(iso).toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function statusBadgeClass(status: RsvpResponseStatus): string {
  if (status === "attending") return "bg-green-100 text-green-800";
  if (status === "not_attending") return "bg-red-100 text-red-700";
  return "bg-gray-100 text-gray-700";
}

function escapeCsvValue(value: string | number | boolean | null): string {
  const text = value === null ? "" : String(value);
  if (!/[",\n]/.test(text)) return text;
  return `"${text.replaceAll('"', '""')}"`;
}

function toCsv(rows: RsvpResponseRow[]): string {
  const headers = [
    "name",
    "email",
    "preferred_lang",
    "max_guests",
    "is_active",
    "status",
    "headcount",
    "comment",
    "meal_intolerances",
    "song_request",
    "updated_at",
  ];

  const lines = rows.map((row) => {
    const values: Array<string | number | boolean | null> = [
      row.party.name,
      row.party.email,
      row.party.preferred_lang,
      row.party.max_guests,
      row.party.is_active,
      row.state.status,
      row.state.headcount,
      row.state.comment,
      row.state.meal_intolerances,
      row.state.song_request,
      row.state.updated_at,
    ];
    return values.map(escapeCsvValue).join(",");
  });

  return [headers.join(","), ...lines].join("\n");
}

export function RsvpResponsesTab({ siteId, translations }: Props) {
  const [rows, setRows] = useState<RsvpResponseRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [includeInactive, setIncludeInactive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [selectedRow, setSelectedRow] = useState<RsvpResponseRow | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [submissions, setSubmissions] = useState<RsvpSubmission[]>([]);
  const [submissionsTotal, setSubmissionsTotal] = useState(0);
  const [submissionsPage, setSubmissionsPage] = useState(1);
  const [submissionsLoading, setSubmissionsLoading] = useState(false);
  const [submissionsError, setSubmissionsError] = useState<string | null>(null);
  const [exportingCsv, setExportingCsv] = useState(false);

  const totalPages = Math.max(1, Math.ceil(total / LIST_LIMIT));
  const submissionsTotalPages = Math.max(
    1,
    Math.ceil(submissionsTotal / DETAIL_SUBMISSIONS_LIMIT),
  );

  const statusOptions = useMemo(
    () => [
      {
        value: "all" as StatusFilter,
        label: t(translations, "builder.rsvp.responses.status.all", "All"),
      },
      {
        value: "unknown" as StatusFilter,
        label: t(
          translations,
          "builder.rsvp.responses.status.no_response",
          "No response",
        ),
      },
      {
        value: "attending" as StatusFilter,
        label: t(
          translations,
          "builder.rsvp.responses.status.attending",
          "Attending",
        ),
      },
      {
        value: "not_attending" as StatusFilter,
        label: t(
          translations,
          "builder.rsvp.responses.status.not_attending",
          "Not attending",
        ),
      },
    ],
    [translations],
  );

  const statusLabelMap = useMemo(
    () =>
      new Map<StatusFilter, string>(
        statusOptions.map((option) => [option.value, option.label]),
      ),
    [statusOptions],
  );

  const fetchRows = useCallback(
    async (
      nextPage: number,
      nextSearch: string,
      nextStatus: StatusFilter,
      nextIncludeInactive: boolean,
    ) => {
      setLoading(true);
      setLoadError(null);

      try {
        const params = new URLSearchParams({
          page: String(nextPage),
          limit: String(LIST_LIMIT),
          status: nextStatus,
          include_inactive: nextIncludeInactive ? "1" : "0",
        });
        if (nextSearch.trim()) {
          params.set("q", nextSearch.trim());
        }

        const res = await fetch(
          `/api/sites/${siteId}/rsvp-responses?${params.toString()}`,
        );
        const json = (await res.json()) as ResponsesListJson;

        if (!res.ok || !json.success) {
          setLoadError(
            json.error ??
              t(
                translations,
                "builder.rsvp.responses.load.error",
                "Failed to load responses.",
              ),
          );
          return;
        }

        setRows(json.rows ?? []);
        setTotal(json.total ?? 0);
      } catch {
        setLoadError(
          t(
            translations,
            "builder.rsvp.responses.network.error",
            "Network error — please try again.",
          ),
        );
      } finally {
        setLoading(false);
      }
    },
    [siteId, translations],
  );

  const fetchSubmissions = useCallback(
    async (partyId: string, nextPage: number) => {
      setSubmissionsLoading(true);
      setSubmissionsError(null);

      try {
        const params = new URLSearchParams({
          page: String(nextPage),
          limit: String(DETAIL_SUBMISSIONS_LIMIT),
        });

        const res = await fetch(
          `/api/sites/${siteId}/rsvp-parties/${partyId}/rsvp-submissions?${params.toString()}`,
        );
        const json = (await res.json()) as SubmissionsListJson;

        if (!res.ok || !json.success) {
          setSubmissionsError(
            json.error ??
              t(
                translations,
                "builder.rsvp.responses.submissions.load.error",
                "Failed to load submissions.",
              ),
          );
          return;
        }

        setSubmissions(json.submissions ?? []);
        setSubmissionsTotal(json.total ?? 0);
      } catch {
        setSubmissionsError(
          t(
            translations,
            "builder.rsvp.responses.submissions.network.error",
            "Network error — please try again.",
          ),
        );
      } finally {
        setSubmissionsLoading(false);
      }
    },
    [siteId, translations],
  );

  useEffect(() => {
    fetchRows(page, activeSearch, statusFilter, includeInactive);
  }, [fetchRows, page, activeSearch, statusFilter, includeInactive]);

  useEffect(() => {
    if (!detailOpen || !selectedRow?.party.id) return;
    fetchSubmissions(selectedRow.party.id, submissionsPage);
  }, [detailOpen, selectedRow?.party.id, submissionsPage, fetchSubmissions]);

  function resetAndSearch() {
    setPage(1);
    setActiveSearch(searchInput);
  }

  function handleSearchKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      resetAndSearch();
    }
  }

  function handleStatusChange(nextStatus: StatusFilter) {
    setStatusFilter(nextStatus);
    setPage(1);
  }

  function handleIncludeInactiveChange(nextIncludeInactive: boolean) {
    setIncludeInactive(nextIncludeInactive);
    setPage(1);
  }

  function openDetails(row: RsvpResponseRow) {
    setSelectedRow(row);
    setSubmissionsPage(1);
    setSubmissions([]);
    setSubmissionsTotal(0);
    setSubmissionsError(null);
    setDetailOpen(true);
  }

  function closeDetails() {
    setDetailOpen(false);
    setSelectedRow(null);
    setSubmissions([]);
    setSubmissionsTotal(0);
    setSubmissionsPage(1);
    setSubmissionsError(null);
  }

  async function handleDownloadCsv() {
    setExportingCsv(true);

    try {
      const params = new URLSearchParams({
        page: "1",
        limit: String(CSV_EXPORT_LIMIT),
        status: statusFilter,
        include_inactive: includeInactive ? "1" : "0",
      });
      if (activeSearch.trim()) {
        params.set("q", activeSearch.trim());
      }

      const res = await fetch(
        `/api/sites/${siteId}/rsvp-responses?${params.toString()}`,
      );
      const json = (await res.json()) as ResponsesListJson;

      if (!res.ok || !json.success) {
        notify.error(
          json.error ??
            t(
              translations,
              "builder.rsvp.responses.csv.error",
              "Failed to download CSV.",
            ),
        );
        return;
      }

      const exportRows = json.rows ?? [];
      const exportTotal = json.total ?? 0;

      if (exportTotal > CSV_EXPORT_LIMIT) {
        notify.error(
          t(
            translations,
            "builder.rsvp.responses.csv.limit_exceeded",
            "Too many rows to export. Narrow your filters to 200 or fewer rows.",
          ),
        );
        return;
      }

      const csv = toCsv(exportRows);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = `rsvp-responses-${siteId}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(objectUrl);

      notify.success(
        t(
          translations,
          "builder.rsvp.responses.csv.success",
          "CSV download started.",
        ),
      );
    } catch {
      notify.error(
        t(
          translations,
          "builder.rsvp.responses.csv.error",
          "Failed to download CSV.",
        ),
      );
    } finally {
      setExportingCsv(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder={t(
              translations,
              "builder.rsvp.responses.search.placeholder",
              "Search by name or email…",
            )}
            className="w-64 border border-(--builder-color-border) rounded-md px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-(--builder-color-primary)"
          />

          <BuilderButton
            variant="secondary"
            size="sm"
            onClick={resetAndSearch}
            disabled={loading}
          >
            {t(translations, "builder.rsvp.responses.search.btn", "Search")}
          </BuilderButton>

          <select
            value={statusFilter}
            onChange={(e) => handleStatusChange(e.target.value as StatusFilter)}
            className="border border-(--builder-color-border) rounded-md px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-(--builder-color-primary)"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <label className="inline-flex items-center gap-2 text-sm text-(--builder-color-text-muted)">
            <input
              type="checkbox"
              checked={includeInactive}
              onChange={(e) => handleIncludeInactiveChange(e.target.checked)}
              className="rounded border-(--builder-color-border)"
            />
            {t(
              translations,
              "builder.rsvp.responses.include_inactive",
              "Include inactive",
            )}
          </label>
        </div>

        <BuilderButton
          variant="secondary"
          size="sm"
          onClick={handleDownloadCsv}
          disabled={loading || exportingCsv}
        >
          {exportingCsv
            ? t(
                translations,
                "builder.rsvp.responses.csv.loading",
                "Preparing…",
              )
            : t(
                translations,
                "builder.rsvp.responses.csv.download",
                "Download CSV",
              )}
        </BuilderButton>
      </div>

      {loadError && (
        <div className="rounded border border-red-300 bg-red-50 px-4 py-3">
          <p className="text-sm text-red-700">{loadError}</p>
        </div>
      )}

      {!loadError && (
        <div className="overflow-x-auto rounded border border-(--builder-color-border)">
          <table className="min-w-full text-sm">
            <thead className="bg-(--builder-color-surface) text-(--builder-color-text-muted) text-xs uppercase tracking-wide">
              <tr>
                <th className="px-4 py-2 text-left">
                  {t(translations, "builder.rsvp.responses.col.name", "Name")}
                </th>
                <th className="px-4 py-2 text-left">
                  {t(translations, "builder.rsvp.responses.col.email", "Email")}
                </th>
                <th className="px-4 py-2 text-left">
                  {t(translations, "builder.rsvp.responses.col.lang", "Lang")}
                </th>
                <th className="px-4 py-2 text-center">
                  {t(
                    translations,
                    "builder.rsvp.responses.col.max_guests",
                    "Max guests",
                  )}
                </th>
                <th className="px-4 py-2 text-center">
                  {t(
                    translations,
                    "builder.rsvp.responses.col.active",
                    "Active",
                  )}
                </th>
                <th className="px-4 py-2 text-left">
                  {t(
                    translations,
                    "builder.rsvp.responses.col.status",
                    "Status",
                  )}
                </th>
                <th className="px-4 py-2 text-center">
                  {t(
                    translations,
                    "builder.rsvp.responses.col.headcount",
                    "Headcount",
                  )}
                </th>
                <th className="px-4 py-2 text-left">
                  {t(
                    translations,
                    "builder.rsvp.responses.col.comment",
                    "Comment",
                  )}
                </th>
                <th className="px-4 py-2 text-left">
                  {t(
                    translations,
                    "builder.rsvp.responses.col.meal_intolerances",
                    "Dietary",
                  )}
                </th>
                <th className="px-4 py-2 text-left">
                  {t(
                    translations,
                    "builder.rsvp.responses.col.song_request",
                    "Song request",
                  )}
                </th>
                <th className="px-4 py-2 text-left">
                  {t(
                    translations,
                    "builder.rsvp.responses.col.updated",
                    "Updated",
                  )}
                </th>
                <th className="px-4 py-2" />
              </tr>
            </thead>

            <tbody className="divide-y divide-(--builder-color-border) bg-white">
              {loading && rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={12}
                    className="px-4 py-6 text-center text-(--builder-color-text-muted)"
                  >
                    {t(
                      translations,
                      "builder.rsvp.responses.loading",
                      "Loading…",
                    )}
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={12}
                    className="px-4 py-6 text-center text-(--builder-color-text-muted)"
                  >
                    {t(
                      translations,
                      "builder.rsvp.responses.empty",
                      "No responses found.",
                    )}
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={row.party.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 font-medium text-(--builder-color-text)">
                      {row.party.name}
                    </td>
                    <td className="px-4 py-2 text-(--builder-color-text-muted)">
                      {row.party.email}
                    </td>
                    <td className="px-4 py-2 text-(--builder-color-text-muted) uppercase text-xs">
                      {row.party.preferred_lang}
                    </td>
                    <td className="px-4 py-2 text-center text-(--builder-color-text)">
                      {row.party.max_guests}
                    </td>
                    <td className="px-4 py-2 text-center">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                          row.party.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {row.party.is_active
                          ? t(
                              translations,
                              "builder.rsvp.responses.guest.active",
                              "Active",
                            )
                          : t(
                              translations,
                              "builder.rsvp.responses.guest.inactive",
                              "Inactive",
                            )}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-(--builder-color-text-muted)">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusBadgeClass(
                          row.state.status,
                        )}`}
                      >
                        {statusLabelMap.get(row.state.status) ??
                          row.state.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-center text-(--builder-color-text)">
                      {row.state.headcount ?? "-"}
                    </td>
                    <td className="px-4 py-2 text-(--builder-color-text-muted) max-w-[220px] truncate">
                      {row.state.comment || "-"}
                    </td>
                    <td className="px-4 py-2 text-(--builder-color-text-muted) max-w-45 truncate">
                      {row.state.meal_intolerances || "-"}
                    </td>
                    <td className="px-4 py-2 text-(--builder-color-text-muted) max-w-45 truncate">
                      {row.state.song_request || "-"}
                    </td>
                    <td className="px-4 py-2 text-(--builder-color-text-muted) text-xs">
                      {formatDateTime(row.state.updated_at)}
                    </td>
                    <td className="px-4 py-2 text-right">
                      <BuilderButton
                        variant="secondary"
                        size="sm"
                        onClick={() => openDetails(row)}
                      >
                        {t(
                          translations,
                          "builder.rsvp.responses.action.view",
                          "View",
                        )}
                      </BuilderButton>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {!loadError && totalPages > 1 && (
        <div className="flex items-center gap-3 justify-end">
          <BuilderButton
            variant="secondary"
            size="sm"
            disabled={page <= 1 || loading}
            onClick={() => setPage((prev) => prev - 1)}
          >
            {t(translations, "builder.rsvp.responses.page.prev", "Previous")}
          </BuilderButton>
          <span className="text-sm text-(--builder-color-text-muted)">
            {t(translations, "builder.rsvp.responses.page.label", "Page")}{" "}
            {page} {t(translations, "builder.rsvp.responses.page.of", "of")}{" "}
            {totalPages}
          </span>
          <BuilderButton
            variant="secondary"
            size="sm"
            disabled={page >= totalPages || loading}
            onClick={() => setPage((prev) => prev + 1)}
          >
            {t(translations, "builder.rsvp.responses.page.next", "Next")}
          </BuilderButton>
        </div>
      )}

      <MainModal
        open={detailOpen}
        onClose={closeDetails}
        title={t(
          translations,
          "builder.rsvp.responses.modal.title",
          "Response details",
        )}
      >
        {!selectedRow ? null : (
          <div className="space-y-5">
            <section className="rounded border border-(--builder-color-border) bg-(--builder-color-surface) p-4 space-y-2">
              <h4 className="text-sm font-semibold text-(--builder-color-text)">
                {t(translations, "builder.rsvp.responses.modal.guest", "Guest")}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                <p className="text-(--builder-color-text)">
                  <span className="font-medium">
                    {t(translations, "builder.rsvp.responses.col.name", "Name")}
                    :{"  "}
                  </span>
                  {selectedRow.party.name}
                </p>
                <p className="text-(--builder-color-text)">
                  <span className="font-medium">
                    {t(
                      translations,
                      "builder.rsvp.responses.col.email",
                      "Email",
                    )}
                    :{" "}
                  </span>
                  {selectedRow.party.email}
                </p>
                <p className="text-(--builder-color-text)">
                  <span className="font-medium">
                    {t(
                      translations,
                      "builder.rsvp.responses.col.status",
                      "Status",
                    )}
                    :{" "}
                  </span>
                  {statusLabelMap.get(selectedRow.state.status) ??
                    selectedRow.state.status}
                </p>
                <p className="text-(--builder-color-text)">
                  <span className="font-medium">
                    {t(
                      translations,
                      "builder.rsvp.responses.col.headcount",
                      "Headcount",
                    )}
                    :{" "}
                  </span>
                  {selectedRow.state.headcount ?? "-"}
                </p>
              </div>
              <p className="text-sm text-(--builder-color-text)">
                <span className="font-medium">
                  {t(
                    translations,
                    "builder.rsvp.responses.col.comment",
                    "Comment",
                  )}
                  :{" "}
                </span>
                {selectedRow.state.comment || "-"}
              </p>
              <p className="text-sm text-(--builder-color-text)">
                <span className="font-medium">
                  {t(
                    translations,
                    "builder.rsvp.responses.col.meal_intolerances",
                    "Dietary",
                  )}
                  :{" "}
                </span>
                {selectedRow.state.meal_intolerances || "-"}
              </p>
              <p className="text-sm text-(--builder-color-text)">
                <span className="font-medium">
                  {t(
                    translations,
                    "builder.rsvp.responses.col.song_request",
                    "Song request",
                  )}
                  :{" "}
                </span>
                {selectedRow.state.song_request || "-"}
              </p>
              <p className="text-xs text-(--builder-color-text-muted)">
                {t(
                  translations,
                  "builder.rsvp.responses.col.updated",
                  "Updated",
                )}
                : {formatDateTime(selectedRow.state.updated_at)}
              </p>
            </section>

            <section className="space-y-3">
              <h4 className="text-sm font-semibold text-(--builder-color-text)">
                {t(
                  translations,
                  "builder.rsvp.responses.modal.submissions",
                  "Submission history",
                )}
              </h4>

              {submissionsError && (
                <div className="rounded border border-red-300 bg-red-50 px-4 py-3">
                  <p className="text-sm text-red-700">{submissionsError}</p>
                </div>
              )}

              {!submissionsError &&
              submissionsLoading &&
              submissions.length === 0 ? (
                <p className="text-sm text-(--builder-color-text-muted)">
                  {t(
                    translations,
                    "builder.rsvp.responses.submissions.loading",
                    "Loading submissions…",
                  )}
                </p>
              ) : submissions.length === 0 ? (
                <p className="text-sm text-(--builder-color-text-muted)">
                  {t(
                    translations,
                    "builder.rsvp.responses.submissions.empty",
                    "No submissions yet.",
                  )}
                </p>
              ) : (
                <div className="space-y-3">
                  {submissions.map((submission) => (
                    <article
                      key={submission.id}
                      className="rounded border border-(--builder-color-border) bg-white p-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-(--builder-color-text-muted)">
                        <span>
                          {t(
                            translations,
                            "builder.rsvp.responses.submission.submitted_at",
                            "Submitted",
                          )}
                          : {formatDateTime(submission.submitted_at)}
                        </span>
                        <span className="uppercase">{submission.lang}</span>
                      </div>

                      <details className="mt-2 rounded border border-(--builder-color-border) bg-(--builder-color-muted-surface)">
                        <summary className="cursor-pointer px-3 py-2 text-sm text-(--builder-color-text)">
                          {t(
                            translations,
                            "builder.rsvp.responses.submission.payload",
                            "View payload",
                          )}
                        </summary>
                        <div className="border-t border-(--builder-color-border)">
                          <pre className="max-h-52 overflow-auto p-3 text-xs text-(--builder-color-text)">
                            {JSON.stringify(submission.payload ?? {}, null, 2)}
                          </pre>
                        </div>
                      </details>
                    </article>
                  ))}

                  {submissionsTotalPages > 1 && (
                    <div className="flex items-center justify-end gap-2">
                      <BuilderButton
                        variant="secondary"
                        size="sm"
                        disabled={submissionsPage <= 1 || submissionsLoading}
                        onClick={() => setSubmissionsPage((prev) => prev - 1)}
                      >
                        {t(
                          translations,
                          "builder.rsvp.responses.page.prev",
                          "Previous",
                        )}
                      </BuilderButton>

                      <span className="text-xs text-(--builder-color-text-muted)">
                        {t(
                          translations,
                          "builder.rsvp.responses.page.label",
                          "Page",
                        )}{" "}
                        {submissionsPage}{" "}
                        {t(
                          translations,
                          "builder.rsvp.responses.page.of",
                          "of",
                        )}{" "}
                        {submissionsTotalPages}
                      </span>

                      <BuilderButton
                        variant="secondary"
                        size="sm"
                        disabled={
                          submissionsPage >= submissionsTotalPages ||
                          submissionsLoading
                        }
                        onClick={() => setSubmissionsPage((prev) => prev + 1)}
                      >
                        {t(
                          translations,
                          "builder.rsvp.responses.page.next",
                          "Next",
                        )}
                      </BuilderButton>
                    </div>
                  )}
                </div>
              )}
            </section>
          </div>
        )}
      </MainModal>
    </div>
  );
}
