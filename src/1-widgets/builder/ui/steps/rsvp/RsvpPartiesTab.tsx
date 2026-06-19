"use client";

import type { RsvpParty } from "@/3-entities/rsvp/model/types";
import { t } from "@/4-shared/helpers/t";
import { notify } from "@/4-shared/lib/toast/toast";
import type { PlanType } from "@/4-shared/types";
import { BuilderButton, UpgradeCTAModal } from "@/4-shared/ui/builder";
import MainModal from "@/4-shared/ui/commons/modals/MainModal";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  BulkGuestAddModal,
  type BulkGuestAddSummary,
} from "./BulkGuestAddModal";
import { PartyFormModal } from "./PartyFormModal";

type Props = {
  siteId: string;
  lang: string;
  translations: Record<string, string>;
  planType: PlanType;
};

type BulkInviteSummary = {
  mode: "all" | "unsent";
  totalCandidates: number;
  sent: number;
  skippedNoEmail: number;
  failed: number;
  errors: Array<{ partyId: string; error: string }>;
};

type BulkInviteJson = {
  success: boolean;
  summary?: BulkInviteSummary;
  error?: string;
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

export function RsvpPartiesTab({
  siteId,
  lang,
  translations,
  planType,
}: Props) {
  const router = useRouter();
  const isPremium = planType === "premium";
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
  const [bulkConfirmOpen, setBulkConfirmOpen] = useState(false);
  const [bulkSending, setBulkSending] = useState(false);
  const [bulkAddOpen, setBulkAddOpen] = useState(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [upgradeTarget, setUpgradeTarget] = useState<
    "bulk_add" | "bulk_invite"
  >("bulk_add");

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
                "builder.rsvp.guests.load.error",
                "Failed to load guests.",
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
            "builder.rsvp.guests.network.error",
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

  function openUpgradeModal(target: "bulk_add" | "bulk_invite") {
    setUpgradeTarget(target);
    setUpgradeModalOpen(true);
  }

  function goToPricing() {
    setUpgradeModalOpen(false);
    router.push(`/${lang || "en"}/pricing`);
  }

  function handleBulkAddClick() {
    if (!isPremium) {
      openUpgradeModal("bulk_add");
      return;
    }
    setBulkAddOpen(true);
  }

  function handleBulkInviteClick() {
    if (!isPremium) {
      openUpgradeModal("bulk_invite");
      return;
    }
    setBulkConfirmOpen(true);
  }

  function handleSaved(party: RsvpParty) {
    if (editingParty) {
      setParties((prev) => prev.map((p) => (p.id === party.id ? party : p)));
    } else {
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
              "builder.rsvp.guests.toggle.error",
              "Failed to update guest status.",
            ),
        );
      }
    } catch {
      setLoadError(
        t(
          translations,
          "builder.rsvp.guests.toggle.error",
          "Failed to update guest status.",
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
              "builder.rsvp.guests.invite.error",
              "Failed to send invite.",
            ),
        );
        return;
      }

      notify.success(
        t(translations, "builder.rsvp.guests.invite.success", "Invite sent."),
      );

      await fetchParties(page, activeSearch);
    } catch {
      notify.error(
        t(
          translations,
          "builder.rsvp.guests.invite.error",
          "Failed to send invite.",
        ),
      );
    } finally {
      setSendingInviteId(null);
    }
  }

  async function handleSendBulkInvites() {
    setBulkSending(true);
    try {
      const res = await fetch(`/api/sites/${siteId}/bulk-invite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "all" }),
      });

      const json = (await res.json()) as BulkInviteJson;

      if (!res.ok || !json.success || !json.summary) {
        notify.error(
          json.error ??
            t(
              translations,
              "builder.rsvp.guests.bulk_invite.error",
              "Failed to send bulk invites.",
            ),
        );
        return;
      }

      const { sent, skippedNoEmail, failed } = json.summary;

      notify.success(
        t(
          translations,
          "builder.rsvp.guests.bulk_invite.success_summary",
          `Bulk invites complete. Sent: ${sent}, skipped (no email): ${skippedNoEmail}, failed: ${failed}.`,
        ),
      );

      if (failed > 0) {
        notify.error(
          t(
            translations,
            "builder.rsvp.guests.bulk_invite.partial_failure",
            "Some invites failed. Please try again for remaining guests.",
          ),
        );
      }

      await fetchParties(page, activeSearch);
      setBulkConfirmOpen(false);
    } catch {
      notify.error(
        t(
          translations,
          "builder.rsvp.guests.bulk_invite.error",
          "Failed to send bulk invites.",
        ),
      );
    } finally {
      setBulkSending(false);
    }
  }

  async function handleBulkImported(summary: BulkGuestAddSummary) {
    await fetchParties(page, activeSearch);

    notify.success(
      t(
        translations,
        "builder.rsvp.guests.bulk_add.success_summary",
        `Guest import complete. Created: ${summary.created}, updated: ${summary.updated}, failed: ${summary.failed}.`,
      ),
    );

    if (summary.failed > 0) {
      notify.error(
        t(
          translations,
          "builder.rsvp.guests.bulk_add.partial_failure",
          "Some guest rows failed to import. Review the summary for details.",
        ),
      );
    }
  }

  const upgradeTitle =
    upgradeTarget === "bulk_add"
      ? t(
          translations,
          "builder.rsvp.guests.bulk_add.upgrade.title",
          "Bulk guest import is a Premium feature",
        )
      : t(
          translations,
          "builder.rsvp.guests.bulk_invite.upgrade.title",
          "Bulk invites are a Premium feature",
        );

  const upgradeDescription =
    upgradeTarget === "bulk_add"
      ? t(
          translations,
          "builder.rsvp.guests.bulk_add.upgrade.description",
          "Upgrade to Premium to upload or paste guest lists and add them in bulk.",
        )
      : t(
          translations,
          "builder.rsvp.guests.bulk_invite.upgrade.description",
          "Upgrade to Premium to send RSVP invites to all guests in one action.",
        );

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2 flex-1">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder={t(
              translations,
              "builder.rsvp.guests.search.placeholder",
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
            {t(translations, "builder.rsvp.guests.search.btn", "Search")}
          </BuilderButton>
        </div>
        <div className="flex flex-wrap items-center gap-2 justify-end">
          <BuilderButton
            variant="primary"
            size="sm"
            onClick={handleBulkAddClick}
            disabled={loading}
          >
            {t(
              translations,
              "builder.rsvp.guests.bulk_add.button",
              "Add guests in bulk",
            )}
          </BuilderButton>

          <BuilderButton variant="primary" size="sm" onClick={openAddModal}>
            {t(translations, "builder.rsvp.guest.modal.add", "Add guest")}
          </BuilderButton>
        </div>
      </div>
      {/* TODO: Add guest segments or list targeting when bulk actions expand beyond site-wide operations. */}
      <div className="flex flex-col gap-3 md:flex-row items-center justify-end">
        <BuilderButton
          variant="secondary"
          size="sm"
          onClick={handleBulkInviteClick}
          disabled={loading || bulkSending}
        >
          {bulkSending
            ? t(
                translations,
                "builder.rsvp.guests.bulk_invite.sending",
                "Sending bulk invites...",
              )
            : t(
                translations,
                "builder.rsvp.guests.bulk_invite.button",
                "Send bulk invites",
              )}
        </BuilderButton>
      </div>

      {loadError && (
        <div className="rounded border border-red-300 dark:border-red-800/50 bg-red-50 dark:bg-red-950/30 px-4 py-3">
          <p className="text-sm text-red-700 dark:text-red-400">{loadError}</p>
        </div>
      )}

      {!loadError && (
        <div className="overflow-x-auto rounded border border-(--builder-color-border)">
          <table className="min-w-full text-sm">
            <thead className="bg-(--builder-color-surface) text-(--builder-color-text-muted) text-xs uppercase tracking-wide">
              <tr>
                <th className="px-4 py-2 text-left">
                  {t(translations, "builder.rsvp.guests.col.name", "Name")}
                </th>
                <th className="px-4 py-2 text-left">
                  {t(translations, "builder.rsvp.guests.col.email", "Email")}
                </th>
                <th className="px-4 py-2 text-left">
                  {t(translations, "builder.rsvp.guests.col.lang", "Lang")}
                </th>
                <th className="px-4 py-2 text-center">
                  {t(
                    translations,
                    "builder.rsvp.guests.col.max_guests",
                    "Max guests",
                  )}
                </th>
                <th className="px-4 py-2 text-center">
                  {t(translations, "builder.rsvp.guests.col.active", "Active")}
                </th>
                <th className="px-4 py-2 text-left">
                  {t(
                    translations,
                    "builder.rsvp.guests.col.updated",
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
                    {t(translations, "builder.rsvp.guests.loading", "Loading…")}
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
                      "builder.rsvp.guests.empty",
                      "No guests yet.",
                    )}
                  </td>
                </tr>
              ) : (
                parties.map((party) => (
                  <tr key={party.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
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
                            ? "bg-green-100 text-green-800 dark:bg-green-950/30 dark:text-green-400"
                            : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                        }`}
                      >
                        {party.is_active
                          ? t(
                              translations,
                              "builder.rsvp.guests.status.active",
                              "Active",
                            )
                          : t(
                              translations,
                              "builder.rsvp.guests.status.inactive",
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
                            "builder.rsvp.guests.action.edit",
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
                                  "builder.rsvp.guests.action.resend",
                                  "Resend",
                                )
                              : t(
                                  translations,
                                  "builder.rsvp.guests.action.send_invite",
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
                                "builder.rsvp.guests.action.deactivate",
                                "Deactivate",
                              )
                            : t(
                                translations,
                                "builder.rsvp.guests.action.activate",
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

      {!loadError && totalPages > 1 && (
        <div className="flex items-center gap-3 justify-end">
          <BuilderButton
            variant="secondary"
            size="sm"
            disabled={page <= 1 || loading}
            onClick={() => setPage((p) => p - 1)}
          >
            {t(translations, "builder.rsvp.guests.page.prev", "Previous")}
          </BuilderButton>
          <span className="text-sm text-(--builder-color-text-muted)">
            {t(translations, "builder.rsvp.guests.page.label", "Page")} {page}{" "}
            {t(translations, "builder.rsvp.guests.page.of", "of")} {totalPages}
          </span>
          <BuilderButton
            variant="secondary"
            size="sm"
            disabled={page >= totalPages || loading}
            onClick={() => setPage((p) => p + 1)}
          >
            {t(translations, "builder.rsvp.guests.page.next", "Next")}
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

      <BulkGuestAddModal
        open={bulkAddOpen}
        onClose={() => setBulkAddOpen(false)}
        onImported={handleBulkImported}
        siteId={siteId}
        translations={translations}
        defaultPreferredLang={lang}
      />

      <MainModal
        open={bulkConfirmOpen}
        onClose={() => {
          if (!bulkSending) setBulkConfirmOpen(false);
        }}
        title={t(
          translations,
          "builder.rsvp.guests.bulk_invite.confirm.title",
          "Send bulk invites",
        )}
      >
        <div className="space-y-4">
          <p className="text-sm text-(--builder-color-text)">
            {t(
              translations,
              "builder.rsvp.guests.bulk_invite.confirm.body",
              "Are you sure you want to send RSVP invitations to all guests on this site?",
            )}
          </p>
          <div className="flex items-center justify-end gap-2">
            <BuilderButton
              variant="secondary"
              size="sm"
              onClick={() => setBulkConfirmOpen(false)}
              disabled={bulkSending}
            >
              {t(
                translations,
                "builder.rsvp.guests.bulk_invite.confirm.cancel",
                "Cancel",
              )}
            </BuilderButton>
            <BuilderButton
              variant="primary"
              size="sm"
              onClick={handleSendBulkInvites}
              disabled={bulkSending}
            >
              {bulkSending
                ? t(
                    translations,
                    "builder.rsvp.guests.bulk_invite.sending",
                    "Sending bulk invites...",
                  )
                : t(
                    translations,
                    "builder.rsvp.guests.bulk_invite.confirm.cta",
                    "Send bulk invites",
                  )}
            </BuilderButton>
          </div>
        </div>
      </MainModal>

      <UpgradeCTAModal
        open={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        onUpgrade={goToPricing}
        title={upgradeTitle}
        description={upgradeDescription}
        cancelLabel={t(translations, "common.cancel", "Cancel")}
        upgradeLabel={t(
          translations,
          "builder.upgrade.cta",
          "Upgrade to Premium",
        )}
      />
    </div>
  );
}
