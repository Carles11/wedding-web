"use client";

import type { RsvpParty } from "@/3-entities/rsvp/model/types";
import { t } from "@/4-shared/helpers/t";
import { notify } from "@/4-shared/lib/toast/toast";
import { BuilderButton } from "@/4-shared/ui/builder";
import { useCallback, useEffect, useState } from "react";
import { PartyFormModal } from "./PartyFormModal";

type Props = {
  siteId: string;
  translations: Record<string, string>;
};

const LIMIT = 20;

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

export function RsvpPartiesTab({ siteId, translations }: Props) {
  const [parties, setParties] = useState<RsvpParty[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingParty, setEditingParty] = useState<RsvpParty | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [sendingInviteId, setSendingInviteId] = useState<string | null>(null);

  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

  const fetchParties = useCallback(
    async (currentPage: number, q: string) => {
      setLoading(true);
      setLoadError(null);
      try {
        const params = new URLSearchParams({
          page: String(currentPage),
          limit: String(LIMIT),
        });
        if (q) params.set("q", q);
        const res = await fetch(
          `/api/sites/${siteId}/rsvp-parties?${params.toString()}`,
        );
        const json = (await res.json()) as {
          success: boolean;
          parties?: RsvpParty[];
          total?: number;
          error?: string;
        };
        if (!res.ok || !json.success) {
          setLoadError(
            json.error ??
              t(
                translations,
                "builder.rsvp.parties.load.error",
                "Failed to load parties.",
              ),
          );
        } else {
          setParties(json.parties ?? []);
          setTotal(json.total ?? 0);
        }
      } catch {
        setLoadError(
          t(
            translations,
            "builder.rsvp.parties.network.error",
            "Network error — please try again.",
          ),
        );
      } finally {
        setLoading(false);
      }
    },
    [siteId, translations],
  );

  useEffect(() => {
    fetchParties(page, activeSearch);
  }, [fetchParties, page, activeSearch]);

  function handleSearch() {
    setPage(1);
    setActiveSearch(searchInput);
  }

  function handleSearchKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  }

  function openAddModal() {
    setEditingParty(null);
    setModalOpen(true);
  }

  function openEditModal(party: RsvpParty) {
    setEditingParty(party);
    setModalOpen(true);
  }

  function handleSaved(party: RsvpParty) {
    if (editingParty) {
      // Replace in list
      setParties((prev) => prev.map((p) => (p.id === party.id ? party : p)));
    } else {
      // Prepend; adjust total
      setParties((prev) => [party, ...prev]);
      setTotal((prev) => prev + 1);
    }
  }

  async function handleToggleActive(party: RsvpParty) {
    setTogglingId(party.id);
    try {
      const res = await fetch(`/api/sites/${siteId}/rsvp-parties/${party.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !party.is_active }),
      });
      const json = (await res.json()) as {
        success: boolean;
        party?: RsvpParty;
        error?: string;
      };
      if (res.ok && json.success && json.party) {
        setParties((prev) =>
          prev.map((p) => (p.id === party.id ? json.party! : p)),
        );
      } else {
        setLoadError(
          json.error ??
            t(
              translations,
              "builder.rsvp.parties.toggle.error",
              "Failed to update party status.",
            ),
        );
      }
    } catch {
      setLoadError(
        t(
          translations,
          "builder.rsvp.parties.toggle.error",
          "Failed to update party status.",
        ),
      );
    } finally {
      setTogglingId(null);
    }
  }

  async function handleSendInvite(party: RsvpParty) {
    setSendingInviteId(party.id);
    try {
      const res = await fetch(
        `/api/sites/${siteId}/rsvp-parties/${party.id}/send-invite`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        },
      );

      const json = (await res.json()) as {
        success: boolean;
        error?: string;
      };

      if (!res.ok || !json.success) {
        notify.error(
          json.error ??
            t(
              translations,
              "builder.rsvp.parties.invite.error",
              "Failed to send invite.",
            ),
        );
        return;
      }

      notify.success(
        t(translations, "builder.rsvp.parties.invite.success", "Invite sent."),
      );

      await fetchParties(page, activeSearch);
    } catch {
      notify.error(
        t(
          translations,
          "builder.rsvp.parties.invite.error",
          "Failed to send invite.",
        ),
      );
    } finally {
      setSendingInviteId(null);
    }
  }

  return (
    <div className="space-y-4">
      {/* Header row */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder={t(
              translations,
              "builder.rsvp.parties.search.placeholder",
              "Search by name or email…",
            )}
            className="flex-1 max-w-xs border border-(--builder-color-border) rounded-md px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-(--builder-color-primary)"
          />
          <BuilderButton
            variant="secondary"
            size="sm"
            onClick={handleSearch}
            disabled={loading}
          >
            {t(translations, "builder.rsvp.parties.search.btn", "Search")}
          </BuilderButton>
        </div>
        <BuilderButton variant="primary" size="sm" onClick={openAddModal}>
          {t(translations, "builder.rsvp.parties.add.btn", "Add party")}
        </BuilderButton>
      </div>

      {/* Error */}
      {loadError && (
        <div className="rounded border border-red-300 bg-red-50 px-4 py-3">
          <p className="text-sm text-red-700">{loadError}</p>
        </div>
      )}

      {/* Table */}
      {!loadError && (
        <div className="overflow-x-auto rounded border border-(--builder-color-border)">
          <table className="min-w-full text-sm">
            <thead className="bg-(--builder-color-surface) text-(--builder-color-text-muted) text-xs uppercase tracking-wide">
              <tr>
                <th className="px-4 py-2 text-left">
                  {t(translations, "builder.rsvp.parties.col.name", "Name")}
                </th>
                <th className="px-4 py-2 text-left">
                  {t(translations, "builder.rsvp.parties.col.email", "Email")}
                </th>
                <th className="px-4 py-2 text-left">
                  {t(translations, "builder.rsvp.parties.col.lang", "Lang")}
                </th>
                <th className="px-4 py-2 text-center">
                  {t(
                    translations,
                    "builder.rsvp.parties.col.max_guests",
                    "Max guests",
                  )}
                </th>
                <th className="px-4 py-2 text-center">
                  {t(translations, "builder.rsvp.parties.col.active", "Active")}
                </th>
                <th className="px-4 py-2 text-left">
                  {t(
                    translations,
                    "builder.rsvp.parties.col.updated",
                    "Updated",
                  )}
                </th>
                <th className="px-4 py-2" />
              </tr>
            </thead>
            <tbody className="divide-y divide-(--builder-color-border) bg-white">
              {loading && parties.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-6 text-center text-(--builder-color-text-muted)"
                  >
                    {t(
                      translations,
                      "builder.rsvp.parties.loading",
                      "Loading…",
                    )}
                  </td>
                </tr>
              ) : parties.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-6 text-center text-(--builder-color-text-muted)"
                  >
                    {t(
                      translations,
                      "builder.rsvp.parties.empty",
                      "No parties yet.",
                    )}
                  </td>
                </tr>
              ) : (
                parties.map((party) => (
                  <tr key={party.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 font-medium text-(--builder-color-text)">
                      {party.name}
                    </td>
                    <td className="px-4 py-2 text-(--builder-color-text-muted)">
                      {party.email}
                    </td>
                    <td className="px-4 py-2 text-(--builder-color-text-muted) uppercase text-xs">
                      {party.preferred_lang}
                    </td>
                    <td className="px-4 py-2 text-center text-(--builder-color-text)">
                      {party.max_guests}
                    </td>
                    <td className="px-4 py-2 text-center">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                          party.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {party.is_active
                          ? t(
                              translations,
                              "builder.rsvp.parties.status.active",
                              "Active",
                            )
                          : t(
                              translations,
                              "builder.rsvp.parties.status.inactive",
                              "Inactive",
                            )}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-(--builder-color-text-muted) text-xs">
                      {formatDate(party.updated_at)}
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2 justify-end">
                        <BuilderButton
                          variant="secondary"
                          size="sm"
                          onClick={() => openEditModal(party)}
                        >
                          {t(
                            translations,
                            "builder.rsvp.parties.action.edit",
                            "Edit",
                          )}
                        </BuilderButton>
                        {party.is_active && (
                          <BuilderButton
                            variant="secondary"
                            size="sm"
                            disabled={
                              sendingInviteId === party.id ||
                              loading ||
                              !party.email.trim()
                            }
                            onClick={() => handleSendInvite(party)}
                          >
                            {party.access_code_hash
                              ? t(
                                  translations,
                                  "builder.rsvp.parties.action.resend",
                                  "Resend",
                                )
                              : t(
                                  translations,
                                  "builder.rsvp.parties.action.send_invite",
                                  "Send invite",
                                )}
                          </BuilderButton>
                        )}
                        <BuilderButton
                          variant="secondary"
                          size="sm"
                          tone={party.is_active ? "danger" : "default"}
                          disabled={togglingId === party.id}
                          onClick={() => handleToggleActive(party)}
                        >
                          {party.is_active
                            ? t(
                                translations,
                                "builder.rsvp.parties.action.deactivate",
                                "Deactivate",
                              )
                            : t(
                                translations,
                                "builder.rsvp.parties.action.activate",
                                "Activate",
                              )}
                        </BuilderButton>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {!loadError && totalPages > 1 && (
        <div className="flex items-center gap-3 justify-end">
          <BuilderButton
            variant="secondary"
            size="sm"
            disabled={page <= 1 || loading}
            onClick={() => setPage((p) => p - 1)}
          >
            {t(translations, "builder.rsvp.parties.page.prev", "Previous")}
          </BuilderButton>
          <span className="text-sm text-(--builder-color-text-muted)">
            {t(translations, "builder.rsvp.parties.page.label", "Page")} {page}{" "}
            {t(translations, "builder.rsvp.parties.page.of", "of")} {totalPages}
          </span>
          <BuilderButton
            variant="secondary"
            size="sm"
            disabled={page >= totalPages || loading}
            onClick={() => setPage((p) => p + 1)}
          >
            {t(translations, "builder.rsvp.parties.page.next", "Next")}
          </BuilderButton>
        </div>
      )}

      <PartyFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={handleSaved}
        editingParty={editingParty}
        translations={translations}
        siteId={siteId}
      />
    </div>
  );
}
