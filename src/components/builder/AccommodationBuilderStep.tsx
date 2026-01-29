"use client";

import React, { useEffect, useMemo, useState } from "react";
import type { Site, AccommodationEntry } from "@/4-shared/types";
import {
  fetchAccommodationEntries,
  createAccommodationEntry,
  updateAccommodationEntry,
  deleteAccommodationEntry,
} from "@/3-entities/accommodation/api";

type Props = { site: Site | null; refresh: () => void };

const FREE_ACCOMMODATION_LIMIT = 2;

export default function AccommodationBuilderStep({ site, refresh }: Props) {
  const [items, setItems] = useState<AccommodationEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

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

  function startCreate() {
    setEditingId(null);
    setForm({ name: {}, address: {}, notes: {}, website: "" });
  }

  function startEdit(item: AccommodationEntry) {
    setEditingId(item.id);
    setForm({ ...item });
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

  function updateField(field: keyof AccommodationEntry, value: any) {
    setForm((s) => ({ ...(s ?? {}), [field]: value }));
  }

  async function handleSave() {
    if (!site?.id) return;

    // Validate required default language name
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
            className="px-3 py-1 bg-blue-600 text-white rounded"
            onClick={startCreate}
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

      {loading ? (
        <p>Loading…</p>
      ) : (
        <div className="space-y-3">
          {items.length === 0 ? (
            <div className="text-sm text-gray-500">No accommodations yet.</div>
          ) : (
            <div className="space-y-2">
              {items.map((it) => (
                <div
                  key={it.id}
                  className="border rounded p-3 flex items-start justify-between"
                >
                  <div>
                    <div className="font-medium">
                      {(typeof it.name === "string"
                        ? it.name
                        : it.name?.[defaultLang]) ?? "(no name)"}
                    </div>
                    <div className="text-sm text-gray-600">
                      {(typeof it.address === "string"
                        ? it.address
                        : it.address?.[defaultLang]) ?? ""}
                    </div>
                    {it.website && (
                      <div className="text-sm text-blue-600">
                        <a href={it.website} target="_blank" rel="noreferrer">
                          {it.website}
                        </a>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="text-sm text-blue-600"
                      onClick={() => startEdit(it)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-sm text-red-600"
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

      {/* Form */}
      {(editingId !== null || Object.keys(form).length > 0) && (
        <div className="mt-4 border rounded p-4 bg-gray-50">
          <h4 className="font-medium">
            {editingId ? "Edit accommodation" : "Create accommodation"}
          </h4>
          <div className="mt-3 space-y-3">
            {languages.map((lang) => (
              <div key={lang} className="border rounded p-3">
                <div className="font-medium">Language: {lang}</div>
                <div className="mt-2 grid grid-cols-1 gap-2">
                  <div>
                    <label className="block text-xs text-gray-600">
                      Name {lang === defaultLang ? "(required)" : ""}
                    </label>
                    <input
                      value={(form.name as any)?.[lang] ?? ""}
                      onChange={(e) =>
                        updateI18nField("name", lang, e.target.value)
                      }
                      className="mt-1 w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600">
                      Address (optional)
                    </label>
                    <input
                      value={(form.address as any)?.[lang] ?? ""}
                      onChange={(e) =>
                        updateI18nField("address", lang, e.target.value)
                      }
                      className="mt-1 w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600">
                      Notes (optional)
                    </label>
                    <textarea
                      value={(form.notes as any)?.[lang] ?? ""}
                      onChange={(e) =>
                        updateI18nField("notes", lang, e.target.value)
                      }
                      className="mt-1 w-full"
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
                className="mt-1 w-full"
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
          more. {/* TODO: integrate billing and server-side enforcement */}
        </div>
      )}

      {/* TODO: Consider moving accommodations to a dedicated table with per-row CRUD and add server-side validation for default language fields. */}
    </div>
  );
}
