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
import type {
  AccommodationEntry,
  AccommodationFormValues,
  PlanType,
  Site,
} from "@/4-shared/types";
import { useEffect, useRef, useState } from "react";
import { StepLayout } from "../step-layout";

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
  translations,
  planType,
  setItemCount,
}: Props) {
  const [items, setItems] = useState<AccommodationEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isListOpen, setIsListOpen] = useState(true);

  const formRef = useRef<HTMLDivElement | null>(null);
  const accommodationLimit = getPlanLimit(planType, "accommodations");

  async function fetchAndApplyAccommodationEntries() {
    if (!site?.id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const rows = await fetchAccommodationEntries(site.id);
      setItems(rows ?? []);
    } catch (err: unknown) {
      setError((err as Error)?.message ?? String(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!site?.id) {
      setLoading(false);
      return;
    }
    fetchAndApplyAccommodationEntries();
  }, [site?.id]);

  // Notify parent whenever the item count changes (covers initial load + add/delete)
  useEffect(() => {
    setItemCount?.(items.length);
  }, [items.length, setItemCount]);

  function canAddMore() {
    return canUseQuota(planType, "accommodations", items.length);
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
      } else {
        const created = await createAccommodationEntry(site.id, form, planType);
        if (!created) throw new Error("Create failed");
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

      await Promise.resolve(refresh());
      await fetchAndApplyAccommodationEntries();
    } catch (err: unknown) {
      setError((err as Error)?.message ?? String(err));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (
      !confirm(
        translations["builder.accommodation.confirm_delete"] ||
          "Delete this accommodation entry?",
      )
    )
      return;

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

    await Promise.resolve(refresh());
    await fetchAndApplyAccommodationEntries();
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
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-medium">
          {translations["builder.accommodation.title"] || "Accommodation"}
        </h3>
        <div>
          <button
            className="px-1 py-1 bg-blue-600 text-white rounded disabled:opacity-50"
            onClick={() => startCreate()}
            disabled={!canAddMore()}
          >
            {translations["builder.accommodation.add"] || "+ Add accommodation"}
          </button>
        </div>
      </div>

      <div className="text-sm text-gray-600 mb-3">
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
                        <div className="text-xs text-gray-600 break-words">
                          {it.address ?? ""}
                        </div>
                        <div className="text-xs text-gray-600 break-words">
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
                        <button
                          className="text-xs font-medium px-3 py-1.5 rounded-md border border-gray-200 bg-white hover:bg-gray-50 active:scale-[0.98] transition"
                          onClick={() => startEdit(it)}
                        >
                          {translations["builder.actions.edit"] || "Edit"}
                        </button>
                        <button
                          className="text-xs font-medium px-3 py-1.5 rounded-md border border-red-200 text-red-600 bg-white hover:bg-red-50 active:scale-[0.98] transition"
                          onClick={() => handleDelete(it.id)}
                          disabled={saving}
                        >
                          {translations["builder.actions.delete"] || "Delete"}
                        </button>
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
            <div>
              <label className="block text-xs text-gray-600">
                {translations["builder.accommodation.field.name"] || "Name"}{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs text-gray-600">
                {translations["builder.accommodation.field.address"] ||
                  "Address (optional)"}
              </label>
              <input
                value={form.address ?? ""}
                onChange={(e) => updateField("address", e.target.value)}
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-600">
                {translations["builder.accommodation.field.notes"] ||
                  "Notes (optional)"}
              </label>
              <textarea
                value={form.notes ?? ""}
                onChange={(e) => updateField("notes", e.target.value)}
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-600">
                {translations["builder.accommodation.field.website"] ||
                  "Website (optional)"}
              </label>
              <input
                value={form.website ?? ""}
                onChange={(e) => updateField("website", e.target.value)}
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-600">
                {translations["builder.accommodation.field.phone"] ||
                  "Phone (optional)"}
              </label>
              <input
                value={form.phone ?? ""}
                onChange={(e) => updateField("phone", e.target.value)}
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-600">
                {translations["builder.accommodation.field.email"] ||
                  "Email (optional)"}
              </label>
              <input
                value={form.email ?? ""}
                onChange={(e) => updateField("email", e.target.value)}
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {error && <div className="text-red-600 mt-2">{error}</div>}
          </div>
        </div>
      )}

      {!canAddMore() && (
        <div className="mt-3 text-sm text-gray-600">
          {interpolate(
            translations["builder.accommodation.limit_reached_notice"] ||
              "Free plan limit reached ({limit}).",
            {
              limit: accommodationLimit,
              FREE_ACCOMMODATION_LIMIT: accommodationLimit,
            },
          )}{" "}
          <button className="underline text-blue-600">
            {translations["builder.accommodation.upgrade"] || "Upgrade"}
          </button>{" "}
          {translations["builder.accommodation.to_add_more"] || "to add more."}
        </div>
      )}
    </StepLayout>
  );
}
