"use client";

import { RsvpAnalyticsTab } from "@/1-widgets/builder/ui/steps/rsvp/RsvpAnalyticsTab";
import type { PlanType, Site } from "@/4-shared/types";
import { useEffect, useState } from "react";
import { RsvpPartiesTab } from "./rsvp/RsvpPartiesTab";
import { RsvpResponsesTab } from "./rsvp/RsvpResponsesTab";

type Props = {
  site: Site | null;
  refresh: () => void;
  lang: string;
  translations: Record<string, string>;
  planType: PlanType;
  setHasRsvpEnabled: (v: boolean) => void;
};

/** Convert an ISO string (UTC) to the value expected by <input type="datetime-local">. */
function isoToDatetimeLocal(iso: string | null): string {
  if (!iso) return "";
  // Date constructor parses ISO correctly; toISOString gives UTC YYYY-MM-DDTHH:mm:ss.sssZ
  // Slice to minute precision and replace 'Z' — the native input expects local time without timezone
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` +
    `T${pad(d.getHours())}:${pad(d.getMinutes())}`
  );
}

/** Convert a datetime-local string (local time) to ISO UTC string, or null if empty. */
function datetimeLocalToIso(local: string): string | null {
  if (!local) return null;
  const d = new Date(local); // parsed as local time by spec
  if (isNaN(d.getTime())) return null;
  return d.toISOString();
}

export default function RsvpBuilderStep({
  site,
  lang,
  translations,
  planType,
  setHasRsvpEnabled,
}: Props) {
  const [activeTab, setActiveTab] = useState<
    "settings" | "parties" | "responses" | "analytics"
  >("settings");
  const [isEnabled, setIsEnabled] = useState(false);
  const [deadlineLocal, setDeadlineLocal] = useState(""); // datetime-local string
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Load current settings via the authenticated GET route
  useEffect(() => {
    if (!site?.id) return;
    setLoading(true);
    setLoadError(null);
    fetch(`/api/sites/${site.id}/rsvp-settings`, { method: "GET" })
      .then(async (res) => {
        const json = (await res.json()) as {
          success: boolean;
          settings?: { is_enabled: boolean; deadline_at: string | null } | null;
          error?: string;
        };
        if (json.success && json.settings) {
          setIsEnabled(json.settings.is_enabled);
          setDeadlineLocal(
            isoToDatetimeLocal(json.settings.deadline_at ?? null),
          );
        } else if (!json.success) {
          setLoadError(
            translations["builder.rsvp.load.error"] ||
              "Failed to load RSVP settings.",
          );
        }
      })
      .catch(() => {
        setLoadError(
          translations["builder.rsvp.load.error"] ||
            "Failed to load RSVP settings.",
        );
      })
      .finally(() => setLoading(false));
  }, [site?.id]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!site?.id) return;

    setSaving(true);
    setSaveSuccess(false);
    setSaveError(null);

    try {
      const res = await fetch(`/api/sites/${site.id}/rsvp-settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          is_enabled: isEnabled,
          deadline_at: isEnabled ? datetimeLocalToIso(deadlineLocal) : null,
        }),
      });

      const json = (await res.json()) as { success: boolean; error?: string };

      if (!res.ok || !json.success) {
        setSaveError(json.error ?? "Save failed");
      } else {
        setSaveSuccess(true);
        setHasRsvpEnabled(isEnabled);
        // Clear success flash after 3 s
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch {
      setSaveError("Network error — please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="rounded border border-(--builder-color-border) bg-white p-6">
        <p className="text-sm text-(--builder-color-text-muted)">
          {translations["builder.rsvp.loading"] || "Loading RSVP settings…"}
        </p>
      </div>
    );
  }
  if (loadError) {
    return (
      <div className="rounded border border-(--builder-color-border) bg-white p-6">
        <p className="text-sm text-red-600">{loadError}</p>
      </div>
    );
  }

  return (
    <div className="rounded border border-(--builder-color-border) bg-white p-6">
      {/* Tab switcher */}
      <div className="flex gap-1 mb-6 border-b border-(--builder-color-border)">
        <button
          type="button"
          onClick={() => setActiveTab("settings")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "settings"
              ? "border-(--builder-color-primary) text-(--builder-color-primary)"
              : "border-transparent text-(--builder-color-text-muted) hover:text-(--builder-color-text)"
          }`}
        >
          {translations["builder.rsvp.tab.settings"] || "Settings"}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("parties")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "parties"
              ? "border-(--builder-color-primary) text-(--builder-color-primary)"
              : "border-transparent text-(--builder-color-text-muted) hover:text-(--builder-color-text)"
          }`}
        >
          {translations["builder.rsvp.tab.guests"] || "Guests"}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("responses")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "responses"
              ? "border-(--builder-color-primary) text-(--builder-color-primary)"
              : "border-transparent text-(--builder-color-text-muted) hover:text-(--builder-color-text)"
          }`}
        >
          {translations["builder.rsvp.tab.responses"] || "Responses"}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("analytics")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "analytics"
              ? "border-(--builder-color-primary) text-(--builder-color-primary)"
              : "border-transparent text-(--builder-color-text-muted) hover:text-(--builder-color-text)"
          }`}
        >
          {translations["builder.rsvp.tab.analytics"] || "Analytics"}
        </button>
      </div>

      {activeTab === "parties" && site?.id ? (
        <RsvpPartiesTab
          siteId={site.id}
          lang={lang}
          translations={translations}
          planType={planType}
        />
      ) : activeTab === "responses" && site?.id ? (
        <RsvpResponsesTab siteId={site.id} translations={translations} />
      ) : activeTab === "analytics" && site?.id ? (
        <RsvpAnalyticsTab
          siteId={site.id}
          lang={lang}
          planType={planType}
          translations={translations}
        />
      ) : activeTab === "parties" ? null : (
        <>
          <p className="mt-1 text-sm text-(--builder-color-text-muted)">
            {translations["builder.rsvp.description"] ||
              "Let guests RSVP online. Enable this step to activate the RSVP flow on your site."}
          </p>

          <form onSubmit={handleSave} className="mt-6 space-y-6">
            {/* Enable toggle */}
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <button
                type="button"
                role="switch"
                aria-checked={isEnabled}
                onClick={() => setIsEnabled((v) => !v)}
                className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                  isEnabled ? "bg-(--builder-color-primary)" : "bg-gray-200"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition-transform ${
                    isEnabled ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
              <span className="text-sm font-medium text-(--builder-color-text)">
                {isEnabled
                  ? translations["builder.rsvp.toggle.enabled"] ||
                    "RSVP enabled"
                  : translations["builder.rsvp.toggle.disabled"] ||
                    "RSVP disabled"}
              </span>
            </label>

            {/* Deadline (shown only when enabled) */}
            {isEnabled && (
              <div className="space-y-1">
                <label
                  htmlFor="rsvp-deadline"
                  className="block text-sm font-medium text-(--builder-color-text)"
                >
                  {translations["builder.rsvp.deadline.label"] ||
                    "RSVP deadline"}
                  <span className="ml-1 font-normal text-(--builder-color-text-muted)">
                    (
                    {translations["builder.rsvp.deadline.optional"] ||
                      "optional"}
                    )
                  </span>
                </label>
                <input
                  id="rsvp-deadline"
                  type="datetime-local"
                  value={deadlineLocal}
                  onChange={(e) => setDeadlineLocal(e.target.value)}
                  className="block w-full max-w-xs rounded border border-(--builder-color-border) bg-white px-3 py-1.5 text-sm text-(--builder-color-text) focus:outline-none focus:ring-2 focus:ring-(--builder-color-primary, #4f46e5)"
                />
                <p className="text-xs text-(--builder-color-text-muted)">
                  {translations["builder.rsvp.deadline.hint"] ||
                    "After this date, guests will no longer be able to submit their RSVP."}
                </p>
              </div>
            )}

            {/* Save row */}
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={saving}
                className="rounded bg-(--builder-color-primary, #4f46e5) px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50 transition-opacity"
              >
                {saving
                  ? translations["builder.rsvp.saving"] || "Saving…"
                  : translations["builder.rsvp.save"] || "Save"}
              </button>

              {saveSuccess && (
                <span className="text-sm text-green-600">
                  {translations["builder.rsvp.save.success"] || "Saved!"}
                </span>
              )}
              {saveError && (
                <span className="text-sm text-red-600">{saveError}</span>
              )}
            </div>
          </form>
        </>
      )}
    </div>
  );
}
