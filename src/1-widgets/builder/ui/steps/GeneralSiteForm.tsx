"use client";

import { updateSiteFonts } from "@/3-entities/sites/api/updateSiteFonts";
import { getSiteGeneralContent } from "@/4-shared/api/builder/getSiteGeneralContent";
import { saveSiteGeneralContent } from "@/4-shared/api/builder/saveSiteGeneralContent";
import type { SupportedLanguage } from "@/4-shared/config/i18n";

import { MagicAIButton } from "@/4-shared/ui/builder/buttons/MagicAIButton";

import {
  SUPPORTED_LANGUAGE_LABELS,
  SUPPORTED_LANGUAGES,
} from "@/4-shared/config/i18n";
import {
  clearDefaultLanguageIfRemoved,
  type DefaultLanguageValue,
  getEffectiveBuilderLanguage,
  isSelectedDefaultLanguage,
} from "@/4-shared/lib/builder-language/defaultLanguage";
import {
  AVAILABLE_BODY_FONTS,
  AVAILABLE_TITLE_FONTS,
  DEFAULT_TENANT,
  type FontOption,
  type FontStyle,
} from "@/4-shared/lib/fonts/fontRegistry";
import { notify } from "@/4-shared/lib/toast/toast";
import { GeneralContentState, GeneralSiteFormProps } from "@/4-shared/types";
import {
  BuilderLangPills,
  BuilderLangTabs,
  UpgradeCTAModal,
} from "@/4-shared/ui/builder";
import { SkeletonLoader } from "@/4-shared/ui/commons/loader/SkeletonLoader";
import { ensureNotLegacy } from "@/4-shared/utils/billing/legacyLock";
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
  account,
}: GeneralSiteFormProps) {
  const router = useRouter();
  const fetchCounterRef = useRef(0);
  const lastFetchedRef = useRef<GeneralContentState | null>(null);
  const [languages, setLanguages] = useState<SupportedLanguage[]>([]);
  const [defaultLang, setDefaultLang] = useState<DefaultLanguageValue>("en");
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
  // Removed local showAIModal state

  function arraysEqual<T>(a: T[], b: T[]) {
    if (a.length !== b.length) return false;
    return a.every((v, i) => v === b[i]);
  }

  function getDefaultLanguageRequiredMessage() {
    return (
      translations["builder.general.form.default_language_required"] ??
      "Please choose a default language from the selected site languages before saving."
    );
  }

  function getDefaultLanguageRemovedMessage() {
    return (
      translations["builder.general.form.default_language_removed"] ??
      "You removed the current default language. Please choose a new default language before saving."
    );
  }

  useEffect(() => {
    const message = titleError ?? subtitleError ?? languageError ?? error;
    if (message) {
      notify.error(message);
    }
  }, [titleError, subtitleError, languageError, error]);

  const handleAIApply = (newContent: any) => {
    setContent((prev) => {
      // 1. Create a shallow copy of the previous state
      const updated = { ...prev };

      // 2. Iterate through the keys (languages) sent by the AI
      Object.keys(newContent).forEach((lang) => {
        // FIX: Cast 'lang' as SupportedLanguage so TypeScript allows indexing
        const typedLang = lang as SupportedLanguage;

        updated[typedLang] = {
          // Accessing prev[typedLang] now works because of the cast
          ...(prev[typedLang] || { title: "", subtitle: "" }),
          ...newContent[typedLang],
        };
      });

      return updated;
    });

    notify.success(
      translations["ai.content_applied"] ??
        "AI Content applied! You can still edit the fields manually.",
    );
  };

  function applyGeneralContent(res: GeneralContentState) {
    const normalizedDefaultLang: DefaultLanguageValue = res.languages.includes(
      res.default_lang,
    )
      ? res.default_lang
      : "";
    const effectiveLang = getEffectiveBuilderLanguage(
      res.languages,
      normalizedDefaultLang,
    );

    lastFetchedRef.current = res;
    setLanguages(res.languages);
    setDefaultLang(normalizedDefaultLang);
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

    setActiveLang(effectiveLang);
    setGeneralComplete?.(!!res.titles[effectiveLang]?.trim());
    setLanguageError(
      normalizedDefaultLang === "" ? getDefaultLanguageRequiredMessage() : null,
    );
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
    ensureNotLegacy(account);

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
  }, [site?.id, site?.default_lang, site?.languages]);

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
      const nextDefaultLang = clearDefaultLanguageIfRemoved(lang, defaultLang);
      setLanguages(updated);
      setDefaultLang(nextDefaultLang);

      setContent((curr) => {
        const copy = { ...curr };
        delete copy[lang];
        return copy;
      });

      if (activeLang === lang && updated.length > 0) setActiveLang(updated[0]);
      else if (updated.length === 0) setActiveLang("en");

      if (nextDefaultLang === "") {
        const message = getDefaultLanguageRemovedMessage();
        setLanguageError(message);
      } else {
        setLanguageError(null);
      }
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
    if (defaultLang !== "") {
      setLanguageError(null);
    }
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

    if (!isSelectedDefaultLanguage(defaultLang, languages)) {
      const message = getDefaultLanguageRequiredMessage();
      setLanguageError(message);
      return;
    }

    const existingLanguages = (site.languages ?? []) as SupportedLanguage[];
    const languagesChanged = !arraysEqual(existingLanguages, languages);
    const defaultLangChanged = (site.default_lang ?? "en") !== defaultLang;
    const shouldRefreshSiteMeta = languagesChanged || defaultLangChanged;

    setSaving(true);
    try {
      ensureNotLegacy(account);
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
      // Check if it's our specific Legacy error
      const errorMessage =
        err instanceof Error &&
        (err.message === "DEFAULT_LANGUAGE_REQUIRED" ||
          err.message === "DEFAULT_LANGUAGE_NOT_IN_LANGUAGES")
          ? getDefaultLanguageRequiredMessage()
          : err instanceof Error && err.message === "LEGACY_MODE_ACTIVE"
            ? translations["builder.errors.legacy_mode_active"] ||
              "Editing is disabled for legacy sites. Please upgrade to continue."
            : err instanceof Error
              ? err.message
              : translations["error.something_went_wrong"];

      notify.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleSetDefault = async (lang: SupportedLanguage) => {
    if (defaultLang === lang) return;

    const prevDefault = defaultLang;
    const prevActive = activeLang;

    setDefaultLang(lang as DefaultLanguageValue);
    setActiveLang(lang);
    setLanguageError(null);
    setError(null);
    setGeneralComplete?.(!!content[lang]?.title?.trim());

    if (!site) return;
    try {
      await saveSiteGeneralContent({
        site_id: site.id,
        heroId,
        content: {}, // no content change
        default_lang: lang,
      });

      await refresh();

      notify.success(
        translations["builder.general.form.save_success"] ??
          "Saved successfully.",
      );
    } catch {
      // revert on failure
      setDefaultLang(prevDefault);
      setActiveLang(prevActive);
      notify.error(
        translations["error.something_went_wrong"] ?? "Something went wrong.",
      );
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
      {/* Languages pills */}
      <BuilderLangPills
        languages={languages}
        planType={planType}
        onToggle={handleLangCheckbox}
        onLockedClick={() => setShowUpgradeCTA(true)}
        translations={translations}
      />
      {/* Language tabs */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <BuilderLangTabs
            languages={languages}
            activeLang={activeLang}
            defaultLang={defaultLang}
            onChange={(langCode) =>
              setActiveLang(langCode as SupportedLanguage)
            }
            onSetDefault={(langCode) => {
              void handleSetDefault(langCode as SupportedLanguage);
            }}
            getLabel={(langCode) =>
              SUPPORTED_LANGUAGE_LABELS[langCode as SupportedLanguage]
            }
            translations={translations}
          />
        </div>
        <MagicAIButton
          siteId={site?.id || ""}
          planType={planType}
          languages={languages}
          currentValues={content}
          context="General Wedding Info"
          onApply={handleAIApply}
          translations={translations}
          lang={lang}
        />
      </div>
      {/* Title */}
      <div className="mt-8">
        <p className="text-gray-500">
          {translations["builder.general.form.label.main_title"] ??
            "Main title"}
        </p>

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
        <p className=" pt-6 pb-3 text-gray-500">
          {translations["builder.general.form.label.subtitle"] ?? "Subtitle"}
        </p>
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
      <fieldset className="space-y-4 rounded-lg border border-gray-200 p-4 mt-6">
        <legend className="pt-3 pb-3 text-gray-500">
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
            className="text-5xl md:text-6xl leading-snug"
            style={{
              fontFamily: `var(${AVAILABLE_TITLE_FONTS.find((f) => f.id === selectedTitleFont)?.variable ?? "--font-playfair-display"})`,
            }}
          >
            {content[activeLang]?.title || "We are getting married!"}
          </p>
          <p
            className="mt-2 text-lg text-gray-600"
            style={{
              fontFamily: `var(${AVAILABLE_BODY_FONTS.find((f) => f.id === selectedBodyFont)?.variable ?? "--font-roboto"})`,
            }}
          >
            {(content[activeLang]?.subtitle ||
              translations["builder.fonts.preview.body"]) ??
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
          cancelLabel={translations["builder.general.form.cancel"] ?? "Cancel"}
          upgradeLabel={
            translations["builder.general.form.upgrade"] ?? "Upgrade to Premium"
          }
          onClose={() => setShowFontUpgradeCTA(false)}
          onUpgrade={() => router.push(`/${lang}/pricing`)}
        />
      </fieldset>
      {/* Status handled via toast notifications */}
      {/* UPGRADE CTA MODAL */}
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
        cancelLabel={translations["builder.general.form.cancel"] || "Cancel"}
        upgradeLabel={
          translations["builder.general.form.upgrade"] || "Upgrade to Premium"
        }
        onClose={() => setShowUpgradeCTA(false)}
        onUpgrade={() => router.push(`/${lang}/pricing`)}
      />
      {/* Render Modal at the end of the return */}
      {/* MagicAIButton handles modal logic */}
    </StepLayout>
  );
}
