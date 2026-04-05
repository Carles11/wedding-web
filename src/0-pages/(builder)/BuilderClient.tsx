"use client";

import BuilderStepContent from "@/1-widgets/builder/ui/BuilderStepContent";
import BuilderStepNav from "@/1-widgets/builder/ui/BuilderStepNav";
import { LegacyModeBanner } from "@/2-features/builder/legacy-mode/LegacyModeBanner";
import { fetchAccommodationEntries } from "@/3-entities/accommodation/api";
import { updateAccountInfo } from "@/3-entities/account/api/accountCrud";
import { fetchImagesBySite } from "@/3-entities/images/api";
import { fetchHasMainProgramEvent } from "@/3-entities/program_events/api";
import { fetchContactSection } from "@/3-entities/sections/api/fetchContactSection";
import { fetchWeddingGiftBySite } from "@/3-entities/wedding_gifts/api";
import { fetchWhatToSeeEntries } from "@/3-entities/what_to_see/api";
import { getPlanLimit } from "@/4-shared/helpers/billing/entitlements";
import { useSite } from "@/4-shared/hooks/useSite";
import { useSupabaseAuth } from "@/4-shared/hooks/useSupabaseAuth";
import { createClient } from "@/4-shared/lib/supabase/client";
import { BuilderClientProps, ImageSection, StepStatus } from "@/4-shared/types";
import { BuilderHeader } from "@/4-shared/ui/builder";
import { CustomLoader } from "@/4-shared/ui/commons/loader/CustomLoader";
import { CookiesConsentBanner } from "@/4-shared/ui/CookiesConsentBanner";
import { isValidEmail } from "@/4-shared/utils/validations";
import { usePlan } from "@/app/providers";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";
const STEP_KEYS = [
  "builder.nav.step.general",
  "builder.nav.step.images",
  "builder.nav.step.program",
  "builder.nav.step.accommodation",
  "builder.nav.step.what_to_see",
  "builder.nav.step.wedding_gift",
  "builder.nav.step.contact",
  "builder.nav.step.domain_billing",
];

