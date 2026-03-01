"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Site, ProgramEvent } from "@/4-shared/types";
import {
  fetchProgramEventsBySite,
  createProgramEvent,
  updateProgramEvent,
  deleteProgramEvent,
} from "@/3-entities/program_events/api";
import { FREE_EVENT_LIMIT } from "@/4-shared/config/limits/usage-limits";
import { formatTime, timeToMinutes } from "@/4-shared/helpers/formatTime";
import { StepLayout } from "../step-layout";

type Props = {
  site: Site | null;
  refresh: () => void;
  lang: string;
  translations: Record<string, string>;
  setHasProgramEvents?: (hasEvents: boolean) => void;
};

const DAY_TAGS: { key: ProgramEvent["day_tag"]; label: string }[] = (
  [
    ["day_before", "Day Before"],
    ["wedding_day", "Wedding Day"],
    ["day_after", "Day After"],
  ] as [ProgramEvent["day_tag"], string][]
).map(([k, l]) => ({ key: k, label: l }));

export default function ProgramEventsBuilderStep({
  site,
  refresh,
  lang,
  translations,
  setHasProgramEvents,
}: Props) {
  const formRef = useRef<HTMLDivElement | null>(null);

  const [events, setEvents] = useState<ProgramEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [openDays, setOpenDays] = useState<Record<string, boolean>>({
    day_before: false,
    wedding_day: true,
    day_after: false,
  });
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

  // ✅ Reactively update parent with completeness!
  useEffect(() => {
    if (setHasProgramEvents) setHasProgramEvents(events.length > 0);
  }, [events, setHasProgramEvents]);

  useEffect(() => {
    const isOpen = editingId !== null || Object.keys(form ?? {}).length > 1;

    if (!isOpen) return;

    // small delay so layout settles
    const t = setTimeout(() => {
      formRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 120);

    return () => clearTimeout(t);
  }, [editingId, form]);

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

  function toggleDay(day: string) {
    setOpenDays((s) => ({
      ...s,
      [day]: !s[day],
    }));
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

    Object.keys(map).forEach((day) => {
      map[day].sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time));
    });

    return map;
  }, [events]);

  return (
    <StepLayout
      onNext={
        editingId !== null || Object.keys(form ?? {}).length > 1
          ? handleSave
          : undefined
      }
      nextLoading={saving}
      nextDisabled={saving}
      onBack={
        editingId !== null || Object.keys(form ?? {}).length > 1
          ? clearForm
          : undefined
      }
      nextLabel="Save"
      backLabel="Cancel"
    >
      <div className="mb-3 flex items-center justify-between gap-2">
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
              <button
                type="button"
                onClick={() => toggleDay(d.key as string)}
                className="w-full flex items-center justify-between font-medium text-left group"
              >
                <span>{d.label}</span>
                <span
                  className="text-gray-400 text-sm transition-transform group-hover:text-gray-600"
                  style={{
                    transform: openDays[d.key as string]
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                  }}
                >
                  ▾
                </span>
              </button>
              {openDays[d.key as string] && (
                <div className="mt-2 space-y-2">
                  {(grouped[d.key ?? "wedding_day"] ?? []).map((ev) => (
                    <div
                      key={ev.id}
                      className="group border rounded-lg p-3 sm:p-0 sm:border-0 sm:rounded-none flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 bg-white sm:bg-transparent"
                    >
                      <div>
                        <div className="text-sm font-semibold truncate">
                          {(ev.title && ev.title[defaultLang]) ?? "(no title)"}
                        </div>
                        <div className="text-xs text-gray-600 wrap-break-word ">
                          {ev.time && (
                            <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 font-medium text-gray-700 mr-2">
                              {formatTime(ev.time)}
                            </span>
                          )}
                          {ev.location && ev.location[defaultLang] && (
                            <span className="wrap-break-word">
                              {ev.location[defaultLang]}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 mt-1 line-clamp-3 sm:line-clamp-none">
                          {ev.description && ev.description[defaultLang]
                            ? ev.description[defaultLang]
                            : null}
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5 shrink-0">
                        <button
                          className="text-sm px-3 py-1.5 rounded-md border border-gray-400 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition"
                          onClick={() => startEdit(ev)}
                        >
                          Edit
                        </button>
                        <button
                          className="text-sm px-3 py-1.5 rounded-md border border-red-200 bg-white text-red-600 hover:bg-red-50 hover:border-red-300 transition"
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
              )}
            </div>
          ))}
        </div>
      )}

      {(editingId !== null || Object.keys(form ?? {}).length > 1) && (
        <div ref={formRef} className="mt-4 border rounded p-4 bg-gray-50">
          <h4 className="font-medium">
            {editingId ? "Edit event" : "Create event"}
          </h4>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
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
                placeholder="18:00"
                inputMode="numeric"
                onChange={(e) => {
                  const raw = e.target.value;
                  if (/^\d{1,2}$/.test(raw)) {
                    updateFormField("time", raw);
                    return;
                  }
                  if (/^\d{1,2}:\d{0,2}$/.test(raw)) {
                    updateFormField("time", raw);
                    return;
                  }
                }}
                onBlur={(e) => {
                  const val = e.target.value.trim();
                  if (!val) return;
                  const minutes = timeToMinutes(val);
                  if (!isNaN(minutes)) {
                    const hh = Math.floor(minutes / 60)
                      .toString()
                      .padStart(2, "0");
                    const mm = (minutes % 60).toString().padStart(2, "0");
                    updateFormField("time", `${hh}:${mm}`);
                  }
                }}
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              <div key={lang} className="mt-2 border rounded p-3 min-w-0">
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
                      className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                      className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                      className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {error && <div className="text-red-600 mt-2">{error}</div>}
        </div>
      )}

      {!canAddMore() && !isProUser && (
        <div className="mt-3 text-sm text-gray-600">
          Free plan limit reached ({FREE_EVENT_LIMIT} events).{" "}
          <button className="underline text-blue-600">Upgrade</button> to add
          more.
        </div>
      )}
    </StepLayout>
  );
}
