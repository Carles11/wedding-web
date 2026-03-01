"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Site, WhatToSeeEntry } from "@/4-shared/types";
import {
  fetchWhatToSeeEntries,
  createWhatToSeeEntry,
  updateWhatToSeeEntry,
  deleteWhatToSeeEntry,
} from "@/3-entities/what_to_see/api";
import { FREE_WHATTOSEE_LIMIT } from "@/4-shared/config/limits/usage-limits";
import { StepLayout } from "../step-layout";

type Props = {
  site: Site | null;
  refresh: () => void;
  lang: string;
  translations: Record<string, string>;
};

export default function WhatToSeeBuilderStep({ site, refresh }: Props) {
  const [items, setItems] = useState<WhatToSeeEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(false);

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
      const rows = await fetchWhatToSeeEntries(site.id);
      setItems(rows ?? []);
    } catch (err: unknown) {
      setError((err as Error)?.message ?? String(err));
    } finally {
      setLoading(false);
    }
  }

  function canAddMore() {
    return items.length < FREE_WHATTOSEE_LIMIT;
  }

  const [form, setForm] = useState<Partial<WhatToSeeEntry>>({});

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
    setForm({ name: {}, description: {}, notes: {}, website: "" });
    setCollapsed(true);
    scrollToForm();
  }

  function startEdit(it: WhatToSeeEntry) {
    setEditingId(it.id);
    setForm({ ...it });
    setCollapsed(true);
    scrollToForm();
  }

  function updateI18n(
    field: keyof WhatToSeeEntry,
    lang: string,
    value: string,
  ) {
    setForm((s) => {
      const prev = (s?.[field] as Record<string, string> | undefined) ?? {};
      return {
        ...(s ?? {}),
        [field]: { ...prev, [lang]: value },
      } as Partial<WhatToSeeEntry>;
    });
  }

  function updateField(
    field: keyof WhatToSeeEntry,
    value: WhatToSeeEntry[keyof WhatToSeeEntry],
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
      setError("Free limit reached. Upgrade to add more entries.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      if (editingId) {
        const updated = await updateWhatToSeeEntry(
          site.id,
          editingId,
          form as Partial<WhatToSeeEntry>,
        );
        if (!updated) throw new Error("Update failed");
      } else {
        const created = await createWhatToSeeEntry(
          site.id,
          form as Omit<WhatToSeeEntry, "id">,
        );
        if (!created) throw new Error("Create failed");
      }

      await load();
      setForm({});
      setEditingId(null);
      setCollapsed(false);
      refresh();
    } catch (err: unknown) {
      setError((err as Error)?.message ?? String(err));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this entry?")) return;
    setSaving(true);
    const ok = await deleteWhatToSeeEntry(site?.id ?? "", id);
    setSaving(false);

    if (!ok) {
      setError("Failed to delete entry");
      return;
    }

    await load();
    refresh();
  }

  return (
    <StepLayout
      onNext={
        editingId !== null || Object.keys(form).length > 0
          ? handleSave
          : undefined
      }
      nextLoading={saving}
      nextDisabled={saving}
      nextLabel="Save"
      onBack={
        editingId !== null || Object.keys(form).length > 0
          ? () => {
              setForm({});
              setEditingId(null);
              setCollapsed(false);
            }
          : undefined
      }
      backLabel="Cancel"
    >
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-medium">What to see / do</h3>
        <button
          className="px-3 py-1 bg-blue-600 text-white rounded"
          onClick={startCreate}
          disabled={!canAddMore()}
        >
          + Add place
        </button>
      </div>

      <div className="text-sm text-gray-600 mb-3">
        Add up to {FREE_WHATTOSEE_LIMIT} recommended places.
      </div>

      {/* Collapsible list */}
      <div className="mb-2">
        <button
          onClick={() => setCollapsed((v) => !v)}
          className="text-xs text-gray-500 hover:text-gray-700"
        >
          {collapsed ? "Show places" : "Hide places"}
        </button>
      </div>

      {!collapsed && (
        <>
          {loading ? (
            <p>Loading…</p>
          ) : items.length === 0 ? (
            <div className="text-sm text-gray-500">No entries yet.</div>
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
                        : it.name?.[defaultLang]) ?? "(no name)"}
                    </div>

                    <div className="text-xs text-gray-600 line-clamp-2">
                      {(it.description && it.description[defaultLang]) ?? ""}
                    </div>

                    {it.website && (
                      <div className="text-xs text-blue-600 break-all mt-1">
                        <a href={it.website} target="_blank" rel="noreferrer">
                          {it.website}
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <button
                      className="text-xs font-medium px-3 py-1.5 rounded-md border border-gray-200 bg-white hover:bg-gray-50 transition"
                      onClick={() => startEdit(it)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-xs font-medium px-3 py-1.5 rounded-md border border-red-200 text-red-600 bg-white hover:bg-red-50 transition"
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
        </>
      )}

      {/* Form */}
      {(editingId !== null || Object.keys(form).length > 0) && (
        <div ref={formRef} className="mt-4 border rounded p-4 bg-gray-50">
          <h4 className="font-medium">
            {editingId ? "Edit place" : "Create place"}
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
                      onChange={(e) => updateI18n("name", lang, e.target.value)}
                      className="mt-1 w-full border border-gray-300 rounded px-2 py-1"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600">
                      Description (optional)
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
                      className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
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
                        updateI18n("notes", lang, e.target.value)
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
          </div>
        </div>
      )}

      {!canAddMore() && (
        <div className="mt-3 text-sm text-gray-600">
          Free plan limit reached ({FREE_WHATTOSEE_LIMIT}).{" "}
          <button className="underline text-blue-600">Upgrade</button>
        </div>
      )}
    </StepLayout>
  );
}
