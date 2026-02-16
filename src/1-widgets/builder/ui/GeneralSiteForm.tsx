"use client";

import React, { useEffect, useState } from "react";
import { getSiteGeneralContent } from "@/4-shared/api/builder/getSiteGeneralContent";
import { saveSiteGeneralContent } from "@/4-shared/api/builder/saveSiteGeneralContent";
import type { SupportedLanguage } from "@/4-shared/config/i18n";
import {
  SUPPORTED_LANGUAGES,
  SUPPORTED_LANGUAGE_LABELS,
} from "@/4-shared/config/i18n";
import type { Site } from "@/4-shared/types";

type Props = {
  site: Site | null;
  refresh: () => void;
  lang: string;
  translations: Record<string, string>;
  langLimit: number; // <--- NEW: max allowed languages from plan
  planType: "free" | "monthly" | "yearly"; // <--- NEW: show upgrade CTA
};

export default function GeneralSiteForm({
  site,
  refresh,
  translations,
  langLimit,
  planType,
}: Props) {
  const [languages, setLanguages] = useState<SupportedLanguage[]>(["en"]);
  const [defaultLang, setDefaultLang] = useState<SupportedLanguage>("en");
  const [subdomain, setSubdomain] = useState("");
  const [content, setContent] = useState<
    Record<SupportedLanguage, { title: string; subtitle: string }>
  >({});
  const [activeLang, setActiveLang] = useState<SupportedLanguage>("en");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showUpgradeCTA, setShowUpgradeCTA] = useState(false);

  useEffect(() => {
    if (!site) return;
    getSiteGeneralContent(site.id)
      .then((res) => {
        setLanguages(res.languages);
        setDefaultLang(res.default_lang);
        setSubdomain(res.subdomain);
        setContent(
          res.languages.reduce(
            (obj, lang) => {
              obj[lang] = {
                title: res.titles[lang] ?? "",
                subtitle: res.subtitles[lang] ?? "",
              };
              return obj;
            },
            {} as Record<
              SupportedLanguage,
              { title: string; subtitle: string }
            >,
          ),
        );
        setActiveLang(res.default_lang);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, [site]);

  const handleLangCheckbox = (lang: SupportedLanguage) => {
    setShowUpgradeCTA(false);
    setError(null);
    setSuccess(null);
    if (languages.includes(lang)) {
      // Always allow disabling a language, even on free
      const updated = languages.filter((l) => l !== lang);
      setLanguages(updated);
      // Switch to another if current was active
      if (activeLang === lang && updated.length > 0) setActiveLang(updated[0]);
      return;
    }
    if (languages.length >= langLimit) {
      setShowUpgradeCTA(true);
      return;
    }
    setLanguages((prev) => [...prev, lang]);
    setActiveLang(lang);
  };

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

    const val = content[activeLang] || { title: "", subtitle: "" };
    if (!val.title || val.title.trim().length === 0) {
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
        lang: activeLang,
        title: val.title.trim(),
        subtitle: val.subtitle.trim(),
        subdomain: !site.subdomain ? subdomain.trim().toLowerCase() : undefined,
        languages,
        default_lang: defaultLang,
      });
      setSuccess(
        translations["builder.general.form.save_success"] ||
          "Saved successfully.",
      );
      refresh();
    } catch (err: any) {
      setError(err.message);
    }
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Language Selection Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          {translations["builder.general.form.label.languages"] ?? "Languages"}
        </label>
        <p className="text-xs text-gray-500">
          {planType === "free"
            ? translations["builder.general.form.language_limit"] ||
              "Free plan: choose one language. Upgrade to add more."
            : translations["builder.general.form.language_limit_pro"] ||
              "You can enable all languages on your plan."}
        </p>
        <div className="flex flex-wrap gap-2 my-2">
          {SUPPORTED_LANGUAGES.map((lang) => (
            <label key={lang} className="inline-flex items-center">
              <input
                type="checkbox"
                value={lang}
                checked={languages.includes(lang)}
                onChange={() => handleLangCheckbox(lang)}
                className="mr-2"
                // Prevent enabling more than allowed
                disabled={
                  // You can't check if limit is reached and this lang isn't already enabled
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
              onClick={() => {
                // TODO: implement real upgrade flow
                alert(
                  translations["builder.general.form.upgrade"] ||
                    "Upgrade to Pro to unlock more languages.",
                );
              }}
            >
              {translations["builder.general.form.upgrade"] || "Upgrade to Pro"}
            </button>
          </div>
        )}
      </div>

      {/* Language Switch Tabs */}
      <div className="flex gap-1 mb-2">
        {languages.map((lang) => (
          <button
            type="button"
            key={lang}
            className={`px-2 py-1 rounded ${
              activeLang === lang
                ? "bg-blue-700 text-white"
                : "bg-white text-gray-800 border"
            }`}
            onClick={() => setActiveLang(lang)}
            disabled={!languages.includes(lang)}
          >
            {SUPPORTED_LANGUAGE_LABELS[lang]}
          </button>
        ))}
      </div>

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

      <div>
        <label className="block text-sm font-medium text-gray-700">
          {translations["builder.general.form.label.subdomain"] ?? "Subdomain"}
        </label>
        {site?.subdomain ? (
          <div className="mt-1 text-sm text-gray-700">{site.subdomain}</div>
        ) : (
          <div className="mt-1 flex gap-2 items-center">
            <input
              value={subdomain}
              onChange={(e) => setSubdomain(e.target.value)}
              placeholder="your-name-2026"
              className="rounded border px-3 py-2"
            />
            <span className="text-sm text-gray-500">.weddweb.com</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded"
          disabled={saving}
        >
          {saving
            ? (translations["builder.general.form.saving"] ?? "Saving…")
            : (translations["builder.general.form.save"] ?? "Save")}
        </button>
        <a
          className={`text-sm ${site?.subdomain ? "text-blue-600" : "text-gray-400"}`}
          href={
            site?.subdomain
              ? `https://${site.subdomain}.weddweb.com`
              : undefined
          }
          target="_blank"
          rel="noreferrer"
        >
          {translations["builder.general.form.preview"] ?? "Preview site"}
        </a>
        {success && <div className="text-sm text-green-600">{success}</div>}
        {error && <div className="text-sm text-red-600">{error}</div>}
      </div>
    </form>
  );
}
