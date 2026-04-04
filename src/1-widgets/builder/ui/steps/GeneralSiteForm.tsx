"use client";

import { updateSiteFonts } from "@/3-entities/sites/api/updateSiteFonts";
import { getSiteGeneralContent } from "@/4-shared/api/builder/getSiteGeneralContent";
import { saveSiteGeneralContent } from "@/4-shared/api/builder/saveSiteGeneralContent";
import type { SupportedLanguage } from "@/4-shared/config/i18n";
import {
  SUPPORTED_LANGUAGE_LABELS,
  SUPPORTED_LANGUAGES,
} from "@/4-shared/config/i18n";
import {
  AVAILABLE_BODY_FONTS,
  AVAILABLE_TITLE_FONTS,
  DEFAULT_TENANT,
  type FontOption,
  type FontStyle,
} from "@/4-shared/lib/fonts/fontRegistry";
import { notify } from "@/4-shared/lib/toast/toast";
import { GeneralContentState, GeneralSiteFormProps } from "@/4-shared/types";
import { BuilderLangTabs, UpgradeCTAModal } from "@/4-shared/ui/builder";
import { SkeletonLoader } from "@/4-shared/ui/commons/loader/SkeletonLoader";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { StepLayout } from "../../step-layout";

export default function GeneralSiteForm({
  site,
  refresh,
  lang,
  translations,
  langLimit,
  planType,
  setGeneralComplete,
}: GeneralSiteFormProps) {
  const router = useRouter();
  const fetchCounterRef = useRef(0);
  const lastFetchedRef = useRef<GeneralContentState | null>(null);
  const [languages, setLanguages] = useState<SupportedLanguage[]>([]);
  const [defaultLang, setDefaultLang] = useState<SupportedLanguage>("en");
  const [subdomain, setSubdomain] = useState("");
  const [heroId, setHeroId] = useState<string | null>(null);
  const [content, setContent] = useState<
    Partial<Record<SupportedLanguage, { title: string; subtitle: string }>>
  >({});
  const [activeLang, setActiveLang] = useState<SupportedLanguage>("en");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Extra error states
  const [titleError, setTitleError] = useState<string | null>(null);
  const [subtitleError, setSubtitleError] = useState<string | null>(null);
  const [languageError, setLanguageError] = useState<string | null>(null);
  const [showUpgradeCTA, setShowUpgradeCTA] = useState(false);
  const [showFontUpgradeCTA, setShowFontUpgradeCTA] = useState(false);
  const [selectedTitleFont, setSelectedTitleFont] = useState(
    site?.title_font ?? DEFAULT_TENANT.title,
  );
  const [selectedBodyFont, setSelectedBodyFont] = useState(
    site?.body_font ?? DEFAULT_TENANT.body,
  );
  const [savingFonts, setSavingFonts] = useState(false);

  function arraysEqual<T>(a: T[], b: T[]) {
    if (a.length !== b.length) return false;
    return a.every((v, i) => v === b[i]);
  }

  function applyGeneralContent(res: GeneralContentState) {
    lastFetchedRef.current = res;
    setLanguages(res.languages);
    setDefaultLang(res.default_lang);
    setSubdomain(res.subdomain);
    setHeroId(res.heroId);

    setContent(
      res.languages.reduce(
        (obj, language) => {
          obj[language] = {
            title: res.titles[language] ?? "",
            subtitle: res.subtitles[language] ?? "",
          };
          return obj;
        },
        {} as Record<SupportedLanguage, { title: string; subtitle: string }>,
      ),
    );

    // For premium users, update font selectors from the latest DB values
    if (planType === "premium") {
      setSelectedTitleFont(res.title_font ?? DEFAULT_TENANT.title);
      setSelectedBodyFont(res.body_font ?? DEFAULT_TENANT.body);
    }

    setActiveLang(res.default_lang);
    setGeneralComplete?.(!!res.titles[res.default_lang]?.trim());
  }

  // Group font options by style for the dropdown
  function groupByStyle(fonts: FontOption[]) {
    const groups: Partial<Record<FontStyle, FontOption[]>> = {};
    for (const f of fonts) {
      (groups[f.style] ??= []).push(f);
    }
    return groups;
  }

  async function handleFontChange(kind: "title" | "body", fontId: string) {
    if (planType !== "premium") {
      setShowFontUpgradeCTA(true);
      return;
    }

    const nextTitle = kind === "title" ? fontId : selectedTitleFont;
    const nextBody = kind === "body" ? fontId : selectedBodyFont;

    if (kind === "title") setSelectedTitleFont(fontId);
    else setSelectedBodyFont(fontId);

    if (!site?.id) return;

    setSavingFonts(true);
    try {
      const result = await updateSiteFonts(site.id, nextTitle, nextBody);
      if (!result.success) {
        notify.error(result.error ?? "Failed to update fonts.");
        // revert
        if (kind === "title") setSelectedTitleFont(selectedTitleFont);
        else setSelectedBodyFont(selectedBodyFont);
      }
    } catch {
      notify.error(
        translations["error.something_went_wrong"] ??
          "An unknown error occurred.",
      );
      if (kind === "title") setSelectedTitleFont(selectedTitleFont);
      else setSelectedBodyFont(selectedBodyFont);
    } finally {
      setSavingFonts(false);
    }
  }

  function generalContentSignature(res: GeneralContentState): string {
    return JSON.stringify({
      languages: res.languages,
      default_lang: res.default_lang,
      subdomain: res.subdomain,
      heroId: res.heroId,
      titles: res.titles,
      subtitles: res.subtitles,
    });
  }

  async function reconcileGeneralContent(
    requestId: number,
    baseline: GeneralContentState,
    maxAttempts = 3,
  ) {
    if (!site?.id) return;

    let baselineSignature = generalContentSignature(baseline);

    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      if (!site?.id || fetchCounterRef.current !== requestId) return;

      const nextRes = await getSiteGeneralContent(site.id);
      const nextSignature = generalContentSignature(nextRes);

      if (nextSignature !== baselineSignature) {
        applyGeneralContent(nextRes);
        baselineSignature = nextSignature;
      }
    }
  }

  // 🔹 Fetch + sync
  const fetchAndApplyGeneralContent = async (
    requestId?: number,
    isActive?: () => boolean,
  ) => {
    if (!site) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await getSiteGeneralContent(site.id);
      if (
        (requestId !== undefined && fetchCounterRef.current !== requestId) ||
        (isActive && !isActive())
      ) {
        return;
      }

      applyGeneralContent(res);

      if (requestId !== undefined) {
        await reconcileGeneralContent(requestId, res);
      }
    } catch (err) {
      if (isActive && !isActive()) {
        return;
      }

      notify.error(
        err instanceof Error
          ? err.message
          : translations["error.something_went_wrong"] ||
              "An unknown error occurred.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Initial and whenever site changes, always fetch fresh
  useEffect(() => {
    if (!site?.id) {
      setLoading(false);
      return;
    }

    let mounted = true;
    const requestId = ++fetchCounterRef.current;
    const isActive = () => mounted && fetchCounterRef.current === requestId;

    const fetchData = async () => {
      await fetchAndApplyGeneralContent(requestId, isActive);
    };

    fetchData();

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line
  }, [site?.id]);

  if (loading) {
    return <SkeletonLoader />;
  }

  // 🔹 Language toggle
  // 🔹 Discard changes
  const handleDiscard = () => {
    if (lastFetchedRef.current) {
      applyGeneralContent(lastFetchedRef.current);
    }
    setError(null);
  };

  // 🔹 Language toggle
  const handleLangCheckbox = (lang: SupportedLanguage) => {
    setShowUpgradeCTA(false);
    setError(null);

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

    if (langLimit !== -1 && languages.length >= langLimit) {
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
    if (saving) return;
    setError(null);
    setTitleError(null);
    setSubtitleError(null);
    setLanguageError(null);

    if (!site) {
      notify.error(
        translations["builder.errors.site_not_ready"] || "Site not ready.",
      );
      return;
    }

    // Import subdomain validation
    // eslint-disable-next-line @typescript-eslint/no-var-requires

    const val = content[activeLang] || {
      title: "",
      subtitle: "",
    };

    // Title validation
    if (!val.title?.trim()) {
      setTitleError(
        translations["builder.errors.missing_title"] ||
          "Please enter a site title.",
      );
      return;
    }
    if (val.title.trim().length < 3) {
      setTitleError(
        translations["builder.errors.title_too_short"] ||
          "Site title must be at least 3 characters.",
      );
      return;
    }
    if (val.title.trim().length > 100) {
      setTitleError(
        translations["builder.errors.title_too_long"] ||
          "Site title must be less than 100 characters.",
      );
      return;
    }

    // Subtitle validation
    if (val.subtitle && val.subtitle.length > 200) {
      setSubtitleError(
        translations["builder.errors.subtitle_too_long"] ||
          "Subtitle must be less than 200 characters.",
      );
      return;
    }

    // Language validation
    if (!languages.length) {
      setLanguageError(
        translations["builder.errors.missing_language"] ||
          "Please select at least one language.",
      );
      return;
    }
    // Prevent duplicates
    if (new Set(languages).size !== languages.length) {
      setLanguageError(
        translations["builder.errors.duplicate_language"] ||
          "Duplicate languages selected.",
      );
      return;
    }
    // Ensure all are supported
    if (!languages.every((l) => SUPPORTED_LANGUAGES.includes(l))) {
      setLanguageError(
        translations["builder.errors.unsupported_language"] ||
          "Unsupported language selected.",
      );
      return;
    }

    const existingLanguages = (site.languages ?? []) as SupportedLanguage[];
    const languagesChanged = !arraysEqual(existingLanguages, languages);
    const defaultLangChanged = (site.default_lang ?? "en") !== defaultLang;
    const shouldRefreshSiteMeta = languagesChanged || defaultLangChanged;

    setSaving(true);
    try {
      await saveSiteGeneralContent({
        site_id: site.id,
        heroId: heroId,
        content,
        languages,
        default_lang: defaultLang,
      });
      if (shouldRefreshSiteMeta) {
        await refresh();
      }

      const defLang = defaultLang;
      setGeneralComplete?.(!!content[defLang]?.title?.trim());

      notify.success(
        translations["builder.general.form.save_success"] ||
          "Saved successfully.",
      );
    } catch (err: unknown) {
      notify.error(
        err instanceof Error
          ? err.message
          : translations["error.something_went_wrong"] ||
              "An unknown error occurred.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <StepLayout
      nextLabel="Save"
      backLabel="Cancel"
      onNext={handleSubmit}
      nextDisabled={saving}
      nextLoading={saving}
      translations={translations}
      onBack={handleDiscard}
    >
      {" "}
      <form onSubmit={handleSubmit} className="space-y-4 min-w-0 pb-24 md:pb-0">
        {/* Languages */}
        <div>
          {/* Languages Selection Block */}
          <div className="space-y-3">
            <div className="flex flex-col gap-1">
              <label className="block text-md font-medium text-gray-800">
                {translations["builder.general.form.label.languages"] ??
                  "Select your website display languages"}
              </label>
              <p
                className={`text-xs ${planType === "free" ? "text-amber-600 font-medium" : "text-gray-500"}`}
              >
                {planType === "free"
                  ? translations["builder.general.form.language_limit"] ||
                    "Free plan: 1 language. Upgrade to add more."
                  : translations["builder.general.form.language_limit_pro"] ||
                    "All languages enabled on your plan."}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 py-1">
              {SUPPORTED_LANGUAGES.map((langCode) => {
                const isSelected = languages.includes(langCode);
                const isLocked =
                  planType === "free" && !isSelected && languages.length >= 1;

                return (
                  <label
                    key={langCode}
                    className={`
            builder-chip 
            ${isSelected ? "builder-chip-active" : "builder-chip-idle"}
            ${isLocked ? "builder-chip-locked" : ""}
          `}
                    onClick={(e) => {
                      if (isLocked) {
                        e.preventDefault();
                        setShowUpgradeCTA(true);
                      }
                    }}
                  >
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={isSelected}
                      onChange={() => !isLocked && handleLangCheckbox(langCode)}
                      disabled={isLocked}
                    />

                    {/* Status Dot */}
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${isSelected ? "bg-white" : "bg-gray-300"}`}
                    />

                    {SUPPORTED_LANGUAGE_LABELS[langCode]}

                    {isLocked && (
                      <svg
                        className="h-3 w-3 ml-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" />
                      </svg>
                    )}
                  </label>
                );
              })}
            </div>
          </div>

          <UpgradeCTAModal
            open={showUpgradeCTA && planType === "free"}
            title={
              translations["builder.general.form.need_more_langs"] ||
              "Need more languages?"
            }
            description={
              translations["builder.general.form.upgrade_description"] ||
              "Your current plan only allows one language. Upgrade to Premium to unlock all languages for your wedding site."
            }
            cancelLabel={
              translations["builder.general.form.cancel"] || "Cancel"
            }
            upgradeLabel={
              translations["builder.general.form.upgrade"] ||
              "Upgrade to Premium"
            }
            onClose={() => setShowUpgradeCTA(false)}
            onUpgrade={() => router.push(`/${lang}/pricing`)}
          />
        </div>

        {/* Language tabs */}
        <BuilderLangTabs
          languages={languages}
          activeLang={activeLang}
          onChange={(l) => setActiveLang(l as SupportedLanguage)}
          getLabel={(l) => SUPPORTED_LANGUAGE_LABELS[l as SupportedLanguage]}
        />

        {/* Title */}
        <div>
          <label className="block text-md font-normal text-gray-700">
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
          <label className="block text-md font-normal text-gray-700">
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

        {/* ── Font Selectors ─────────────────────────────────── */}
        <fieldset className="space-y-4 rounded-lg border border-gray-200 p-4">
          <legend className="px-2 text-md font-medium text-gray-700">
            {translations["builder.fonts.section.title"] ?? "Typography"}
          </legend>

          {/* Title Font */}
          <div>
            <label
              htmlFor="title-font-select"
              className="block text-sm font-normal text-gray-600"
            >
              {translations["builder.fonts.label.title_font"] ?? "Title Font"}
            </label>
            <select
              id="title-font-select"
              value={selectedTitleFont}
              onChange={(e) => handleFontChange("title", e.target.value)}
              disabled={savingFonts}
              className="mt-1 block w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              {Object.entries(groupByStyle(AVAILABLE_TITLE_FONTS)).map(
                ([style, fonts]) => (
                  <optgroup key={style} label={style}>
                    {fonts!.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name}
                      </option>
                    ))}
                  </optgroup>
                ),
              )}
            </select>
          </div>

          {/* Body Font */}
          <div>
            <label
              htmlFor="body-font-select"
              className="block text-sm font-normal text-gray-600"
            >
              {translations["builder.fonts.label.body_font"] ?? "Body Font"}
            </label>
            <select
              id="body-font-select"
              value={selectedBodyFont}
              onChange={(e) => handleFontChange("body", e.target.value)}
              disabled={savingFonts}
              className="mt-1 block w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              {Object.entries(groupByStyle(AVAILABLE_BODY_FONTS)).map(
                ([style, fonts]) => (
                  <optgroup key={style} label={style}>
                    {fonts!.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name}
                      </option>
                    ))}
                  </optgroup>
                ),
              )}
            </select>
          </div>

          {/* Font Preview */}
          <div className="rounded-md border border-dashed border-gray-300 bg-gray-50 p-4 text-center">
            <p className="mb-1 text-xs uppercase tracking-wide text-gray-400">
              {translations["builder.fonts.preview.label"] ?? "Preview"}
            </p>
            <p
              className="text-2xl leading-snug"
              style={{
                fontFamily: `var(${AVAILABLE_TITLE_FONTS.find((f) => f.id === selectedTitleFont)?.variable ?? "--font-playfair-display"})`,
              }}
            >
              {translations["builder.fonts.select.placeholder"] ??
                "We are getting married!"}
            </p>
            <p
              className="mt-2 text-base text-gray-600"
              style={{
                fontFamily: `var(${AVAILABLE_BODY_FONTS.find((f) => f.id === selectedBodyFont)?.variable ?? "--font-roboto"})`,
              }}
            >
              {translations["builder.fonts.preview.body"] ??
                "Join us for our special day and celebrate love."}
            </p>
          </div>

          {/* Font Upgrade CTA */}
          <UpgradeCTAModal
            open={showFontUpgradeCTA && planType === "free"}
            title={
              translations["builder.fonts.upgrade.title"] ??
              "Custom fonts are a Premium feature"
            }
            description={
              translations["builder.fonts.upgrade.description"] ??
              "Upgrade to Premium to personalise your wedding site with beautiful custom fonts."
            }
            cancelLabel={
              translations["builder.general.form.cancel"] ?? "Cancel"
            }
            upgradeLabel={
              translations["builder.general.form.upgrade"] ??
              "Upgrade to Premium"
            }
            onClose={() => setShowFontUpgradeCTA(false)}
            onUpgrade={() => router.push(`/${lang}/pricing`)}
          />
        </fieldset>

        {/* Status */}
        {titleError && (
          <div className="text-sm text-(--builder-color-danger)">
            {titleError}
          </div>
        )}
        {subtitleError && (
          <div className="text-sm text-(--builder-color-danger)">
            {subtitleError}
          </div>
        )}

        {languageError && (
          <div className="text-sm text-(--builder-color-danger)">
            {languageError}
          </div>
        )}
        {error && (
          <div className="text-sm text-(--builder-color-danger)">{error}</div>
        )}
      </form>
    </StepLayout>
  );
}
