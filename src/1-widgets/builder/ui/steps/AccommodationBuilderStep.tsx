"use client";

import {
  createAccommodationEntry,
  deleteAccommodationEntry,
  fetchAccommodationEntries,
  updateAccommodationEntry,
} from "@/3-entities/accommodation/api";
import {
  canUseQuota,
  getPlanLimit,
} from "@/4-shared/helpers/billing/entitlements";
import { interpolate } from "@/4-shared/helpers/interpolateVars";
import { useAlertConfirm } from "@/4-shared/hooks/useAlertConfirm";
import { notify } from "@/4-shared/lib/toast/toast";
import type {
  AccommodationEntry,
  AccommodationFormValues,
  PlanType,
  Site,
} from "@/4-shared/types";
import {
  BuilderButton,
  PlanLimitNotice,
  UpgradeCTAModal,
} from "@/4-shared/ui/builder";
import {
  BuilderTextInput,
  BuilderTextarea,
} from "@/4-shared/ui/builder/inputs";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { StepLayout } from "../../step-layout";

type Props = {
  site: Site | null;
  refresh: () => void;
  lang: string;
  translations: Record<string, string>;
  planType: PlanType;
  /** Fired whenever the accommodation item count changes (initial load + add/delete). */
  setItemCount?: (count: number) => void;
};

