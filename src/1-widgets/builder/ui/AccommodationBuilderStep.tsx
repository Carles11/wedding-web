"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Site, AccommodationEntry } from "@/4-shared/types";
import {
  fetchAccommodationEntries,
  createAccommodationEntry,
  updateAccommodationEntry,
  deleteAccommodationEntry,
} from "@/3-entities/accommodation/api";
import { FREE_ACCOMMODATION_LIMIT } from "@/4-shared/config/limits/usage-limits";

type Props = {
  site: Site | null;
  refresh: () => void;
  lang: string;
  translations: Record<string, string>;
};

export default function AccommodationBuilderStep({ site, refresh }: Props) {
  const [items, setItems] = useState<AccommodationEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isListOpen, setIsListOpen] = useState(true);

  const formRef = useRef<HTMLDivElement | null>(null);

  const languages = useMemo(() => {
    if (!site) return ["en"];
    return site.languages && site.languages.length > 0
      ? site.languages
      : [site.default_lang ?? "en"];
  }, [site]);
  const defaultLang = site?.default_lang ?? languages[0] ?? "en";

  useEffect(() => {
    if (!site?.id) return;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [site?.id]);

  async function load() {
    if (!site?.id) return;
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

  function canAddMore() {
    return items.length < FREE_ACCOMMODATION_LIMIT;
  }

  function scrollToForm() {
    requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function startCreate() {
    setEditingId(null);
    setForm({ name: {}, address: {}, notes: {}, website: "" });
    setIsListOpen(false);
    scrollToForm();
  }

  function startEdit(item: AccommodationEntry) {
    setEditingId(item.id);
    setForm({ ...item });
    setIsListOpen(false);
    scrollToForm();
  }

  const [form, setForm] = useState<Partial<AccommodationEntry>>({});

  function updateI18nField(
    field: keyof AccommodationEntry,
    lang: string,
    value: string,
  ) {
    setForm((s) => {
      const prev = (s?.[field] as Record<string, string> | undefined) ?? {};
      return {
        ...(s ?? {}),
        [field]: { ...prev, [lang]: value },
      } as Partial<AccommodationEntry>;
    });
  }

  function updateField(
    field: keyof AccommodationEntry,
    value: string | Record<string, string> | undefined,
  ) {
    setForm((s) => ({ ...(s ?? {}), [field]: value }));
  }

  async function handleSave() {
    if (!site?.id) return;

    const name = (form.name as Record<string, string> | undefined) ?? {};
    if (!name[defaultLang]) {
      setError(`Name is required in ${defaultLang}`);
      return;
    }

    if (!canAddMore() && !editingId) {
      setError("Free limit reached. Upgrade to add more accommodations.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      if (editingId) {
        const updated = await updateAccommodationEntry(
          site.id,
          editingId,
          form as Partial<AccommodationEntry>,
        );
        if (!updated) throw new Error("Update failed");
      } else {
        const created = await createAccommodationEntry(
          site.id,
          form as Omit<AccommodationEntry, "id">,
        );
        if (!created) throw new Error("Create failed");
      }
      await load();
      refresh();
      setEditingId(null);
      setForm({});
    } catch (err: unknown) {
      setError((err as Error)?.message ?? String(err));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this accommodation entry?")) return;
    setSaving(true);
    const ok = await deleteAccommodationEntry(site?.id ?? "", id);
    setSaving(false);
    if (!ok) {
      setError("Failed to delete");
      return;
    }
    await load();
    refresh();
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-medium">Accommodation</h3>
        <div>
          <button
            className="px-1 py-1 bg-blue-600 text-white rounded disabled:opacity-50"
            onClick={() => startCreate()}
            disabled={!canAddMore()}
          >
            + Add accommodation
          </button>
        </div>
      </div>

      <div className="text-sm text-gray-600 mb-3">
        Add hotels or places to stay. Free plan allows up to{" "}
        {FREE_ACCOMMODATION_LIMIT} entries.
      </div>

      {/* Collapsible list */}
      <div className="mb-2">
        <button
          className="text-sm font-medium text-gray-700 hover:text-gray-900 flex items-center gap-2"
          onClick={() => setIsListOpen((s) => !s)}
        >
          <span>{isListOpen ? "▼" : "▶"}</span>
          <span>Existing accommodations ({items.length})</span>
        </button>
      </div>

      {isListOpen && (
        <>
          {loading ? (
            <p>Loading…</p>
          ) : (
            <div className="space-y-3">
              {items.length === 0 ? (
                <div className="text-sm text-gray-500">
                  No accommodations yet.
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
                          {(typeof it.name === "string"
                            ? it.name
                            : it.name?.[defaultLang]) ?? "(no name)"}
                        </div>

                        <div className="text-xs text-gray-600 break-words">
                          {(typeof it.address === "string"
                            ? it.address
                            : it.address?.[defaultLang]) ?? ""}
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
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button
                          className="text-xs font-medium px-3 py-1.5 rounded-md border border-gray-200 bg-white hover:bg-gray-50 active:scale-[0.98] transition"
                          onClick={() => startEdit(it)}
                        >
                          Edit
                        </button>
                        <button
                          className="text-xs font-medium px-3 py-1.5 rounded-md border border-red-200 text-red-600 bg-white hover:bg-red-50 active:scale-[0.98] transition"
                          onClick={() => handleDelete(it.id)}
                          disabled={saving}
                        >
                          Delete
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

      {/* Form */}
      {(editingId !== null || Object.keys(form).length > 0) && (
        <div
          ref={formRef}
          className="mt-4 border rounded p-4 pb-24 sm:pb-4 bg-gray-50"
        >
          <h4 className="font-medium">
            {editingId ? "Edit accommodation" : "Create accommodation"}
          </h4>
          <div className="mt-3 space-y-3">
            {languages.map((lang) => (
              <div key={lang} className="border rounded p-3">
                <div className="font-medium">Language: {lang}</div>
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-gray-600">
                      Name {lang === defaultLang ? "(required)" : ""}
                    </label>
                    <input
                      value={
                        (form.name as Record<string, string> | undefined)?.[
                          lang
                        ] ?? ""
                      }
                      onChange={(e) =>
                        updateI18nField("name", lang, e.target.value)
                      }
                      className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600">
                      Address (optional)
                    </label>
                    <input
                      value={
                        (form.address as Record<string, string> | undefined)?.[
                          lang
                        ] ?? ""
                      }
                      onChange={(e) =>
                        updateI18nField("address", lang, e.target.value)
                      }
                      className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600">
                      Notes (optional)
                    </label>
                    <textarea
                      value={
                        (form.notes as Record<string, string> | undefined)?.[
                          lang
                        ] ?? ""
                      }
                      onChange={(e) =>
                        updateI18nField("notes", lang, e.target.value)
                      }
                      className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            ))}

            <div>
              <label className="block text-xs text-gray-600">
                Website (optional)
              </label>
              <input
                value={form.website ?? ""}
                onChange={(e) => updateField("website", e.target.value)}
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {error && <div className="text-red-600">{error}</div>}

            <div className="mt-3 flex gap-2">
              <button
                className="px-3 py-1 bg-green-600 text-white rounded"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Saving…" : "Save"}
              </button>
              <button
                className="px-3 py-1 border rounded bg-white"
                onClick={() => {
                  setForm({});
                  setEditingId(null);
                }}
                disabled={saving}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {!canAddMore() && (
        <div className="mt-3 text-sm text-gray-600">
          Free plan limit reached ({FREE_ACCOMMODATION_LIMIT}).{" "}
          <button className="underline text-blue-600">Upgrade</button> to add
          more.
        </div>
      )}
    </div>
  );
}
