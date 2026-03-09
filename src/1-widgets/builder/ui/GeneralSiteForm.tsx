"use client";

import React, { useEffect, useState } from "react";
import { getSiteGeneralContent } from "@/4-shared/api/builder/getSiteGeneralContent";
import { saveSiteGeneralContent } from "@/4-shared/api/builder/saveSiteGeneralContent";
import type { SupportedLanguage } from "@/4-shared/config/i18n";
import {
  SUPPORTED_LANGUAGES,
  SUPPORTED_LANGUAGE_LABELS,
} from "@/4-shared/config/i18n";
import type { Site, PlanType } from "@/4-shared/types";
import { StepLayout } from "../step-layout";

type Props = {
  site: Site | null;
  refresh: () => void;
  lang: string;
  translations: Record<string, string>;
  langLimit: number;
  planType: PlanType;
};

export default function GeneralSiteForm({
  site,
  refresh,
  translations,
  langLimit,
  planType,
}: Props) {
  const [languages, setLanguages] = useState<SupportedLanguage[]>([]);
  const [defaultLang, setDefaultLang] = useState<SupportedLanguage>("en");
  const [subdomain, setSubdomain] = useState("");
  const [heroId, setHeroId] = useState<string | null>(null);
  const [content, setContent] = useState<
    Partial<Record<SupportedLanguage, { title: string; subtitle: string }>>
  >({});
  const [activeLang, setActiveLang] = useState<SupportedLanguage>("en");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showUpgradeCTA, setShowUpgradeCTA] = useState(false);

  // 🔹 Fetch + sync
  const fetchAndApplyGeneralContent = async () => {
    if (!site) return;
    try {
      const res = await getSiteGeneralContent(site.id);
      setLanguages(res.languages);
      setDefaultLang(res.default_lang);
      setSubdomain(res.subdomain);
      setHeroId(res.heroId);

      setContent(
        res.languages.reduce(
          (obj, lang) => {
            obj[lang] = {
              title: res.titles[lang] ?? "",
              subtitle: res.subtitles[lang] ?? "",
            };
            return obj;
          },
          {} as Record<SupportedLanguage, { title: string; subtitle: string }>,
        ),
      );

      setActiveLang(res.default_lang);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  // Initial and whenever site changes, always fetch fresh
  useEffect(() => {
    const fetchData = async () => {
      await fetchAndApplyGeneralContent();
    };
    fetchData();
    // eslint-disable-next-line
  }, [site?.id]);

  // 🔹 Language toggle
  const handleLangCheckbox = (lang: SupportedLanguage) => {
    setShowUpgradeCTA(false);
    setError(null);
    setSuccess(null);

    if (languages.includes(lang)) {
      const updated = languages.filter((l) => l !== lang);
      setLanguages(updated);

      setContent((curr) => {
        const copy = { ...curr };
        delete copy[lang];
        return copy;
      });

      if (activeLang === lang && updated.length > 0) setActiveLang(updated[0]);
      else if (updated.length === 0) setActiveLang("en");
      return;
    }

    if (languages.length >= langLimit) {
      setShowUpgradeCTA(true);
      return;
    }

    setLanguages((prev) => [...prev, lang]);
    setContent((curr) => ({
      ...curr,
      [lang]: { title: "", subtitle: "" },
    }));
    setActiveLang(lang);
  };

  // 🔹 Save
  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);
    setSuccess(null);

    if (!site) {
      setError(
        translations["builder.errors.site_not_ready"] || "Site not ready.",
      );
      return;
    }

    const val = content[activeLang] || {
      title: "",
      subtitle: "",
    };

    if (!val.title?.trim()) {
      setError(
        translations["builder.errors.missing_title"] ||
          "Please enter a site title.",
      );
      return;
    }

    setSaving(true);
    try {
      await saveSiteGeneralContent({
        site_id: site.id,
        heroId,
        content,
        subdomain: !site.subdomain ? subdomain.trim().toLowerCase() : undefined,
        languages,
        default_lang: defaultLang,
      });

      setSuccess(
        translations["builder.general.form.save_success"] ||
          "Saved successfully.",
      );

      refresh();
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("An unknown error occurred.");
    }
    setSaving(false);
  };

  return (
    <StepLayout
      nextLabel="Save"
      backLabel="Cancel"
      onNext={handleSubmit}
      onBack={() => {
        /* optional: handle cancel/exit here */
      }}
      backDisabled
      translations={translations}
    >
      {" "}
      <form onSubmit={handleSubmit} className="space-y-4 min-w-0 pb-24 md:pb-0">
        {/* Languages */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {translations["builder.general.form.label.languages"] ??
              "Languages"}
          </label>

          <p className="text-xs text-gray-500">
            {planType === "free"
              ? translations["builder.general.form.language_limit"] ||
                "Free plan: choose one language. Upgrade to add more."
              : translations["builder.general.form.language_limit_pro"] ||
                "You can enable all languages on your plan."}
          </p>

          <div className="flex flex-wrap gap-x-3 gap-y-2 my-2">
            {SUPPORTED_LANGUAGES.map((lang) => (
              <label key={lang} className="inline-flex items-center">
                <input
                  type="checkbox"
                  value={lang}
                  checked={languages.includes(lang)}
                  onChange={() => handleLangCheckbox(lang)}
                  className="mr-2"
                  disabled={
                    !languages.includes(lang) && languages.length >= langLimit
                  }
                />
                {SUPPORTED_LANGUAGE_LABELS[lang]}
              </label>
            ))}
          </div>

          {showUpgradeCTA && planType === "free" && (
            <div className="mt-2 text-sm text-yellow-800">
              {translations["builder.general.form.need_more_langs"] ||
                "Need more languages?"}{" "}
              <button
                className="underline text-blue-600"
                type="button"
                onClick={() =>
                  alert(
                    translations["builder.general.form.upgrade"] ||
                      "Upgrade to Pro to unlock more languages.",
                  )
                }
              >
                {translations["builder.general.form.upgrade"] ||
                  "Upgrade to Pro"}
              </button>
            </div>
          )}
        </div>

        {/* Language tabs */}
        <div className="flex flex-wrap gap-1 mb-2">
          {languages.map((lang) => (
            <button
              type="button"
              key={lang}
              className={`px-3 py-1.5 rounded text-sm ${
                activeLang === lang
                  ? "bg-blue-700 text-white"
                  : "bg-white text-gray-800 border"
              }`}
              onClick={() => setActiveLang(lang)}
            >
              {SUPPORTED_LANGUAGE_LABELS[lang]}
            </button>
          ))}
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {translations["builder.general.form.label.main_title"] ??
              "Main title"}
          </label>
          <input
            className="mt-1 block w-full rounded border px-3 py-2"
            value={content[activeLang]?.title ?? ""}
            onChange={(e) =>
              setContent((c) => ({
                ...c,
                [activeLang]: {
                  ...c[activeLang],
                  title: e.target.value,
                },
              }))
            }
            required
          />
        </div>

        {/* Subtitle */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {translations["builder.general.form.label.subtitle"] ?? "Subtitle"}
          </label>
          <textarea
            rows={3}
            className="mt-1 block w-full rounded border px-3 py-2"
            value={content[activeLang]?.subtitle ?? ""}
            onChange={(e) =>
              setContent((c) => ({
                ...c,
                [activeLang]: {
                  ...c[activeLang],
                  subtitle: e.target.value,
                },
              }))
            }
          />
        </div>

        {/* Subdomain */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {translations["builder.general.form.label.subdomain"] ??
              "Subdomain"}
          </label>

          {site?.subdomain ? (
            <div className="mt-1 text-sm text-gray-700">{site.subdomain}</div>
          ) : (
            <div className="mt-1 flex flex-col sm:flex-row gap-2 sm:items-center">
              <input
                value={subdomain}
                onChange={(e) => setSubdomain(e.target.value)}
                placeholder="your-name-2026"
                className="w-full sm:w-auto min-w-0 rounded border px-3 py-2"
              />
              <span className="text-sm text-gray-500">.weddweb.com</span>
            </div>
          )}
        </div>

        {/* Status */}
        {success && <div className="text-sm text-green-600">{success}</div>}
        {error && <div className="text-sm text-red-600">{error}</div>}
      </form>
    </StepLayout>
  );
}
