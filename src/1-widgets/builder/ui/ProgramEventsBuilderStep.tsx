"use client";

import {
  createProgramEvent,
  deleteProgramEvent,
  fetchProgramEventsBySite,
  updateProgramEvent,
} from "@/3-entities/program_events/api";
import type { SupportedLanguage } from "@/4-shared/config/i18n";
import {
  canUseQuota,
  getPlanLimit,
} from "@/4-shared/helpers/billing/entitlements";
import { formatTime, timeToMinutes } from "@/4-shared/helpers/formatTime";
import { interpolate } from "@/4-shared/helpers/interpolateVars";
import { notify } from "@/4-shared/lib/toast/toast";
import type {
  PlanType,
  ProgramEvent,
  ProgramEventTranslation,
  Site,
} from "@/4-shared/types";
import { useEffect, useMemo, useRef, useState } from "react";
import { StepLayout } from "../step-layout";

// Import your reusable inputs
import { DateInput } from "@/4-shared/ui/builder/inputs/DateInput";
import { TimeInput } from "@/4-shared/ui/builder/inputs/TimeInput";
// Import the Toggle Button
import { Toggle } from "@/4-shared/ui/commons/buttons/Toggle";

function t(
  translations: Record<string, string>,
  key: string,
  fallback: string,
): string {
  return translations[key] || fallback;
}

type Props = {
  site: Site | null;
  refresh: () => void;
  lang: string;
  translations: Record<string, string>;
  planType: PlanType;
  setHasMainProgramEvent?: (hasMain: boolean) => void;
};

// Day keys and labels, sourced from translations
function getDayTags(translations: Record<string, string>) {
  return [
    {
      key: "day_before",
      label: t(translations, "builder.program_events.day_before", "Day Before"),
    },
    {
      key: "wedding_day",
      label: t(
        translations,
        "builder.program_events.wedding_day",
        "Wedding Day",
      ),
    },
    {
      key: "day_after",
      label: t(translations, "builder.program_events.day_after", "Day After"),
    },
  ] as { key: ProgramEvent["day_tag"]; label: string }[];
}