export default function BuilderClient({
  initialLang = "en",
  translations: initialTranslations,
  userId,
  userProfile,
  account,
  isLegacyMode,
}: BuilderClientProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [isPending, startTransition] = useTransition();

  const { user } = useSupabaseAuth();
  const {
    site,
    loading: siteLoading,
    error: siteError,
    refresh,
  } = useSite(user ?? null);
  const { planType } = usePlan();
  // Initialize active step from URL query param
  const searchParams = useSearchParams();
  const initialStep = parseInt(searchParams.get("step") ?? "0", 10);
  const [active, setActive] = useState(isNaN(initialStep) ? 0 : initialStep);

  const [currentLang, setCurrentLang] = useState(initialLang);
  const [translations, setTranslations] = useState(initialTranslations);
  // Sync currentLang from the [lang] path segment in the URL
  useEffect(() => {
    if (typeof window === "undefined") return;
    const pathLang =
      window.location.pathname.split("/")[1] || initialLang || "en";
    if (pathLang !== currentLang) {
      setCurrentLang(pathLang);
    }
  }, [pathname]);

  // --- step completeness state ---
  const [hasHeroContent, setHasHeroContent] = useState(false);
  const [heroImageExists, setHeroImageExists] = useState(false);
  const [hasMainProgramEvent, setHasMainProgramEvent] = useState(false);
  const [accommodationCount, setAccommodationCount] = useState(0);
  const [whatToSeeCount, setWhatToSeeCount] = useState(0);
  const [hasWeddingGiftData, setHasWeddingGiftData] = useState(false);
  const [hasContact, setHasContact] = useState(false);

  const handleUpgrade = () => {
    router.push(`/${initialLang}/builder/checkout?plan=premium`);
  };

  function hasAnyGiftPaymentMethod(
    gift: Record<string, unknown> | null,
  ): boolean {
    if (!gift) return false;
    return !!(
      gift.paypal_url ||
      gift.bank_account_iban ||
      gift.bizum_phone ||
      gift.venmo_username ||
      gift.giftlist_url ||
      gift.honeymoon_fund_url ||
      gift.other_method_url
    );
  }

  const langLimit = getPlanLimit(planType, "languages");

  const provisionSite = useCallback(async () => {
    if (!user) return;
    try {
      await fetch("/api/provision-site", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user.id, email: user.email }),
      });
      refresh();
    } catch (err) {
      console.error("Failed to provision site:", err);
    }
  }, [user, refresh]);

  useEffect(() => {
    if (user && !site && !siteLoading) {
      provisionSite();
    }
  }, [user, site, siteLoading]);

  useEffect(() => {
    if (!site?.id) return;
    const id = site.id;

    fetchImagesBySite(id).then((images) => {
      setHeroImageExists(
        images.some(
          (img) =>
            img.section &&
            typeof img.section === "object" &&
            (img.section as ImageSection).type === "hero",
        ),
      );
    });

    fetchContactSection(id).then((section) => {
      const f = section?.content ?? {};
      const bride = (f.bride ?? {}) as { name?: string; email?: string };
      const groom = (f.groom ?? {}) as { name?: string; email?: string };

      const isBrideComplete =
        !!bride.name && !!bride.email && isValidEmail(bride.email);
      const isGroomComplete =
        !!groom.name && !!groom.email && isValidEmail(groom.email);

      // CHANGE: Use OR (||) so one valid contact turns the step green
      setHasContact(isBrideComplete || isGroomComplete);
    });

    fetchHasMainProgramEvent(id).then(setHasMainProgramEvent);
    fetchAccommodationEntries(id).then((rows) =>
      setAccommodationCount(rows?.length ?? 0),
    );
    fetchWhatToSeeEntries(id).then((rows) =>
      setWhatToSeeCount(rows?.length ?? 0),
    );
    fetchWeddingGiftBySite(id).then((gift) =>
      setHasWeddingGiftData(
        hasAnyGiftPaymentMethod(gift as Record<string, unknown> | null),
      ),
    );
  }, [site?.id]);

  const handleLanguageChange = async (lang: string) => {
    // We don't await the DB update to keep UI snappy
    if (user?.id) {
      updateAccountInfo(user.id, { preferred_language: lang });
    }

    // This triggers the pathname useEffect which updates currentLang
    router.push(`/${lang}/builder?step=${active}`);
  };

  // Fetch builder translations when currentLang changes
  // "Stale-While-Revalidating" Fetcher
  useEffect(() => {
    // Only fetch if the language in the URL actually changed from what we have in state
    if (currentLang === initialLang && translations === initialTranslations)
      return;

    async function fetchTranslations() {
      const { fetchBuilderTranslations } =
        await import("@/4-shared/api/builder/getTranslations");
      const supabase = createClient();

      const newTranslations = await fetchBuilderTranslations(
        supabase,
        currentLang,
        "en",
      );

      // Wrap the state update in a transition.
      // React will keep the "old" translations on screen until this is done.
      startTransition(() => {
        setTranslations(newTranslations);
      });
    }

    fetchTranslations();
  }, [currentLang]);

  // "done" → green check | "pending" → red dot (mandatory) | "optional" → gray circle
  const STEP_STATUS: StepStatus[] = [
    !!site?.subdomain && hasHeroContent ? "done" : "pending",
    heroImageExists ? "done" : "pending",
    hasMainProgramEvent ? "done" : "pending",
    accommodationCount > 0 ? "done" : "optional",
    whatToSeeCount > 0 ? "done" : "optional",
    hasWeddingGiftData ? "done" : "optional",
    hasContact ? "done" : "pending",
    "done",
  ];

  if (!site || !planType)
    return (
      <CustomLoader
        message={translations["builder.status.loading"] || "Loading..."}
      />
    );

  return (
    <div className="builder-theme min-h-screen">
      {isLegacyMode && (
        <LegacyModeBanner
          onUpgrade={handleUpgrade}
          title={
            translations["builder.legacy_mode.title"] ?? "Site in Legacy Mode"
          }
          description={
            translations["builder.legacy_mode.description"] ??
            "Editing disabled due to inactivity."
          }
          buttonText={
            translations["builder.legacy_mode.upgrade_btn"] ??
            "Unlock Editing Forever"
          }
        />
      )}
      <CookiesConsentBanner
        translations={translations}
        lang={currentLang}
        userId={userId}
        userProfile={userProfile}
      />
      <BuilderHeader
        translations={translations}
        site={site}
        currentLang={currentLang}
        handleLanguageChange={handleLanguageChange}
        stepStatus={STEP_STATUS}
      />
      <div
        className={`flex-1 ${isLegacyMode ? "pointer-events-none opacity-70 grayscale-[0.5]" : ""}`}
      >
        <main className="sm:p-6 overflow-x-hidden">
          <div className="builder-shell md:max-w-[95vw] mx-auto rounded flex flex-col lg:flex-row">
            <div className="flex flex-col">
              <p className="text-(--builder-color-text-muted) flex items-center justify-center sm:justify-start gap-2 text-sm sm:text-base m-4">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span className="truncate">{account.email}</span>
              </p>
              <BuilderStepNav
                stepKeys={STEP_KEYS}
                stepStatuses={STEP_STATUS}
                active={active}
                onSelect={(step: number) => {
                  setActive(step);
                  // update step in URL
                  const url = `/${currentLang}/builder?step=${step}`;
                  router.push(url);
                }}
                translations={translations}
                currentLang={currentLang}
              />
            </div>
            <BuilderStepContent
              active={active}
              site={site}
              siteLoading={siteLoading}
              siteError={siteError}
              refresh={refresh}
              currentLang={currentLang}
              translations={translations}
              langLimit={langLimit}
              planType={planType}
              setHasHeroContent={setHasHeroContent}
              setHeroImageExists={setHeroImageExists}
              setHasMainProgramEvent={setHasMainProgramEvent}
              setAccommodationCount={setAccommodationCount}
              setWhatToSeeCount={setWhatToSeeCount}
              setHasWeddingGiftData={setHasWeddingGiftData}
              setHasContact={setHasContact}
              account={account}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