export default function AccommodationBuilderStep({
  site,
  refresh,
  lang,
  translations,
  planType,
  setItemCount,
}: Props) {
  const router = useRouter();
  const fetchCounterRef = useRef(0);
  const [items, setItems] = useState<AccommodationEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isListOpen, setIsListOpen] = useState(true);
  const [showUpgradeCTA, setShowUpgradeCTA] = useState(false);
  const { confirm: confirmDelete, confirmDialog } = useAlertConfirm();

  const formRef = useRef<HTMLDivElement | null>(null);
  const accommodationLimit = getPlanLimit(planType, "accommodations");

  function itemsSignature(rows: AccommodationEntry[]): string {
    return rows
      .map((row) => `${row.id}:${row.updated_at ?? ""}:${row.created_at ?? ""}`)
      .join("|");
  }

  async function reconcileItems(
    requestId: number,
    baselineRows: AccommodationEntry[],
    maxAttempts = 3,
  ) {
    if (!site?.id) return;

    let baselineSignature = itemsSignature(baselineRows);

    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      if (!site?.id || fetchCounterRef.current !== requestId) return;

      const nextRows = await fetchAccommodationEntries(site.id);
      const safeNextRows = nextRows ?? [];
      const nextSignature = itemsSignature(safeNextRows);

      if (nextSignature !== baselineSignature) {
        setItems(safeNextRows);
        baselineSignature = nextSignature;
      }
    }
  }

  useEffect(() => {
    if (!site?.id) return;
    let mounted = true;
    const requestId = ++fetchCounterRef.current;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const rows = await fetchAccommodationEntries(site.id);
        if (!mounted || fetchCounterRef.current !== requestId) return;

        const safeRows = rows ?? [];
        setItems(safeRows);
        await reconcileItems(requestId, safeRows);
      } catch (err: unknown) {
        if (mounted && fetchCounterRef.current === requestId) {
          setError((err as Error)?.message ?? String(err));
        }
      } finally {
        if (mounted && fetchCounterRef.current === requestId) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [site?.id]);

  // Notify parent whenever the item count changes (covers initial load + add/delete)
  useEffect(() => {
    setItemCount?.(items.length);
  }, [items.length, setItemCount]);

  function canAddMore() {
    return canUseQuota(planType, "accommodations", items.length);
  }

  function goToPricing() {
    router.push(`/marketing/pricing?lang=${lang || "en"}`);
  }

  function scrollToForm() {
    requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function startCreate() {
    setEditingId(null);
    setForm({
      name: "",
      address: "",
      notes: "",
      website: "",
      phone: "",
      email: "",
    });
    setIsListOpen(false);
    scrollToForm();
  }

  function startEdit(item: AccommodationEntry) {
    setEditingId(item.id);
    setForm({
      name: item.name ?? "",
      address: item.address ?? "",
      notes: item.notes ?? "",
      website: item.website ?? "",
      phone: item.phone ?? "",
      email: item.email ?? "",
    });
    setIsListOpen(false);
    scrollToForm();
  }

  const [form, setForm] = useState<AccommodationFormValues>({
    name: "",
    address: "",
    notes: "",
    website: "",
    phone: "",
    email: "",
    sort_order: undefined,
  });

  function updateField<K extends keyof AccommodationFormValues>(
    field: K,
    value: AccommodationFormValues[K],
  ) {
    setForm({ ...form, [field]: value });
  }

  async function handleSave() {
    if (!site?.id) return;

    if (!form.name || form.name.trim() === "") {
      setError(
        translations["builder.accommodation.error.name_required"] ||
          "Name is required.",
      );
      return;
    }

    if (!canAddMore() && !editingId) {
      setError(
        interpolate(
          translations["builder.accommodation.error.limit_reached"] ||
            "Free limit reached. Upgrade to add more accommodations.",
          {
            limit: accommodationLimit,
            FREE_ACCOMMODATION_LIMIT: accommodationLimit,
          },
        ),
      );
      return;
    }

    setSaving(true);
    setError(null);

    try {
      if (editingId) {
        const updated = await updateAccommodationEntry(
          site.id,
          editingId,
          form,
        );
        if (!updated) throw new Error("Update failed");
        setItems((prev) => prev.map((i) => (i.id === editingId ? updated : i)));
        notify.success(
          translations["builder.general.form.save_success"] ||
            "Saved successfully.",
        );
      } else {
        const created = await createAccommodationEntry(site.id, form, planType);
        if (!created) throw new Error("Create failed");
        setItems((prev) => [...prev, created]);
        notify.success(
          translations["builder.general.form.save_success"] ||
            "Saved successfully.",
        );
      }

      setEditingId(null);
      setForm({
        name: "",
        address: "",
        notes: "",
        website: "",
        phone: "",
        email: "",
      });
      setIsListOpen(true);
    } catch (err: unknown) {
      setError((err as Error)?.message ?? String(err));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    const okToDelete = await confirmDelete({
      title: translations["builder.actions.delete"] || "Delete",
      message:
        translations["builder.accommodation.confirm_delete"] ||
        "Delete this accommodation entry?",
      confirmLabel: translations["builder.actions.delete"] || "Delete",
      cancelLabel: translations["builder.actions.cancel"] || "Cancel",
      tone: "danger",
    });
    if (!okToDelete) return;

    setSaving(true);
    const ok = await deleteAccommodationEntry(site?.id ?? "", id);
    setSaving(false);

    if (!ok) {
      setError(
        translations["builder.accommodation.error.delete_failed"] ||
          "Failed to delete",
      );
      return;
    }
    setItems((prev) => prev.filter((item) => item.id !== id));
    notify.success(
      translations["common.delete_success"] || "Deleted successfully.",
    );
  }

  return (
    <StepLayout
      onNext={
        editingId !== null || form.name.length > 0 ? handleSave : undefined
      }
      nextLoading={saving}
      nextDisabled={saving}
      nextLabel={translations["builder.actions.save"] || "Save"}
      onBack={
        !isListOpen
          ? () => {
              setForm({
                name: "",
                address: "",
                notes: "",
                website: "",
                phone: "",
                email: "",
              });
              setEditingId(null);
              setIsListOpen(true);
            }
          : undefined
      }
      backLabel={translations["builder.actions.cancel"] || "Cancel"}
      translations={translations}
    >
      <div className="mb-3 flex items-center justify-end">
        <div>
          <BuilderButton
            variant="primary"
            size="sm"
            onClick={() => {
              if (!canAddMore()) {
                if (planType === "free") {
                  setShowUpgradeCTA(true);
                }
                return;
              }
              startCreate();
            }}
            disabled={!canAddMore()}
          >
            {translations["builder.accommodation.add_button"] ||
              "+ Add accommodation"}
          </BuilderButton>
        </div>
      </div>

      <div className="mb-4 text-md text-gray-600">
        {interpolate(
          translations["builder.accommodation.description"] ||
            "Add hotels or places to stay. Free plan allows up to {limit} entries.",
          {
            limit: accommodationLimit,
            FREE_ACCOMMODATION_LIMIT: accommodationLimit,
          },
        )}
      </div>

      <div className="mb-2">
        <button
          className="text-sm font-medium text-gray-700 hover:text-gray-900 flex items-center gap-2"
          onClick={() => setIsListOpen((s) => !s)}
        >
          <span>{isListOpen ? "▼" : "▶"}</span>
          <span>
            {interpolate(
              translations["builder.accommodation.existing"] ||
                "Existing accommodations ({count})",
              { count: items.length },
            )}
          </span>
        </button>
      </div>

      {isListOpen && (
        <>
          {loading ? (
            <p>{translations["common.loading"] || "Loading…"}</p>
          ) : (
            <div className="space-y-3">
              {items.length === 0 ? (
                <div className="text-sm text-gray-500">
                  {translations["builder.accommodation.empty"] ||
                    "No accommodations yet."}
                </div>
              ) : (
                <div className="space-y-2">
                  {items.map((it) => (
                    <div
                      key={it.id}
                      className="group border rounded-lg p-3 sm:p-0 sm:border-0 sm:rounded-none flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 bg-white sm:bg-transparent"
                    >
                      <div className="min-w-0">
                        <div className="font-medium text-sm truncate">
                          {it.name ??
                            (translations["builder.accommodation.no_name"] ||
                              "(no name)")}
                        </div>
                        <div className="text-xs text-gray-600 wrap-break-word">
                          {it.address ?? ""}
                        </div>
                        <div className="text-xs text-gray-600 wrap-break-word">
                          {it.notes ?? ""}
                        </div>
                        {it.website && (
                          <div className="text-xs text-blue-600 break-all mt-1">
                            <a
                              href={it.website}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {it.website}
                            </a>
                          </div>
                        )}
                        {it.phone && (
                          <div className="text-xs text-gray-600 mt-0.5">
                            <span>
                              {translations["builder.accommodation.phone"] ||
                                "Phone"}
                              : {it.phone}
                            </span>
                          </div>
                        )}
                        {it.email && (
                          <div className="text-xs text-gray-600 mt-0.5 break-all">
                            <span>
                              {translations["builder.accommodation.email"] ||
                                "Email"}
                              : {it.email}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <BuilderButton
                          variant="secondary"
                          size="sm"
                          onClick={() => startEdit(it)}
                        >
                          {translations["builder.actions.edit"] || "Edit"}
                        </BuilderButton>
                        <BuilderButton
                          variant="secondary"
                          tone="danger"
                          size="sm"
                          onClick={() => handleDelete(it.id)}
                          disabled={saving}
                        >
                          {translations["builder.actions.delete"] || "Delete"}
                        </BuilderButton>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {!isListOpen && (
        <div ref={formRef} className="mt-4 border rounded p-4 bg-gray-50">
          <h4 className="font-medium">
            {editingId
              ? translations["builder.accommodation.edit"] ||
                "Edit accommodation"
              : translations["builder.accommodation.create"] ||
                "Create accommodation"}
          </h4>

          <div className="mt-3 space-y-3">
            <BuilderTextInput
              label={translations["builder.accommodation.field.name"] || "Name"}
              value={form.name}
              onChange={(v) => updateField("name", v)}
              required
            />

            <BuilderTextInput
              label={
                translations["builder.accommodation.field.address"] ||
                "Address (optional)"
              }
              value={form.address ?? ""}
              onChange={(v) => updateField("address", v)}
            />

            <BuilderTextarea
              label={
                translations["builder.accommodation.field.notes"] ||
                "Notes (optional)"
              }
              value={form.notes ?? ""}
              onChange={(v) => updateField("notes", v)}
              rows={2}
            />

            <BuilderTextInput
              label={
                translations["builder.accommodation.field.website"] ||
                "Website (optional)"
              }
              value={form.website ?? ""}
              onChange={(v) => updateField("website", v)}
            />

            <BuilderTextInput
              label={
                translations["builder.accommodation.field.phone"] ||
                "Phone (optional)"
              }
              value={form.phone ?? ""}
              onChange={(v) => updateField("phone", v)}
            />

            <BuilderTextInput
              label={
                translations["builder.accommodation.field.email"] ||
                "Email (optional)"
              }
              value={form.email ?? ""}
              onChange={(v) => updateField("email", v)}
            />

            {error && <div className="text-red-600 mt-2">{error}</div>}
          </div>
        </div>
      )}

      {!canAddMore() && (
        <PlanLimitNotice
          message={interpolate(
            translations["builder.accommodation.limit_reached_notice"] ||
              "Free plan limit reached ({limit}).",
            {
              limit: accommodationLimit,
              FREE_ACCOMMODATION_LIMIT: accommodationLimit,
            },
          )}
          upgradeLabel={
            translations["builder.accommodation.upgrade"] || "Upgrade"
          }
          onUpgrade={goToPricing}
        />
      )}

      <UpgradeCTAModal
        open={showUpgradeCTA && planType === "free"}
        title={
          translations["builder.general.form.need_more_langs"] ||
          "Need more languages?"
        }
        description={
          translations["builder.general.form.upgrade_description"] ||
          "Your current plan only allows one language. Upgrade to Premium to unlock all languages for your wedding site."
        }
        cancelLabel={translations["builder.general.form.cancel"] || "Cancel"}
        upgradeLabel={
          translations["builder.general.form.upgrade"] || "Upgrade to Premium"
        }
        onClose={() => setShowUpgradeCTA(false)}
        onUpgrade={goToPricing}
      />
      {confirmDialog}
    </StepLayout>
  );
}