export default function ProgramEventsBuilderStep({
  site,
  refresh,
  translations,
  planType,
  setHasMainProgramEvent,
}: Props) {
  const formRef = useRef<HTMLDivElement | null>(null);

  const [events, setEvents] = useState<ProgramEvent[]>([]);
  const [loading, setLoading] = useState(true);
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
  const eventsLimit = getPlanLimit(planType, "events");

  const languages = useMemo(() => {
    if (!site) return ["en"];
    return site.languages && site.languages.length > 0
      ? site.languages
      : [site.default_lang ?? "en"];
  }, [site]);

  const defaultLang = site?.default_lang ?? languages[0] ?? "en";

  // 🔹 Fetch translated events
  async function load() {
    if (!site?.id) return;
    setLoading(true);
    setError(null);
    try {
      const rows = await fetchProgramEventsBySite(
        site.id,
        languages as SupportedLanguage[],
      );
      setEvents(rows);
    } catch (err) {
      notify.error(
        t(
          translations,
          "builder.program_events.error.fetch",
          "Failed to fetch program events",
        ),
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!site?.id) {
      setLoading(false);
      return;
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [site?.id]);

  useEffect(() => {
    setHasMainProgramEvent?.(events.some((event) => !!event.is_main_event));
  }, [events, setHasMainProgramEvent]);

  function toggleDay(day: string) {
    setOpenDays((s) => ({
      ...s,
      [day]: !s[day],
    }));
  }

  function canAddMore() {
    return canUseQuota(planType, "events", events.length);
  }

  function startCreate() {
    setForm({
      day_tag: "wedding_day",
      date: undefined,
      time: "",
      title: {},
      location: {},
      location_url: "",
      description: {},
      is_main_event: false,
    });
    setEditingId(null);

    // add smooth scroll to form when clicking "Add event"
    setTimeout(() => {
      formRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 120);
  }

  function startEdit(ev: ProgramEvent) {
    setEditingId(ev.id);
    setForm({ ...ev });

    // add smooth scroll to form when clicking "Edit event"
    setTimeout(() => {
      formRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 120);
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
    const title = (form.title as Record<string, string> | undefined) ?? {};
    const location =
      (form.location as Record<string, string> | undefined) ?? {};

    if (!title[defaultLang] || !location[defaultLang]) {
      setError(
        interpolate(
          t(
            translations,
            "builder.program_events.error.missing_fields",
            "Title and location are required in {defaultLang}",
          ),
          { defaultLang },
        ),
      );
      return;
    }
    if (!form.date) {
      setError(
        t(
          translations,
          "builder.program_events.error.missing_date",
          "Date is required",
        ),
      );
      return;
    }
    if (!form.time) {
      setError(
        t(
          translations,
          "builder.program_events.error.missing_time",
          "Time is required",
        ),
      );
      return;
    }
    if (!canAddMore() && !editingId) {
      setError(
        t(
          translations,
          "builder.program_events.error.free_limit",
          "Free limit reached. Upgrade to add more events.",
        ),
      );
      return;
    }

    setSaving(true);
    setError(null);

    // STRUCTURAL FIELDS ONLY
    const {
      title: _,
      location: __,
      description: ___,
      ...structuralFields
    } = form;

    // TRANSLATION ARRAY
    const i18nFields = ["title", "location", "description"] as const;
    const translationArr: ProgramEventTranslation[] = i18nFields.flatMap(
      (field) =>
        Object.entries(
          (form[field] as Record<string, string> | undefined) ?? {},
        ).map(([locale, value]) => ({
          key: field,
          locale,
          value,
        })),
    );

    try {
      // If this event is marked as main, make sure to unset others first
      if (form.is_main_event && form.day_tag === "wedding_day") {
        await Promise.all(
          events
            .filter(
              (e) =>
                e.day_tag === "wedding_day" &&
                e.id !== editingId &&
                e.is_main_event,
            )
            .map((e) => updateProgramEvent(e.id, { is_main_event: false })),
        );
      }

      if (editingId) {
        const updated = await updateProgramEvent(
          editingId,
          { site_id: site.id, ...structuralFields },
          translationArr,
        );
        if (!updated)
          throw new Error(
            t(
              translations,
              "builder.program_events.error.update_failed",
              "Update failed",
            ),
          );

        // Reflect edit immediately in UI without waiting for a refetch race.
        setEvents((prev) =>
          prev.map((e) => {
            if (e.id !== editingId) {
              if (
                form.is_main_event &&
                form.day_tag === "wedding_day" &&
                e.day_tag === "wedding_day"
              ) {
                return { ...e, is_main_event: false };
              }
              return e;
            }
            return {
              ...e,
              ...updated,
              title: form.title ?? {},
              location: form.location ?? {},
              description: form.description ?? {},
            } as ProgramEvent;
          }),
        );
      } else {
        const created = await createProgramEvent(
          { site_id: site.id, ...structuralFields },
          translationArr,
        );

        if (!created) {
          throw new Error(
            t(
              translations,
              "builder.program_events.error.create_failed",
              "Create failed",
            ),
          );
        }

        setEvents((prev) => {
          const cleaned =
            structuralFields.is_main_event &&
            structuralFields.day_tag === "wedding_day"
              ? prev.map((e) =>
                  e.day_tag === "wedding_day"
                    ? { ...e, is_main_event: false }
                    : e,
                )
              : prev;

          return [
            ...cleaned,
            {
              ...created,
              title: form.title ?? {},
              location: form.location ?? {},
              description: form.description ?? {},
            } as ProgramEvent,
          ];
        });
      }

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
    const ev = events.find((e) => e.id === id);
    if (ev?.day_tag === "wedding_day" && ev?.is_main_event) {
      notify.error(
        t(
          translations,
          "builder.program_events.error.delete_main_event",
          "Cannot delete the main event. Set another as main before deleting.",
        ),
      );
      return;
    }

    if (
      !confirm(
        t(
          translations,
          "builder.program_events.confirm.delete",
          "Delete this event?",
        ),
      )
    )
      return;
    setSaving(true);
    const ok = await deleteProgramEvent(id);
    setSaving(false);
    if (!ok) {
      setError(
        t(
          translations,
          "builder.program_events.error.delete_failed",
          "Failed to delete event",
        ),
      );
      return;
    }
    setEvents((prev) => prev.filter((e) => e.id !== id));
    refresh();
  }

  const DAY_TAGS = getDayTags(translations);

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

  // --- All rendering below ---
  return (
    <StepLayout
      translations={translations}
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
      nextLabel={t(translations, "builder.program_events.button.save", "Save")}
      backLabel={t(
        translations,
        "builder.program_events.button.cancel",
        "Cancel",
      )}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="text-lg font-medium">
          {t(
            translations,
            "builder.program_events.heading",
            "Program / Events",
          )}
        </h3>
        <div>
          <button
            className="px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-50"
            onClick={() => startCreate()}
            disabled={!canAddMore()}
          >
            {t(
              translations,
              "builder.program_events.button.add",
              "+ Add event",
            )}
          </button>
        </div>
      </div>

      <div className="text-sm text-gray-600 mb-3">
        {interpolate(
          t(
            translations,
            "builder.program_events.info",
            "Events are grouped by Day Before, Wedding Day, and Day After. Free plan supports up to {limit} events total. Title and location are required in the site default language ({defaultLang}).",
          ),
          {
            limit: eventsLimit,
            FREE_EVENT_LIMIT: eventsLimit,
            defaultLang,
          },
        )}
      </div>

      {loading ? (
        <p>
          {t(translations, "builder.program_events.loading", "Loading events…")}
        </p>
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
                      className="border rounded-lg p-4 bg-gray-50 flex justify-between items-start gap-6"
                    >
                      {/* LEFT SIDE */}
                      <div className="flex-1 space-y-2 min-w-0">
                        {/* Title + Toggle */}
                        <div className="flex items-center gap-3 flex-wrap">
                          <strong className="text-base break-words">
                            {ev.title?.[defaultLang] ?? "(no title)"}
                          </strong>

                          {d.key === "wedding_day" && (
                            <>
                              <Toggle
                                checked={!!ev.is_main_event}
                                disabled={saving}
                                onChange={async (makeMain) => {
                                  if (saving) return;

                                  // If trying to turn OFF
                                  if (!makeMain) {
                                    const otherMainExists = events.some(
                                      (e) =>
                                        e.day_tag === "wedding_day" &&
                                        e.id !== ev.id &&
                                        e.is_main_event,
                                    );

                                    if (!otherMainExists) {
                                      notify.error(
                                        translations[
                                          "builder.toggle.error.empty-main-not-allowed"
                                        ] ||
                                          "At least one main event must be set for Wedding Day.",
                                      );
                                      return;
                                    }

                                    // Allow turning off (another main exists)
                                    await updateProgramEvent(ev.id, {
                                      is_main_event: false,
                                    });

                                    setEvents((prev) =>
                                      prev.map((e) =>
                                        e.id === ev.id
                                          ? { ...e, is_main_event: false }
                                          : e,
                                      ),
                                    );

                                    return;
                                  }

                                  // If turning ON → make it the only main
                                  setSaving(true);

                                  setEvents((old) =>
                                    old.map((e) =>
                                      e.day_tag === "wedding_day"
                                        ? {
                                            ...e,
                                            is_main_event: e.id === ev.id,
                                          }
                                        : e,
                                    ),
                                  );

                                  await Promise.all(
                                    events
                                      .filter(
                                        (e) => e.day_tag === "wedding_day",
                                      )
                                      .map((event) =>
                                        updateProgramEvent(event.id, {
                                          is_main_event: event.id === ev.id,
                                        }),
                                      ),
                                  );

                                  setSaving(false);
                                }}
                              />

                              {ev.is_main_event && (
                                <span className="px-2 py-0.5 text-xs rounded bg-yellow-100 text-yellow-800 whitespace-nowrap">
                                  {t(
                                    translations,
                                    "builder.program_events.main_event.label",
                                    "Main event",
                                  )}
                                </span>
                              )}
                            </>
                          )}
                        </div>

                        {/* Time */}
                        {ev.time && (
                          <div className="inline-flex items-center rounded-full bg-gray-200 px-2 py-0.5 text-sm font-medium">
                            {formatTime(ev.time)}
                          </div>
                        )}

                        {/* Location */}
                        {ev.location?.[defaultLang] && (
                          <div className="text-sm text-gray-700 break-words">
                            {ev.location[defaultLang]}
                          </div>
                        )}

                        {/* Description */}
                        {ev.description?.[defaultLang] && (
                          <div className="text-sm text-gray-500 break-words">
                            {ev.description[defaultLang]}
                          </div>
                        )}

                        {/* URL */}
                        {ev.location_url && (
                          <a
                            href={ev.location_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 underline break-all"
                          >
                            {t(
                              translations,
                              "builder.program_events.field.location_url",
                              "Location URL (optional)",
                            )}
                          </a>
                        )}
                      </div>

                      {/* RIGHT SIDE */}
                      <div className="flex flex-col gap-2 shrink-0">
                        <button
                          className="px-3 py-1.5 rounded-md border bg-white hover:bg-gray-100"
                          onClick={() => startEdit(ev)}
                        >
                          {t(
                            translations,
                            "builder.program_events.button.edit",
                            "Edit",
                          )}
                        </button>

                        <button
                          className="px-3 py-1.5 rounded-md border border-red-200 text-red-600 hover:bg-red-50"
                          onClick={() => handleDelete(ev.id)}
                        >
                          {t(translations, "builder.actions.delete", "Delete")}
                        </button>
                      </div>
                    </div>
                  ))}

                  {(grouped[d.key ?? "wedding_day"] ?? []).length === 0 && (
                    <div className="text-sm text-gray-500">
                      {t(
                        translations,
                        "builder.program_events.no_events",
                        "No events for this day.",
                      )}
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
            {editingId
              ? t(
                  translations,
                  "builder.program_events.form.edit",
                  "Edit event",
                )
              : t(
                  translations,
                  "builder.program_events.form.create",
                  "Create event",
                )}
          </h4>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-gray-600">
                {t(translations, "builder.program_events.field.day", "Day")}
              </label>
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

            <DateInput
              value={form.date ?? ""}
              onChange={(newDate: string) => updateFormField("date", newDate)}
              label={t(
                translations,
                "builder.program_events.field.day",
                "Date",
              )}
              required
            />

            <TimeInput
              value={form.time ?? ""}
              onChange={(newTime: string) => updateFormField("time", newTime)}
              label={t(
                translations,
                "builder.program_events.field.time",
                "Time",
              )}
              required
            />

            <div>
              <label className="block text-xs text-gray-600">
                {t(
                  translations,
                  "builder.program_events.field.location_url",
                  "Location URL (optional)",
                )}
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

          {/* Main event toggle for edit/create, only for wedding_day */}
          {form.day_tag === "wedding_day" && (
            <div className="mt-4">
              <Toggle
                checked={!!form.is_main_event}
                label={t(
                  translations,
                  "builder.program_events.main_event.label",
                  "Main event000",
                )}
                id="main-event-toggle-form"
                disabled={saving}
                onChange={(checked) => {
                  if (
                    form.day_tag === "wedding_day" &&
                    form.is_main_event && // currently true
                    !checked // trying to unset
                  ) {
                    const otherMainExists = events.some(
                      (e) =>
                        e.day_tag === "wedding_day" &&
                        e.id !== editingId &&
                        e.is_main_event,
                    );

                    if (!otherMainExists) {
                      notify.error(
                        translations[
                          "builder.toggle.error.empty-main-not-allowed"
                        ] ||
                          "At least one main event must be set for Wedding Day.",
                      );
                      return; // 🚫 block change
                    }
                  }

                  updateFormField("is_main_event", checked);
                }}
                aria-label={t(
                  translations,
                  "builder.program_events.main_aria",
                  "Mark as main event",
                )}
              />
              <div className="text-xs text-gray-500 mt-1">
                {t(
                  translations,
                  "builder.program_events.main.info",
                  "Only one main event can be set for Wedding Day.",
                )}
              </div>
            </div>
          )}

          <div className="mt-4">
            <div className="font-medium">
              {t(
                translations,
                "builder.program_events.form.multi_language",
                "Multi-language fields",
              )}
            </div>
            <div className="text-sm text-gray-600 mb-2">
              {interpolate(
                t(
                  translations,
                  "builder.program_events.form.languages.info",
                  "Fill fields for each site language. Default language ({defaultLang}) is required for Title and Location.",
                ),
                { defaultLang },
              )}
            </div>
            {languages.map((lang) => (
              <div key={lang} className="mt-2 border rounded p-3 min-w-0">
                <div className="font-medium">Language: {lang}</div>
                <div className="mt-2 grid grid-cols-1 gap-2">
                  <div>
                    <label className="block text-xs text-gray-600">
                      {t(
                        translations,
                        "builder.program_events.field.title",
                        "Title",
                      )}
                      {lang === defaultLang
                        ? ` ${t(translations, "builder.form.required", "(required)")}`
                        : ""}
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
                      {t(
                        translations,
                        "builder.program_events.field.location",
                        "Location",
                      )}
                      {lang === defaultLang
                        ? ` ${t(translations, "builder.form.required", "(required)")}`
                        : ""}
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
                      {t(
                        translations,
                        "builder.program_events.field.description",
                        "Description (optional)",
                      )}
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

      {!canAddMore() && (
        <div className="mt-3 text-sm text-gray-600">
          {interpolate(
            t(
              translations,
              "builder.program_events.limit_reached",
              "Free plan limit reached ({limit} events). Upgrade to add more.",
            ),
            {
              limit: eventsLimit,
              FREE_EVENT_LIMIT: eventsLimit,
            },
          )}
          <button className="underline text-blue-600">
            {t(
              translations,
              "builder.program_events.button.upgrade",
              "Upgrade",
            )}
          </button>
        </div>
      )}
    </StepLayout>
  );
}
