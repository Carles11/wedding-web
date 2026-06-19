"use client";

import {
  createProgramEvent,
  deleteProgramEvent,
  fetchProgramEventsBySite,
  updateProgramEvent,
} from "@/3-entities/program_events/api";
import type { SupportedLanguage } from "@/4-shared/config/i18n";
import { getPlanLimit } from "@/4-shared/helpers/billing/entitlements";
import { timeToMinutes } from "@/4-shared/helpers/formatTime";
import { useAlertConfirm } from "@/4-shared/hooks/useAlertConfirm";
import { getEffectiveBuilderLanguage } from "@/4-shared/lib/builder-language/defaultLanguage";
import { notify } from "@/4-shared/lib/toast/toast";
import type {
  AccountInfo,
  PlanType,
  ProgramEvent,
  ProgramEventTranslation,
  Site,
} from "@/4-shared/types";
import { BuilderButton } from "@/4-shared/ui/builder";
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
  setHasMainProgramEvent?: (has: boolean) => void;
  account?: AccountInfo | null;
};

export default function ProgramEventsBuilderStep({
  site,
  refresh,
  lang,
  translations,
  planType,
  setHasMainProgramEvent,
  account,
}: Props) {
  const router = useRouter();
  const fetchCounterRef = useRef(0);
  const formRef = useRef<HTMLDivElement>(null);

  const [events, setEvents] = useState<ProgramEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // State for expanded/collapsed days in the list
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

  const { confirm: confirmDelete, confirmDialog } = useAlertConfirm();

  const eventsLimit = getPlanLimit(planType, "events");
  const eventsLimitLabel =
    eventsLimit === -1 ? "Unlimited" : String(eventsLimit);

  const languages = useMemo<SupportedLanguage[]>(() => {
    if (!site) return ["en"];
    return site.languages && site.languages.length > 0
      ? (site.languages as SupportedLanguage[])
      : [(site.default_lang as SupportedLanguage | null) ?? "en"];
  }, [site?.default_lang, site?.languages]);

  const defaultLang = useMemo(() => {
    const candidate =
      site?.default_lang &&
      languages.includes(site.default_lang as SupportedLanguage)
        ? (site.default_lang as SupportedLanguage)
        : "";
    return getEffectiveBuilderLanguage(languages, candidate);
  }, [languages, site?.default_lang]);

  const [activeLang, setActiveLang] = useState<SupportedLanguage>(defaultLang);
  const dayTags = getDayTags(translations);

  const weddingDayReferenceDate = useMemo(() => {
    const ref = events.find(
      (e) => e.day_tag === "wedding_day" && e.id !== editingId && e.date,
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
      if (map[key]) map[key].push(event);
    });
    Object.keys(map).forEach((day) => {
      map[day].sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time));
    });
    return map;
  }, [events]);

  const hasPendingChanges = isFormOpen;

  useEffect(() => {
    if (!site?.id) return;
    const requestId = ++fetchCounterRef.current;
    load(requestId);
  }, [site?.id, defaultLang, languages.join("|")]);

  async function load(requestId?: number) {
    if (!site?.id) return;
    setLoading(true);
    try {
      const rows = await fetchProgramEventsBySite(site.id, languages);
      if (requestId !== undefined && fetchCounterRef.current !== requestId)
        return;
      setEvents(rows);
    } catch {
      notify.error("Failed to fetch events");
    } finally {
      setLoading(false);
    }
  }

  function startCreate() {
    setIsFormOpen(true);
    setEditingId(null);
    setForm({
      day_tag: "wedding_day",
      title: {},
      location: {},
      description: {},
      is_main_event: false,
    });
    scrollToForm();
  }

  function startEdit(event: ProgramEvent) {
    setIsFormOpen(true);
    setEditingId(event.id);
    setForm({ ...event });
    scrollToForm();
  }

  function scrollToForm() {
    setTimeout(
      () =>
        formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
      120,
    );
  }

  function clearForm() {
    setIsFormOpen(false);
    setEditingId(null);
    setForm({ day_tag: "wedding_day" });
  }

  const toggleCompactDay = (day: string) => {
    setCompactOpenDays((prev) => ({ ...prev, [day]: !prev[day] }));
  };

  const handleToggleMainEvent = async (
    event: ProgramEvent,
    makeMain: boolean,
  ) => {
    setSaving(true);
    try {
      await updateProgramEvent(event.id, { is_main_event: makeMain });
      await load();
      notify.success("Main event updated");
    } catch (err) {
      notify.error("Update failed");
    } finally {
      setSaving(false);
    }
  };

  function updateFormField(key: keyof ProgramEvent, value: any) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function updateI18nField(
    field: keyof ProgramEvent,
    locale: string,
    value: string,
  ) {
    setForm((prev) => {
      const fieldData = (prev[field] as Record<string, string>) || {};
      return { ...prev, [field]: { ...fieldData, [locale]: value } };
    });
  }

  async function handleSave() {
    if (!site?.id) return;
    setSaving(true);
    try {
      const structural = { ...form };
      delete structural.title;
      delete structural.location;
      delete structural.description;

      const translationsArr: ProgramEventTranslation[] = (
        ["title", "location", "description"] as const
      ).flatMap((field) =>
        Object.entries((form[field] as Record<string, string>) || {}).map(
          ([locale, value]) => ({
            key: field,
            locale,
            value,
          }),
        ),
      );

      if (editingId) {
        await updateProgramEvent(
          editingId,
          { site_id: site.id, ...structural },
          translationsArr,
        );
      } else {
        await createProgramEvent(
          { site_id: site.id, ...structural },
          translationsArr,
        );
      }
      notify.success("Saved successfully");
      clearForm();
      refresh();
      load();
    } catch (err) {
      notify.error("Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <StepLayout
      translations={translations}
      onNext={hasPendingChanges ? handleSave : undefined}
      nextLoading={saving}
      onBack={hasPendingChanges ? clearForm : undefined}
    >
      <div className="flex justify-between items-center mb-6">
        <div className="text-gray-600 dark:text-gray-400 text-sm">
          Manage your wedding schedule events.
        </div>
        <BuilderButton
          variant="primary"
          onClick={startCreate}
          disabled={eventsLimit !== -1 && events.length >= eventsLimit}
        >
          + Add event
        </BuilderButton>
      </div>

      <ProgramEventsList
        loading={loading}
        lang={lang}
        dayTags={dayTags}
        compactOpenDays={compactOpenDays} // Added missing prop
        grouped={grouped}
        defaultLang={defaultLang}
        saving={saving} // Added missing prop
        translations={translations}
        onToggleCompactDay={toggleCompactDay} // Added missing prop
        onStartEdit={startEdit}
        onDelete={(id) => deleteProgramEvent(id).then(() => load())}
        onToggleMainEvent={handleToggleMainEvent} // Added missing prop
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
          activeLang={activeLang}
          planType={planType}
          weddingDayReferenceDate={weddingDayReferenceDate}
          saving={saving}
          error={error}
          onChangeActiveLang={setActiveLang}
          onUpdateFormField={updateFormField}
          onUpdateI18nField={updateI18nField}
          onToggleFormMain={(val) => updateFormField("is_main_event", val)}
          siteId={site?.id || ""}
        />
      )}

      {confirmDialog}
    </StepLayout>
  );
}
