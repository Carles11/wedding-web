"use client";

import { interpolate } from "@/4-shared/helpers/interpolateVars";
import type {
  CreateWhatToSeePayload,
  PlanType,
  Site,
  WhatToSeeEntryFull,
  WhatToSeeTranslation,
} from "@/4-shared/types";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  createWhatToSeeEntry,
  deleteWhatToSeeEntry,
  fetchWhatToSeeEntries,
  updateWhatToSeeEntry,
} from "@/3-entities/what_to_see/api";
import {
  canUseQuota,
  getPlanLimit,
} from "@/4-shared/helpers/billing/entitlements";
import { useAlertConfirm } from "@/4-shared/hooks/useAlertConfirm";
import { notify } from "@/4-shared/lib/toast/toast";
import MainModal from "@/4-shared/ui/commons/modals/MainModal";
import { useRouter } from "next/navigation";
import { StepLayout } from "../step-layout";

type Props = {
  site: Site | null;
  refresh: () => void;
  lang: string;
  translations: Record<string, string>;
  planType: PlanType;
  /** Fired whenever the item count changes (initial load + add/delete). */
  setItemCount?: (count: number) => void;
};

function t(
  translations: Record<string, string>,
  key: string,
  fallback: string,
): string {
  return translations[key] || fallback;
}

