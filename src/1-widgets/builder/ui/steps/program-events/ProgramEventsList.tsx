import { formatTime } from "@/4-shared/helpers/formatTime";
import { t } from "@/4-shared/helpers/t";
import type { ProgramEvent } from "@/4-shared/types";
import { BuilderButton } from "@/4-shared/ui/builder";
import { Toggle } from "@/4-shared/ui/commons/buttons/Toggle";
import type { DayTagOption } from "./dayTags";

type ProgramEventsListProps = {
  loading: boolean;
  dayTags: DayTagOption[];
  openDays: Record<string, boolean>;
  grouped: Record<string, ProgramEvent[]>;
  defaultLang: string;
  saving: boolean;
  translations: Record<string, string>;
  onToggleDay: (day: string) => void;
  onStartEdit: (event: ProgramEvent) => void;
  onDelete: (id: string) => void;
  onToggleMainEvent: (event: ProgramEvent, makeMain: boolean) => void;
};

export function ProgramEventsList({
  loading,
  dayTags,
  openDays,
  grouped,
  defaultLang,
  saving,
  translations,
  onToggleDay,
  onStartEdit,
  onDelete,
  onToggleMainEvent,
}: ProgramEventsListProps) {
  if (loading) {
    return (
      <p>
        {t(translations, "builder.program_events.loading", "Loading events…")}
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {dayTags.map((dayTag) => {
        const dayKey = dayTag.key ?? "wedding_day";
        const dayEvents = grouped[dayKey] ?? [];

        return (
          <div key={dayKey} className="border rounded p-3">
            <button
              type="button"
              onClick={() => onToggleDay(dayKey)}
              className="w-full flex items-center justify-between font-medium text-left group"
            >
              <span>{dayTag.label}</span>
              <span
                className="text-gray-400 text-sm transition-transform group-hover:text-gray-600"
                style={{
                  transform: openDays[dayKey]
                    ? "rotate(180deg)"
                    : "rotate(0deg)",
                }}
              >
                ▾
              </span>
            </button>

            {openDays[dayKey] && (
              <div className="mt-2 space-y-2">
                {dayEvents.map((event) => (
                  <div
                    key={event.id}
                    className="border rounded-lg p-4 bg-gray-50 flex justify-between items-start gap-6"
                  >
                    <div className="flex-1 space-y-2 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <strong className="text-base wrap-break-word">
                          {event.title?.[defaultLang] ?? "(no title)"}
                        </strong>

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

                      {event.time && (
                        <div className="inline-flex items-center rounded-full bg-gray-200 px-2 py-0.5 text-sm font-medium">
                          {formatTime(event.time)}
                        </div>
                      )}

                      {event.location?.[defaultLang] && (
                        <div className="text-sm text-gray-700 wrap-break-word">
                          {event.location[defaultLang]}
                        </div>
                      )}

                      {event.description?.[defaultLang] && (
                        <div className="text-sm text-gray-500 wrap-break-word">
                          {event.description[defaultLang]}
                        </div>
                      )}

                      {event.location_url && (
                        <a
                          href={event.location_url}
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

                    <div className="flex flex-col gap-2 shrink-0">
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
                        {t(translations, "builder.actions.delete", "Delete")}
                      </BuilderButton>
                    </div>
                  </div>
                ))}

                {dayEvents.length === 0 && (
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
        );
      })}
    </div>
  );
}
