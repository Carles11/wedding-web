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
import { timeToMinutes } from "@/4-shared/helpers/formatTime";
import { interpolate } from "@/4-shared/helpers/interpolateVars";
import { t } from "@/4-shared/helpers/t";
import { useAlertConfirm } from "@/4-shared/hooks/useAlertConfirm";
import { notify } from "@/4-shared/lib/toast/toast";
import type {
  PlanType,
  ProgramEvent,
  ProgramEventTranslation,
  Site,
} from "@/4-shared/types";
import { BuilderButton, PlanLimitNotice } from "@/4-shared/ui/builder";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { StepLayout } from "../../step-layout";
import { getDayTags } from "./program-events/dayTags";
import { ProgramEventForm } from "./program-events/ProgramEventForm";
import { ProgramEventsList } from "./program-events/ProgramEventsList";

type Props = {
  site: Site | null;
  refresh: () => void;
  lang: string;
  translations: Record<string, string>;
  planType: PlanType;
  setHasMainProgramEvent?: (hasMain: boolean) => void;
};

export default function ProgramEventsBuilderStep({
  site,
  refresh,
  lang,
  translations,
  planType,
  setHasMainProgramEvent,
}: Props) {
  const router = useRouter();
  const formRef = useRef<HTMLDivElement | null>(null);
  const fetchCounterRef = useRef(0);

  const [events, setEvents] = useState<ProgramEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [compactOpenDays, setCompactOpenDays] = useState<
    Record<string, boolean>
  >({
    day_before: false,
    wedding_day: false,
    day_after: false,
  });
  const [form, setForm] = useState<Partial<ProgramEvent>>({
    day_tag: "wedding_day",
  });

  const eventsLimit = getPlanLimit(planType, "events");
  const eventsLimitLabel =
    eventsLimit === -1
      ? t(
          translations,
          "pricing.unlimited",
          t(translations, "billing.unlimited", "Unlimited"),
        )
      : String(eventsLimit);

  const languages = useMemo(() => {
    if (!site) return ["en"];
    return site.languages && site.languages.length > 0
      ? site.languages
      : [site.default_lang ?? "en"];
  }, [site]);

  const defaultLang = site?.default_lang ?? languages[0] ?? "en";
  const dayTags = getDayTags(translations);
  const { confirm: confirmDelete, confirmDialog } = useAlertConfirm();

  const weddingDayReferenceDate = useMemo(() => {
    const ref = events.find(
      (e) =>
        e.day_tag === "wedding_day" &&
        e.id !== editingId &&
        typeof e.date === "string" &&
        e.date.trim() !== "",
    );
    return ref?.date ?? "";
  }, [events, editingId]);

  const grouped = useMemo(() => {
    const map: Record<string, ProgramEvent[]> = {
      day_before: [],
      wedding_day: [],
      day_after: [],
    };

    events.forEach((event) => {
      const key = event.day_tag ?? "wedding_day";
      if (!map[key]) map[key] = [];
      map[key].push(event);
    });

    Object.keys(map).forEach((day) => {
      map[day].sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time));
    });

    return map;
  }, [events]);

  const hasPendingChanges = isFormOpen;

  useEffect(() => {
    if (!isFormOpen) return;

    if (
      form.day_tag === "wedding_day" &&
      weddingDayReferenceDate &&
      !form.date
    ) {
      setForm((prev) => ({ ...(prev ?? {}), date: weddingDayReferenceDate }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.day_tag, form.date, weddingDayReferenceDate]);

  useEffect(() => {
    if (!site?.id) {
      setLoading(false);
      return;
    }

    const requestId = ++fetchCounterRef.current;
    load(requestId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [site?.id]);

  useEffect(() => {
    setHasMainProgramEvent?.(events.some((event) => !!event.is_main_event));
  }, [events, setHasMainProgramEvent]);

  function eventsSignature(rows: ProgramEvent[]): string {
    return rows
      .map((row) =>
        JSON.stringify({
          id: row.id,
          day_tag: row.day_tag,
          date: row.date,
          time: row.time,
          location_url: row.location_url,
          sort_order: row.sort_order,
          created_at: row.created_at,
          is_main_event: row.is_main_event,
          title: row.title ?? {},
          location: row.location ?? {},
          description: row.description ?? {},
        }),
      )
      .join("|");
  }

  async function reconcileEvents(
    requestId: number,
    baselineRows: ProgramEvent[],
    maxAttempts = 3,
  ) {
    if (!site?.id) return;

    let baselineSignature = eventsSignature(baselineRows);

    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      if (!site?.id || fetchCounterRef.current !== requestId) return;

      const nextRows = await fetchProgramEventsBySite(
        site.id,
        languages as SupportedLanguage[],
      );
      const nextSignature = eventsSignature(nextRows);

      if (nextSignature !== baselineSignature) {
        setEvents(nextRows);
        baselineSignature = nextSignature;
      }
    }
  }

  async function load(requestId?: number) {
    if (!site?.id) return;
    setLoading(true);
    setError(null);
    try {
      const rows = await fetchProgramEventsBySite(
        site.id,
        languages as SupportedLanguage[],
      );
      if (requestId !== undefined && fetchCounterRef.current !== requestId) {
        return;
      }

      setEvents(rows);

      if (requestId !== undefined) {
        await reconcileEvents(requestId, rows);
      }
    } catch {
      if (requestId !== undefined && fetchCounterRef.current !== requestId) {
        return;
      }

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

  function canAddMore() {
    return canUseQuota(planType, "events", events.length);
  }

  function goToPricing() {
    router.push(`/marketing/pricing?lang=${lang || "en"}`);
  }

  function startCreate() {
    setIsFormOpen(true);
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
    setError(null);
    setEditingId(null);
    setCompactOpenDays({
      day_before: false,
      wedding_day: false,
      day_after: false,
    });

    setTimeout(() => {
      formRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 120);
  }

  function startEdit(event: ProgramEvent) {
    setIsFormOpen(true);
    setEditingId(event.id);
    setForm({ ...event });
    setError(null);
    setCompactOpenDays({
      day_before: event.day_tag === "day_before",
      wedding_day: event.day_tag === "wedding_day",
      day_after: event.day_tag === "day_after",
    });

    setTimeout(() => {
      formRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 120);
  }

  function clearForm() {
    setIsFormOpen(false);
    setForm({ day_tag: "wedding_day" });
    setEditingId(null);
    setError(null);
  }

  function toggleCompactDay(day: string) {
    setCompactOpenDays((state) => ({
      ...state,
      [day]: !state[day],
    }));
  }

  function updateFormField<K extends keyof ProgramEvent>(
    key: K,
    value: ProgramEvent[K],
  ) {
    setForm((state) => ({ ...(state ?? {}), [key]: value }));
  }

  function updateI18nField(
    field: keyof ProgramEvent,
    locale: string,
    value: string,
  ) {
    setForm((state) => {
      const prev = (state?.[field] as Record<string, string> | undefined) ?? {};
      return {
        ...(state ?? {}),
        [field]: { ...prev, [locale]: value },
      } as Partial<ProgramEvent>;
    });
  }

  function handleFormMainToggle(checked: boolean) {
    if (form.day_tag === "wedding_day" && form.is_main_event && !checked) {
      const otherMainExists = events.some(
        (event) =>
          event.day_tag === "wedding_day" &&
          event.id !== editingId &&
          event.is_main_event,
      );

      if (!otherMainExists) {
        notify.error(
          translations["builder.toggle.error.empty-main-not-allowed"] ||
            "At least one main event must be set for Wedding Day.",
        );
        return;
      }
    }

    updateFormField("is_main_event", checked);
  }

  async function handleToggleMainEvent(event: ProgramEvent, makeMain: boolean) {
    if (saving) return;

    if (!makeMain) {
      const otherMainExists = events.some(
        (candidate) =>
          candidate.day_tag === "wedding_day" &&
          candidate.id !== event.id &&
          candidate.is_main_event,
      );

      if (!otherMainExists) {
        notify.error(
          translations["builder.program_events.error.empty-main-not-allowed"] ||
            "At least one main event must be set for Wedding Day.",
        );
        return;
      }

      await updateProgramEvent(event.id, { is_main_event: false });
      setEvents((prev) =>
        prev.map((row) =>
          row.id === event.id ? { ...row, is_main_event: false } : row,
        ),
      );
      return;
    }

    setSaving(true);

    try {
      setEvents((prev) =>
        prev.map((row) =>
          row.day_tag === "wedding_day"
            ? {
                ...row,
                is_main_event: row.id === event.id,
              }
            : row,
        ),
      );

      await Promise.all(
        events
          .filter((row) => row.day_tag === "wedding_day")
          .map((row) =>
            updateProgramEvent(row.id, {
              is_main_event: row.id === event.id,
            }),
          ),
      );
    } catch {
      notify.error(
        t(
          translations,
          "builder.program_events.error.update_failed",
          "Update failed",
        ),
      );
    } finally {
      setSaving(false);
    }
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

    if (
      form.day_tag === "wedding_day" &&
      weddingDayReferenceDate &&
      form.date !== weddingDayReferenceDate
    ) {
      const message = interpolate(
        t(
          translations,
          "builder.program_events.error.wedding_day_same_date",
          "All Wedding Day events must use the same date ({date}).",
        ),
        { date: weddingDayReferenceDate },
      );
      setError(message);
      notify.error(message);
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

    const {
      title: _ignoredTitle,
      location: _ignoredLocation,
      description: _ignoredDescription,
      ...structuralFields
    } = form;

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
      if (form.is_main_event && form.day_tag === "wedding_day") {
        await Promise.all(
          events
            .filter(
              (event) =>
                event.day_tag === "wedding_day" &&
                event.id !== editingId &&
                event.is_main_event,
            )
            .map((event) =>
              updateProgramEvent(event.id, { is_main_event: false }),
            ),
        );
      }

      if (editingId) {
        const updated = await updateProgramEvent(
          editingId,
          { site_id: site.id, ...structuralFields },
          translationArr,
        );

        if (!updated) {
          throw new Error(
            t(
              translations,
              "builder.program_events.error.update_failed",
              "Update failed",
            ),
          );
        }

        setEvents((prev) =>
          prev.map((event) => {
            if (event.id !== editingId) {
              if (
                form.is_main_event &&
                form.day_tag === "wedding_day" &&
                event.day_tag === "wedding_day"
              ) {
                return { ...event, is_main_event: false };
              }
              return event;
            }

            return {
              ...event,
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

        notify.success(
          translations["builder.general.form.save_success"] ||
            "Saved successfully.",
        );

        setEvents((prev) => {
          const cleaned =
            structuralFields.is_main_event &&
            structuralFields.day_tag === "wedding_day"
              ? prev.map((event) =>
                  event.day_tag === "wedding_day"
                    ? { ...event, is_main_event: false }
                    : event,
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
    const event = events.find((entry) => entry.id === id);

    if (event?.day_tag === "wedding_day" && event?.is_main_event) {
      notify.error(
        t(
          translations,
          "builder.program_events.error.delete_main_event",
          "Cannot delete the main event. Set another as main before deleting.",
        ),
      );
      return;
    }

    const okToDelete = await confirmDelete({
      title: t(translations, "builder.actions.delete", "Delete"),
      message: t(
        translations,
        "builder.program_events.confirm.delete",
        "Delete this event?",
      ),
      confirmLabel: t(translations, "builder.actions.delete", "Delete"),
      cancelLabel: t(translations, "builder.actions.cancel", "Cancel"),
      tone: "danger",
    });

    if (!okToDelete) return;

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

    setEvents((prev) => prev.filter((entry) => entry.id !== id));
    notify.success(
      translations["common.delete_success"] || "Deleted successfully.",
    );
    refresh();
  }

  return (
    <StepLayout
      translations={translations}
      onNext={hasPendingChanges ? handleSave : undefined}
      nextLoading={saving}
      nextDisabled={saving}
      onBack={hasPendingChanges ? clearForm : undefined}
      nextLabel={t(translations, "builder.program_events.button.save", "Save")}
      backLabel={t(
        translations,
        "builder.program_events.button.cancel",
        "Cancel",
      )}
    >
      <div className="mb-3 flex items-center justify-end gap-2">
        <BuilderButton
          variant="primary"
          size="sm"
          onClick={startCreate}
          disabled={!canAddMore()}
        >
          {t(translations, "builder.program_events.button.add", "+ Add event")}
        </BuilderButton>
      </div>

      <div className="mb-4 text-md text-gray-600">
        {interpolate(
          t(
            translations,
            "builder.program_events.info",
            "Events are grouped into Before Wedding Day, Wedding Day, and After Wedding Day. Free plan supports up to {limit} events total. Title and location are required in the site default language ({defaultLang}).",
          ),
          {
            limit: eventsLimitLabel,
            FREE_EVENT_LIMIT: eventsLimitLabel,
            defaultLang,
          },
        )}
      </div>

      <ProgramEventsList
        loading={loading}
        lang={lang}
        dayTags={dayTags}
        compactOpenDays={compactOpenDays}
        grouped={grouped}
        defaultLang={defaultLang}
        saving={saving}
        translations={translations}
        onToggleCompactDay={toggleCompactDay}
        onStartEdit={startEdit}
        onDelete={handleDelete}
        onToggleMainEvent={handleToggleMainEvent}
      />

      {hasPendingChanges && (
        <ProgramEventForm
          editingId={editingId}
          form={form}
          formRef={formRef}
          translations={translations}
          dayTags={dayTags}
          defaultLang={defaultLang}
          languages={languages}
          weddingDayReferenceDate={weddingDayReferenceDate}
          saving={saving}
          error={error}
          onUpdateFormField={updateFormField}
          onUpdateI18nField={updateI18nField}
          onToggleFormMain={handleFormMainToggle}
        />
      )}

      {!canAddMore() && (
        <PlanLimitNotice
          message={interpolate(
            t(
              translations,
              "builder.program_events.limit_reached",
              "Free plan limit reached ({limit} events). Upgrade to add more.",
            ),
            {
              limit: eventsLimitLabel,
              FREE_EVENT_LIMIT: eventsLimitLabel,
            },
          )}
          upgradeLabel={t(
            translations,
            "builder.program_events.button.upgrade",
            "Upgrade",
          )}
          onUpgrade={goToPricing}
        />
      )}

      {confirmDialog}
    </StepLayout>
  );
}
