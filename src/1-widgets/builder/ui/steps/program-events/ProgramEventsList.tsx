"use client";

import { formatCompactEventDate } from "@/4-shared/helpers/formatEventDate";
import { formatTime } from "@/4-shared/helpers/formatTime";
import { interpolate } from "@/4-shared/helpers/interpolateVars";
import { t } from "@/4-shared/helpers/t";
import type { ProgramEvent } from "@/4-shared/types";
import { BuilderButton } from "@/4-shared/ui/builder";
import { Toggle } from "@/4-shared/ui/commons/buttons/Toggle";
import { CustomLoader } from "@/4-shared/ui/commons/loader/CustomLoader";
import type { DayTagOption } from "./dayTags";

type ProgramEventsListProps = {
  loading: boolean;
  lang: string;
  dayTags: DayTagOption[];
  compactOpenDays: Record<string, boolean>;
  grouped: Record<string, ProgramEvent[]>;
  defaultLang: string;
  saving: boolean;
  translations: Record<string, string>;
  onToggleCompactDay: (day: string) => void;
  onStartEdit: (event: ProgramEvent) => void;
  onDelete: (id: string) => void;
  onToggleMainEvent: (event: ProgramEvent, makeMain: boolean) => void;
};

export function ProgramEventsList({
  loading,
  lang,
  dayTags,
  compactOpenDays,
  grouped,
  defaultLang,
  saving,
  translations,
  onToggleCompactDay,
  onStartEdit,
  onDelete,
  onToggleMainEvent,
}: ProgramEventsListProps) {
  if (loading) {
    return (
      <CustomLoader
        message={t(
          translations,
          "builder.program_events.loading",
          "Loading events…",
        )}
      />
    );
  }

  return (
    <div className="space-y-3">
      {dayTags.map((dayTag) => {
        const dayKey = dayTag.key ?? "wedding_day";
        const dayEvents = grouped[dayKey] ?? [];
        const isExpanded = compactOpenDays[dayKey] ?? false;

        const eventCountLabel =
          dayEvents.length === 1
            ? t(translations, "builder.program_events.count.single", "1 event")
            : interpolate(
                t(
                  translations,
                  "builder.program_events.count.plural",
                  "{count} events",
                ),
                { count: dayEvents.length },
              );

        const visibleEvents = isExpanded ? dayEvents : dayEvents.slice(0, 1);

        return (
          <div
            key={dayKey}
            className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3 shadow-sm"
          >
            <button
              type="button"
              onClick={() => onToggleCompactDay(dayKey)}
              className="flex w-full items-center justify-between gap-2 text-left"
            >
              <span className="font-semibold text-sm text-slate-800 dark:text-slate-200">
                {dayTag.label}
              </span>

              <div className="flex items-center gap-2">
                <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider text-slate-600 dark:text-slate-400">
                  {eventCountLabel}
                </span>
                <span
                  className="text-gray-400 dark:text-gray-500 text-sm transition-transform duration-200"
                  style={{
                    transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                >
                  ▾
                </span>
              </div>
            </button>

            {dayEvents.length === 0 ? (
              <div className="mt-2 text-xs text-gray-400 dark:text-gray-500 italic">
                {t(
                  translations,
                  "builder.program_events.no_events",
                  "No events for this day.",
                )}
              </div>
            ) : (
              <div className="mt-3">
                <ul className="space-y-3">
                  {visibleEvents.map((event) => (
                    <li
                      key={event.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-gray-50 dark:border-gray-700 pt-3 first:border-0 first:pt-0"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-slate-900 dark:text-slate-100 truncate">
                          {event.title?.[defaultLang] ?? "(no title)"}
                        </div>

                        <div className="mt-1 flex flex-wrap items-center gap-2">
                          {event.date && (
                            <span className="text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 px-1.5 py-0.5 rounded border border-slate-100 dark:border-slate-700">
                              {formatCompactEventDate(event.date, lang)}
                            </span>
                          )}
                          {event.time && (
                            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-100 dark:border-emerald-800/50 font-medium">
                              {formatTime(event.time)}
                            </span>
                          )}

                          {dayKey === "wedding_day" && (
                            <div className="flex items-center gap-2 ml-1">
                              <Toggle
                                checked={!!event.is_main_event}
                                disabled={saving}
                                onChange={(makeMain) =>
                                  onToggleMainEvent(event, makeMain)
                                }
                              />
                              {event.is_main_event && (
                                <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-tight">
                                  {t(
                                    translations,
                                    "builder.program_events.main_event.label",
                                    "Main",
                                  )}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="flex shrink-0 gap-2">
                          <BuilderButton
                            variant="secondary"
                            size="sm"
                            onClick={() => onStartEdit(event)}
                          >
                            {t(
                              translations,
                              "builder.program_events.button.edit",
                              "Edit",
                            )}
                          </BuilderButton>

                          <BuilderButton
                            variant="secondary"
                            tone="danger"
                            size="sm"
                            onClick={() => onDelete(event.id)}
                            disabled={saving}
                          >
                            {t(
                              translations,
                              "builder.actions.delete",
                              "Delete",
                            )}
                          </BuilderButton>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>

                {!isExpanded && dayEvents.length > 1 && (
                  <button
                    onClick={() => onToggleCompactDay(dayKey)}
                    className="mt-3 text-xs text-indigo-600 dark:text-blue-400 font-medium hover:underline"
                  >
                    + {dayEvents.length - 1}{" "}
                    {t(
                      translations,
                      "builder.program_events.more_events",
                      "more events...",
                    )}
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
