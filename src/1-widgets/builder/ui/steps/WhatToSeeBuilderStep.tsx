"use client";

import {
  SUPPORTED_LANGUAGE_LABELS,
  type SupportedLanguage,
} from "@/4-shared/config/i18n";
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
import { t } from "@/4-shared/helpers/t";
import { useAlertConfirm } from "@/4-shared/hooks/useAlertConfirm";
import { notify } from "@/4-shared/lib/toast/toast";
import {
  BuilderButton,
  BuilderFormCard,
  BuilderLanguageCard,
  PlanLimitNotice,
  UpgradeCTAModal,
} from "@/4-shared/ui/builder";
import {
  BuilderTextInput,
  BuilderTextarea,
} from "@/4-shared/ui/builder/inputs";
import { useRouter } from "next/navigation";
import { StepLayout } from "../../step-layout";

type Props = {
  site: Site | null;
  refresh: () => void;
  lang: string;
  translations: Record<string, string>;
  planType: PlanType;
  /** Fired whenever the item count changes (initial load + add/delete). */
  setItemCount?: (count: number) => void;
};

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
    // Use language-prefixed routing, not query param
    router.push(`/${lang || "en"}/pricing`);
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
          {t(translations, "builder.what_to_see.add_button", "+ Add place")}
        </BuilderButton>
      </div>

      <div className="mb-4 text-md text-gray-600">
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
                    <BuilderButton
                      variant="secondary"
                      size="sm"
                      onClick={() => startEdit(it)}
                    >
                      {t(translations, "builder.what_to_see.edit_edit", "Edit")}
                    </BuilderButton>
                    <BuilderButton
                      variant="secondary"
                      tone="danger"
                      size="sm"
                      onClick={() => handleDelete(it.id)}
                      disabled={saving}
                    >
                      {t(
                        translations,
                        "builder.what_to_see.delete_button",
                        "Delete",
                      )}
                    </BuilderButton>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Form */}
      {(editingId !== null || Object.keys(form).length > 0) && (
        <div ref={formRef}>
          <BuilderFormCard
            title={
              editingId
                ? t(translations, "builder.what_to_see.form.edit", "Edit place")
                : t(
                    translations,
                    "builder.what_to_see.form.create",
                    "Create place",
                  )
            }
            error={error}
          >
            {languages.map((locale) => (
              <BuilderLanguageCard
                key={locale}
                languageCode={locale.toUpperCase()}
                title={interpolate(
                  t(
                    translations,
                    "builder.general.form.language_fields_for",
                    "Fields for {language}",
                  ),
                  {
                    language: `${SUPPORTED_LANGUAGE_LABELS[locale as SupportedLanguage] ?? locale} (${locale})`,
                  },
                )}
                isDefault={locale === defaultLang}
                defaultBadgeLabel={t(
                  translations,
                  "builder.what_to_see.badge.default",
                  "Default",
                )}
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <BuilderTextInput
                    label={`${t(translations, "builder.what_to_see.field.name", "Name")}${locale === defaultLang ? " *" : ""}`}
                    value={
                      (form.name as Record<string, string> | undefined)?.[
                        locale
                      ] ?? ""
                    }
                    onChange={(v) => updateI18n("name", locale, v)}
                    autoComplete="off"
                  />

                  <BuilderTextarea
                    label={t(
                      translations,
                      "builder.what_to_see.field.description",
                      "Description",
                    )}
                    value={
                      (
                        form.description as Record<string, string> | undefined
                      )?.[locale] ?? ""
                    }
                    onChange={(v) => updateI18n("description", locale, v)}
                    rows={2}
                  />

                  <div className="sm:col-span-2">
                    <BuilderTextarea
                      label={t(
                        translations,
                        "builder.what_to_see.field.notes",
                        "Notes",
                      )}
                      value={
                        (form.notes as Record<string, string> | undefined)?.[
                          locale
                        ] ?? ""
                      }
                      onChange={(v) => updateI18n("notes", locale, v)}
                      rows={2}
                    />
                  </div>
                </div>
              </BuilderLanguageCard>
            ))}

            <BuilderTextInput
              label={t(
                translations,
                "builder.what_to_see.field.location_url",
                "Location URL (Google Maps, etc)",
              )}
              value={form.location_url ?? ""}
              onChange={(v) => updateField("location_url", v)}
              placeholder="https://maps.example.com/location"
              autoComplete="off"
            />
          </BuilderFormCard>
        </div>
      )}

      {!canAddMore() && (
        <PlanLimitNotice
          message={interpolate(
            t(
              translations,
              "builder.what_to_see.limit_reached",
              `Free plan limit reached (${whatToSeeLimit}).`,
            ),
            {
              limit: whatToSeeLimit,
              FREE_WHATTOSEE_LIMIT: whatToSeeLimit,
            },
          )}
          upgradeLabel={t(
            translations,
            "builder.what_to_see.button.upgrade",
            "Upgrade",
          )}
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
