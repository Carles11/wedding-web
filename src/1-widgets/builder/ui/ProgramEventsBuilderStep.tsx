"use client";

import { useEffect, useMemo, useState } from "react";
import type { Site, ProgramEvent } from "@/4-shared/types";
import {
  fetchProgramEventsBySite,
  createProgramEvent,
  updateProgramEvent,
  deleteProgramEvent,
} from "@/3-entities/program_events/api";

type Props = { site: Site | null; refresh: () => void };

const FREE_EVENT_LIMIT = 2;

const DAY_TAGS: { key: ProgramEvent["day_tag"]; label: string }[] = (
  [
    ["day_before", "Day Before"],
    ["wedding_day", "Wedding Day"],
    ["day_after", "Day After"],
  ] as [ProgramEvent["day_tag"], string][]
).map(([k, l]) => ({ key: k, label: l }));

export default function ProgramEventsBuilderStep({ site, refresh }: Props) {
  const [events, setEvents] = useState<ProgramEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // form state for create/edit
  const [form, setForm] = useState<Partial<ProgramEvent>>({
    day_tag: "wedding_day",
  });

  const isProUser = false; // stub — do not check subscription in this MVP

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
      const rows = await fetchProgramEventsBySite(site.id);
      setEvents(rows);
    } catch (err: unknown) {
      console.error(err);
      setError((err as Error)?.message ?? String(err));
    } finally {
      setLoading(false);
    }
  }

  function canAddMore() {
    if (isProUser) return true;
    return events.length < FREE_EVENT_LIMIT;
  }

  function startCreate() {
    setForm({
      day_tag: "wedding_day",
      title: {},
      location: {},
      description: {},
    });
    setEditingId(null);
  }

  function startEdit(ev: ProgramEvent) {
    setEditingId(ev.id);
    setForm({ ...ev });
  }

  function clearForm() {
    setForm({ day_tag: "wedding_day" });
    setEditingId(null);
  }

  function updateFormField<T extends keyof ProgramEvent>(
    k: T,
    v: ProgramEvent[T],
  ) {
    setForm((s) => ({ ...(s ?? {}), [k]: v }));
  }

  function updateI18nField(
    field: keyof ProgramEvent,
    lang: string,
    value: string,
  ) {
    setForm((s) => {
      const prev = (s?.[field] as Record<string, string> | undefined) ?? {};
      return {
        ...(s ?? {}),
        [field]: { ...prev, [lang]: value },
      } as Partial<ProgramEvent>;
    });
  }

  async function handleSave() {
    if (!site?.id) return;
    // validation: title & location required in default language
    const title = (form.title as Record<string, string> | undefined) ?? {};
    const location =
      (form.location as Record<string, string> | undefined) ?? {};
    if (!title[defaultLang] || !location[defaultLang]) {
      setError(`Title and location are required in ${defaultLang}`);
      return;
    }

    if (!canAddMore() && !editingId) {
      setError("Free limit reached. Upgrade to add more events.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      if (editingId) {
        const updated = await updateProgramEvent(editingId, {
          ...(form as ProgramEvent),
        });
        if (!updated) throw new Error("Update failed");
      } else {
        const payload: Partial<ProgramEvent> & { site_id: string } = {
          ...(form as ProgramEvent),
          site_id: site.id,
        };
        const created = await createProgramEvent(payload);
        if (!created) throw new Error("Create failed");
      }

      await load();
      clearForm();
      refresh();
    } catch (err: unknown) {
      console.error(err);
      setError((err as Error)?.message ?? String(err));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this event?")) return;
    setSaving(true);
    const ok = await deleteProgramEvent(id);
    setSaving(false);
    if (!ok) {
      setError("Failed to delete event");
      return;
    }
    await load();
    refresh();
  }

  const grouped = useMemo(() => {
    const map: Record<string, ProgramEvent[]> = {
      day_before: [],
      wedding_day: [],
      day_after: [],
    };
    events.forEach((e) => {
      const k = e.day_tag ?? "wedding_day";
      if (!map[k]) map[k] = [];
      map[k].push(e);
    });
    return map;
  }, [events]);

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-medium">Program / Events</h3>
        <div>
          <button
            className="px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-50"
            onClick={() => startCreate()}
            disabled={!canAddMore()}
          >
            + Add event
          </button>
        </div>
      </div>

      <div className="text-sm text-gray-600 mb-3">
        Events are grouped by Day Before, Wedding Day, and Day After. Free plan
        supports up to {FREE_EVENT_LIMIT} events total. Title and location are
        required in the site default language ({defaultLang}).
      </div>

      {loading ? (
        <p>Loading events…</p>
      ) : (
        <div className="space-y-4">
          {DAY_TAGS.map((d) => (
            <div key={d.key as string} className="border rounded p-3">
              <div className="font-medium">{d.label}</div>
              <div className="mt-2 space-y-2">
                {(grouped[d.key ?? "wedding_day"] ?? []).map((ev) => (
                  <div
                    key={ev.id}
                    className="flex items-start justify-between gap-4"
                  >
                    <div>
                      <div className="text-sm font-semibold">
                        {(ev.title && ev.title[defaultLang]) ?? "(no title)"}
                      </div>
                      <div className="text-xs text-gray-600">
                        {ev.time ?? ""}{" "}
                        {ev.location && ev.location[defaultLang]
                          ? "— " + ev.location[defaultLang]
                          : ""}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {ev.description && ev.description[defaultLang]
                          ? ev.description[defaultLang]
                          : null}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="text-sm text-blue-600"
                        onClick={() => startEdit(ev)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-sm text-red-600"
                        onClick={() => handleDelete(ev.id)}
                        disabled={saving}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}

                {(grouped[d.key ?? "wedding_day"] ?? []).length === 0 && (
                  <div className="text-sm text-gray-500">
                    No events for this day.
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit / Create form */}
      {(editingId !== null || Object.keys(form ?? {}).length > 1) && (
        <div className="mt-4 border rounded p-4 bg-gray-50">
          <h4 className="font-medium">
            {editingId ? "Edit event" : "Create event"}
          </h4>
          <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-gray-600">Day</label>
              <select
                value={form.day_tag ?? "wedding_day"}
                onChange={(e) =>
                  updateFormField(
                    "day_tag",
                    e.target.value as ProgramEvent["day_tag"],
                  )
                }
                className="mt-1 w-full"
              >
                {DAY_TAGS.map((d) => (
                  <option key={d.key as string} value={d.key ?? ""}>
                    {d.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-600">Time</label>
              <input
                value={form.time ?? ""}
                onChange={(e) => updateFormField("time", e.target.value)}
                className="mt-1 w-full"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-600">
                Location URL (optional)
              </label>
              <input
                value={form.location_url ?? ""}
                onChange={(e) =>
                  updateFormField("location_url", e.target.value)
                }
                className="mt-1 w-full"
              />
            </div>
          </div>

          <div className="mt-4">
            <div className="font-medium">Multi-language fields</div>
            <div className="text-sm text-gray-600 mb-2">
              Fill fields for each site language. Default language (
              {defaultLang}) is required for Title and Location.
            </div>

            {languages.map((lang) => (
              <div key={lang} className="mt-2 border rounded p-3">
                <div className="font-medium">Language: {lang}</div>
                <div className="mt-2 grid grid-cols-1 gap-2">
                  <div>
                    <label className="block text-xs text-gray-600">
                      Title {lang === defaultLang ? "(required)" : ""}
                    </label>
                    <input
                      value={
                        (form.title as Record<string, string> | undefined)?.[
                          lang
                        ] ?? ""
                      }
                      onChange={(e) =>
                        updateI18nField("title", lang, e.target.value)
                      }
                      className="mt-1 w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600">
                      Location {lang === defaultLang ? "(required)" : ""}
                    </label>
                    <input
                      value={
                        (form.location as Record<string, string> | undefined)?.[
                          lang
                        ] ?? ""
                      }
                      onChange={(e) =>
                        updateI18nField("location", lang, e.target.value)
                      }
                      className="mt-1 w-full"
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
                        updateI18nField("description", lang, e.target.value)
                      }
                      className="mt-1 w-full"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {error && <div className="text-red-600 mt-2">{error}</div>}

          <div className="mt-4 flex gap-2">
            <button
              className="px-3 py-1 bg-green-600 text-white rounded"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving…" : "Save"}
            </button>
            <button
              className="px-3 py-1 border rounded bg-white"
              onClick={clearForm}
              disabled={saving}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {!canAddMore() && !isProUser && (
        <div className="mt-3 text-sm text-gray-600">
          Free plan limit reached ({FREE_EVENT_LIMIT} events).{" "}
          <button className="underline text-blue-600">Upgrade</button> to add
          more. {/* TODO: integrate billing */}
        </div>
      )}

      {/* TODO: Add server-side plan enforcement and stricter multi-language validation on the server to ensure default language presence. */}
    </div>
  );
}
