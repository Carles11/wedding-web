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
        const isExpanded = compactOpenDays[dayKey] ?? false;
        const visibleEvents = isExpanded ? dayEvents : dayEvents.slice(0, 1);

        return (
          <div
            key={dayKey}
            className="rounded-lg border border-gray-200 bg-white p-3"
          >
            <button
              type="button"
              onClick={() => onToggleCompactDay(dayKey)}
              className="flex w-full items-center justify-between gap-2 text-left"
            >
              <span className="font-medium text-sm text-slate-800">
                {dayTag.label}
              </span>

              <div className="flex items-center gap-2">
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                  {eventCountLabel}
                </span>
                <span
                  className="text-gray-400 text-sm transition-transform"
                  style={{
                    transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                >
                  ▾
                </span>
              </div>
            </button>

            {dayEvents.length === 0 ? (
              <div className="mt-2 text-sm text-gray-500">
                {t(
                  translations,
                  "builder.program_events.no_events",
                  "No events for this day.",
                )}
              </div>
            ) : (
              <>
                <ul className="mt-2 space-y-1.5">
                  {visibleEvents.map((event) => (
                    <li
                      key={event.id}
                      className="flex items-start justify-between gap-3 rounded-md px-1 py-1 text-sm min-w-0"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-slate-700">
                          {event.title?.[defaultLang] ?? "(no title)"}
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-2">
                          {event.date && (
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                              {formatCompactEventDate(event.date, lang)}
                            </span>
                          )}
                          {event.time && (
                            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                              {formatTime(event.time)}
                            </span>
                          )}

                          {dayKey === "wedding_day" && (
                            <>
                              <Toggle
                                checked={!!event.is_main_event}
                                disabled={saving}
                                onChange={(makeMain) =>
                                  onToggleMainEvent(event, makeMain)
                                }
                              />

                              {event.is_main_event && (
                                <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs text-yellow-800">
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
                      </div>

                      {isExpanded && (
                        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
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
                  <div className="mt-2 text-xs text-gray-500">
                    + {dayEvents.length - 1}{" "}
                    {t(
                      translations,
                      "builder.program_events.more_events",
                      "more events",
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