export default function WhatToSeeBuilderStep({
  site,
  refresh,
  lang,
  translations,
  planType,
  setItemCount,
}: Props) {
  const router = useRouter();
  const fetchCounterRef = useRef(0);
  const [items, setItems] = useState<WhatToSeeEntryFull[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [showUpgradeCTA, setShowUpgradeCTA] = useState(false);
  const { confirm: confirmDelete, confirmDialog } = useAlertConfirm();

  const formRef = useRef<HTMLDivElement | null>(null);
  const whatToSeeLimit = getPlanLimit(planType, "whatToSee");

  function itemsSignature(rows: WhatToSeeEntryFull[]): string {
    return rows
      .map(
        (row) => `${row.id}:${row.sort_order ?? ""}:${row.location_url ?? ""}`,
      )
      .join("|");
  }

  async function reconcileItems(
    requestId: number,
    baselineRows: WhatToSeeEntryFull[],
    maxAttempts = 3,
  ) {
    if (!site?.id) return;

    let baselineSignature = itemsSignature(baselineRows);

    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      if (!site?.id || fetchCounterRef.current !== requestId) return;

      const nextRows = await fetchWhatToSeeEntries(site.id);
      const safeNextRows = nextRows ?? [];
      const nextSignature = itemsSignature(safeNextRows);

      if (nextSignature !== baselineSignature) {
        setItems(safeNextRows);
        baselineSignature = nextSignature;
      }
    }
  }

  const languages = useMemo(() => {
    if (!site) return ["en"];
    return site.languages && site.languages.length > 0
      ? site.languages
      : [site.default_lang ?? "en"];
  }, [site]);

  const defaultLang = site?.default_lang ?? languages[0] ?? "en";

  useEffect(() => {
    if (!site?.id) return;
    let mounted = true;
    const requestId = ++fetchCounterRef.current;

    const loadInitial = async () => {
      setLoading(true);
      setError(null);

      try {
        const rows = await fetchWhatToSeeEntries(site.id);
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

    loadInitial();

    return () => {
      mounted = false;
    };
  }, [site?.id]);

  // Notify parent whenever item count changes
  useEffect(() => {
    setItemCount?.(items.length);
  }, [items.length, setItemCount]);

  async function load() {
    if (!site?.id) return;
    setLoading(true);
    setError(null);
    try {
      const rows = await fetchWhatToSeeEntries(site.id);
      setItems(rows ?? []);
    } catch (err: unknown) {
      setError((err as Error)?.message ?? String(err));
    } finally {
      setLoading(false);
    }
  }

  function canAddMore() {
    return canUseQuota(planType, "whatToSee", items.length);
  }

  function goToPricing() {
    router.push(`/marketing/pricing?lang=${lang || "en"}`);
  }

  // Form state for the currently editing/creating item
  const [form, setForm] = useState<Partial<WhatToSeeEntryFull>>({});

  function scrollToForm() {
    setTimeout(() => {
      formRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 50);
  }

  function startCreate() {
    setEditingId(null);
    setForm({ name: {}, description: {}, notes: {}, location_url: "" });
    setCollapsed(true);
    scrollToForm();
  }

  function startEdit(it: WhatToSeeEntryFull) {
    setEditingId(it.id);
    setForm({ ...it });
    setCollapsed(true);
    scrollToForm();
  }

  function updateI18n(
    field: keyof WhatToSeeEntryFull,
    lang: string,
    value: string,
  ) {
    setForm((s) => {
      const prev = (s?.[field] as Record<string, string> | undefined) ?? {};
      return {
        ...(s ?? {}),
        [field]: { ...prev, [lang]: value },
      } as Partial<WhatToSeeEntryFull>;
    });
  }

  function updateField(
    field: keyof WhatToSeeEntryFull,
    value: WhatToSeeEntryFull[keyof WhatToSeeEntryFull],
  ) {
    setForm((s) => ({ ...(s ?? {}), [field]: value }));
  }

  async function handleSave() {
    if (!site?.id) return;

    const name = (form.name as Record<string, string> | undefined) ?? {};
    if (!name[defaultLang]) {
      setError(
        t(
          translations,
          "builder.what_to_see.error.required_name",
          `Name is required in ${defaultLang}`,
        ),
      );
      return;
    }

    if (!canAddMore() && !editingId) {
      setError(
        t(
          translations,
          "builder.what_to_see.error.limit",
          "Free limit reached. Upgrade to add more entries.",
        ),
      );
      return;
    }

    setSaving(true);
    setError(null);

    const payload: CreateWhatToSeePayload = {
      site_id: site.id,
      location_url: form.location_url ?? null,
      sort_order: form.sort_order ?? null,
    };

    const i18nFields = [
      { formKey: "name", dbKey: "title" },
      { formKey: "description", dbKey: "description" },
      { formKey: "notes", dbKey: "notes" },
    ] as const;

    const translationsDB: WhatToSeeTranslation[] = i18nFields.flatMap(
      ({ formKey, dbKey }) =>
        Object.entries(
          (form[formKey] as Record<string, string> | undefined) ?? {},
        ).map(([locale, value]) => ({
          key: dbKey,
          locale,
          value,
        })),
    );

    const updates = {
      location_url: form.location_url,
      sort_order: form.sort_order,
    };

    try {
      if (editingId) {
        const updated = await updateWhatToSeeEntry(
          site.id,
          editingId,
          updates,
          translationsDB,
        );
        if (!updated)
          throw new Error(
            t(
              translations,
              "builder.what_to_see.error.update_failed",
              "Update failed",
            ),
          );

        setItems((prev) =>
          prev.map((item) =>
            item.id === updated.id
              ? {
                  ...updated,
                  name: form.name ?? {},
                  description: form.description ?? {},
                  notes: form.notes ?? {},
                }
              : item,
          ),
        );

        notify.success(
          translations["builder.general.form.save_success"] ||
            "Saved successfully.",
        );
      } else {
        const created = await createWhatToSeeEntry(payload, translationsDB);
        if (!created)
          throw new Error(
            t(
              translations,
              "builder.what_to_see.error.create_failed",
              "Create failed",
            ),
          );

        setItems((prev) => [
          ...prev,
          {
            ...created,
            name: form.name ?? {},
            description: form.description ?? {},
            notes: form.notes ?? {},
          },
        ]);

        notify.success(
          translations["builder.general.form.save_success"] ||
            "Saved successfully.",
        );
      }

      setForm({});
      setEditingId(null);
      setCollapsed(false);
      // No refresh() here: doesn't change the sites table; local state is authoritative.
    } catch (err: unknown) {
      setError((err as Error)?.message ?? String(err));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    const okToDelete = await confirmDelete({
      title: t(translations, "builder.actions.delete", "Delete"),
      message: t(
        translations,
        "builder.what_to_see.confirm.delete",
        "Delete this entry?",
      ),
      confirmLabel: t(translations, "builder.actions.delete", "Delete"),
      cancelLabel: t(translations, "builder.actions.cancel", "Cancel"),
      tone: "danger",
    });
    if (!okToDelete) return;
    setSaving(true);
    const ok = await deleteWhatToSeeEntry(site?.id ?? "", id);
    setSaving(false);

    if (!ok) {
      setError(
        t(
          translations,
          "builder.what_to_see.error.delete_failed",
          "Failed to delete entry",
        ),
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
      translations={translations}
      onNext={
        editingId !== null || Object.keys(form).length > 0
          ? handleSave
          : undefined
      }
      nextLoading={saving}
      nextDisabled={saving}
      nextLabel={t(translations, "builder.what_to_see.save_button", "Save")}
      onBack={
        editingId !== null || Object.keys(form).length > 0
          ? () => {
              setForm({});
              setEditingId(null);
              setCollapsed(false);
            }
          : undefined
      }
      backLabel={t(translations, "builder.what_to_see.cancel_button", "Cancel")}
    >
      {/* Header */}
      <div className="mb-3 flex items-center justify-end">
        <button
          className={`px-3 py-1 text-white rounded ${
            canAddMore()
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-blue-400 cursor-pointer"
          }`}
          onClick={() => {
            if (!canAddMore()) {
              if (planType === "free") {
                setShowUpgradeCTA(true);
              }
              return;
            }
            startCreate();
          }}
          aria-disabled={!canAddMore()}
        >
          {t(translations, "builder.what_to_see.add_button", "+ Add place")}
        </button>
      </div>

      <div className="text-sm text-gray-600 mb-3">
        {interpolate(
          t(
            translations,
            "builder.what_to_see.limit_info",
            `Add up to ${whatToSeeLimit} recommended places.`,
          ),
          {
            limit: whatToSeeLimit,
            FREE_WHATTOSEE_LIMIT: whatToSeeLimit,
          },
        )}
      </div>

      {/* Collapsible list */}
      <div className="mb-2">
        <button
          onClick={() => setCollapsed((v) => !v)}
          className="text-xs text-gray-500 hover:text-gray-700"
        >
          {collapsed
            ? t(translations, "builder.what_to_see.show_button", "Show places")
            : t(translations, "builder.what_to_see.hide_button", "Hide places")}
        </button>
      </div>

      {!collapsed && (
        <>
          {loading ? (
            <p>{t(translations, "builder.what_to_see.loading", "Loading…")}</p>
          ) : items.length === 0 ? (
            <div className="text-sm text-gray-500">
              {t(translations, "builder.what_to_see.empty", "No entries yet.")}
            </div>
          ) : (
            <div className="space-y-2">
              {items.map((it) => (
                <div
                  key={it.id}
                  className="
                    group
                    border rounded-lg p-3
                    sm:p-0 sm:border-0 sm:rounded-none
                    flex flex-col sm:flex-row
                    sm:items-start sm:justify-between
                    gap-3 sm:gap-4
                    bg-white sm:bg-transparent
                  "
                >
                  <div className="min-w-0">
                    <div className="font-medium text-sm truncate">
                      {(typeof it.name === "string"
                        ? it.name
                        : it.name?.[defaultLang]) ??
                        t(
                          translations,
                          "builder.what_to_see.empty",
                          "(no name)",
                        )}
                    </div>

                    <div className="text-xs text-gray-600 line-clamp-2">
                      {(it.description && it.description[defaultLang]) || ""}
                    </div>

                    {it.location_url && (
                      <div className="text-xs text-blue-600 break-all mt-1">
                        <a
                          href={it.location_url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {it.location_url}
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <button
                      className="cursor-pointer text-xs font-medium px-3 py-1.5 rounded-md border border-gray-200 bg-white hover:bg-gray-50 transition"
                      onClick={() => startEdit(it)}
                    >
                      {t(translations, "builder.what_to_see.edit_edit", "Edit")}
                    </button>
                    <button
                      className="cursor-pointer text-xs font-medium px-3 py-1.5 rounded-md border border-red-200 text-red-600 bg-white hover:bg-red-50 transition"
                      onClick={() => handleDelete(it.id)}
                      disabled={saving}
                    >
                      {t(
                        translations,
                        "builder.what_to_see.delete_button",
                        "Delete",
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Form */}
      {(editingId !== null || Object.keys(form).length > 0) && (
        <div ref={formRef} className="mt-4 border rounded p-4 bg-gray-50">
          <h4 className="font-medium">
            {editingId
              ? t(translations, "builder.what_to_see.form.edit", "Edit place")
              : t(
                  translations,
                  "builder.what_to_see.form.create",
                  "Create place",
                )}
          </h4>

          <div className="mt-3 space-y-3">
            {languages.map((lang) => (
              <div
                key={lang}
                className={`
      rounded-xl shadow-sm border bg-white mb-5 p-6 transition
      ${lang === defaultLang ? "ring-2 ring-blue-600/10" : "hover:shadow-md"}
    `}
              >
                <div className="flex items-center mb-3">
                  <span className="uppercase text-xs tracking-widest text-blue-500 mr-2">
                    {lang.toUpperCase()}
                  </span>
                  {lang === defaultLang && (
                    <span className="ml-2 bg-blue-100 text-blue-700 text-xxs rounded px-2 py-0.5 font-semibold">
                      {t(
                        translations,
                        "builder.what_to_see.badge.default",
                        "Default",
                      )}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      {t(
                        translations,
                        "builder.what_to_see.field.name",
                        "Name",
                      )}{" "}
                      {lang === defaultLang && (
                        <span className="text-pink-500">
                          {t(
                            translations,
                            "builder.what_to_see.field.name.required",
                            "*",
                          )}
                        </span>
                      )}
                    </label>
                    <input
                      value={
                        (form.name as Record<string, string> | undefined)?.[
                          lang
                        ] ?? ""
                      }
                      onChange={(e) => updateI18n("name", lang, e.target.value)}
                      className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                      autoComplete="off"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      {t(
                        translations,
                        "builder.what_to_see.field.description",
                        "Description",
                      )}
                    </label>
                    <textarea
                      value={
                        (
                          form.description as Record<string, string> | undefined
                        )?.[lang] ?? ""
                      }
                      onChange={(e) =>
                        updateI18n("description", lang, e.target.value)
                      }
                      className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                      rows={2}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      {t(
                        translations,
                        "builder.what_to_see.field.notes",
                        "Notes",
                      )}
                    </label>
                    <textarea
                      value={
                        (form.notes as Record<string, string> | undefined)?.[
                          lang
                        ] ?? ""
                      }
                      onChange={(e) =>
                        updateI18n("notes", lang, e.target.value)
                      }
                      className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            ))}

            {/* Single Location URL input, after language blocks */}
            <div className="mb-5">
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                {t(
                  translations,
                  "builder.what_to_see.field.location_url",
                  "Location URL (Google Maps, etc)",
                )}
              </label>
              <input
                value={form.location_url ?? ""}
                onChange={(e) => updateField("location_url", e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                placeholder="https://maps.example.com/location"
                autoComplete="off"
              />
            </div>

            {error && (
              <div className="text-red-600 py-2 italic text-sm">{error}</div>
            )}
          </div>
        </div>
      )}

      {!canAddMore() && (
        <div className="mt-3 text-sm text-gray-600">
          {interpolate(
            t(
              translations,
              "builder.what_to_see.limit_reached",
              `Free plan limit reached (${whatToSeeLimit}).`,
            ),
            {
              limit: whatToSeeLimit,
              FREE_WHATTOSEE_LIMIT: whatToSeeLimit,
            },
          )}{" "}
          <button
            className="cursor-pointer underline text-blue-600"
            onClick={goToPricing}
          >
            {t(translations, "builder.what_to_see.button.upgrade", "Upgrade")}
          </button>
        </div>
      )}

      <MainModal
        open={showUpgradeCTA && planType === "free"}
        title={
          translations["builder.general.form.need_more_langs"] ||
          "Need more languages?"
        }
        onClose={() => setShowUpgradeCTA(false)}
      >
        <p className="text-sm text-gray-700 mb-5">
          {translations["builder.general.form.upgrade_description"] ||
            "Your current plan only allows one language. Upgrade to Premium to unlock all languages for your wedding site."}
        </p>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition"
            onClick={() => setShowUpgradeCTA(false)}
          >
            {translations["builder.general.form.cancel"] || "Cancel"}
          </button>
          <button
            type="button"
            className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition"
            onClick={goToPricing}
          >
            {translations["builder.general.form.upgrade"] ||
              "Upgrade to Premium"}
          </button>
        </div>
      </MainModal>
      {confirmDialog}
    </StepLayout>
  );
}
