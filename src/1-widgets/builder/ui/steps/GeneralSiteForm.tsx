"use client";

import { getSiteGeneralContent } from "@/4-shared/api/builder/getSiteGeneralContent";
import { saveSiteGeneralContent } from "@/4-shared/api/builder/saveSiteGeneralContent";
import type { SupportedLanguage } from "@/4-shared/config/i18n";
import {
  SUPPORTED_LANGUAGE_LABELS,
  SUPPORTED_LANGUAGES,
} from "@/4-shared/config/i18n";
import { notify } from "@/4-shared/lib/toast/toast";
import type { PlanType, Site } from "@/4-shared/types";
import { BuilderLangTabs, UpgradeCTAModal } from "@/4-shared/ui/builder";
import { isValidSubdomain, RESERVED } from "@/4-shared/utils/validations";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { StepLayout } from "../../step-layout";

type Props = {
  site: Site | null;
  refresh: () => void;
  lang: string;
  translations: Record<string, string>;
  langLimit: number;
  planType: PlanType;
  /** Called with true once hero title + subtitle are saved for the default language. */
  setGeneralComplete?: (v: boolean) => void;
};

export default function GeneralSiteForm({
  site,
  refresh,
  lang,
  translations,
  langLimit,
  planType,
  setGeneralComplete,
}: Props) {
  const router = useRouter();
  const fetchCounterRef = useRef(0);
  const lastFetchedRef = useRef<Awaited<
    ReturnType<typeof getSiteGeneralContent>
  > | null>(null);
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
  const [subdomainError, setSubdomainError] = useState<string | null>(null);
  const [titleError, setTitleError] = useState<string | null>(null);
  const [subtitleError, setSubtitleError] = useState<string | null>(null);
  const [languageError, setLanguageError] = useState<string | null>(null);
  const [showUpgradeCTA, setShowUpgradeCTA] = useState(false);

  function arraysEqual<T>(a: T[], b: T[]) {
    if (a.length !== b.length) return false;
    return a.every((v, i) => v === b[i]);
  }

  type GeneralContentState = Awaited<ReturnType<typeof getSiteGeneralContent>>;

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

    setActiveLang(res.default_lang);
    setGeneralComplete?.(!!res.titles[res.default_lang]?.trim());
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
    return (
      <StepLayout
        nextLabel="Save"
        backLabel="Cancel"
        backDisabled
        translations={translations}
      >
        <p className="text-sm text-gray-600">
          {translations["builder.status.loading"] || "Loading..."}
        </p>
      </StepLayout>
    );
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
    setSubdomainError(null);
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

    // Subdomain validation (only if editable)
    const nextSubdomain = !site.subdomain ? subdomain.trim().toLowerCase() : "";
    if (!site.subdomain && nextSubdomain) {
      if (!isValidSubdomain(nextSubdomain)) {
        setSubdomainError(
          translations["builder.errors.invalid_subdomain"] ||
            "Invalid subdomain format.",
        );
        return;
      }
      if (RESERVED.includes(nextSubdomain)) {
        setSubdomainError(
          translations["builder.errors.reserved_subdomain"] ||
            "This subdomain is reserved.",
        );
        return;
      }
      // TODO: uniqueness check (requires backend or context)
    }

    const existingLanguages = (site.languages ?? []) as SupportedLanguage[];
    const languagesChanged = !arraysEqual(existingLanguages, languages);
    const defaultLangChanged = (site.default_lang ?? "en") !== defaultLang;
    const shouldRefreshSiteMeta =
      !!nextSubdomain || languagesChanged || defaultLangChanged;

    setSaving(true);
    try {
      await saveSiteGeneralContent({
        site_id: site.id,
        heroId: heroId,
        content,
        subdomain: nextSubdomain || undefined,
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
          <label className="block text-md font-normal text-gray-700">
            {translations["builder.general.form.label.languages"] ??
              "Select your website display languages"}
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
              <label
                key={lang}
                className="cursor-pointer inline-flex items-center"
              >
                <input
                  type="checkbox"
                  value={lang}
                  checked={languages.includes(lang)}
                  onChange={() => handleLangCheckbox(lang)}
                  className="mr-2"
                />
                {SUPPORTED_LANGUAGE_LABELS[lang]}
              </label>
            ))}
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
        {subdomainError && (
          <div className="text-sm text-(--builder-color-danger)">
            {subdomainError}
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
