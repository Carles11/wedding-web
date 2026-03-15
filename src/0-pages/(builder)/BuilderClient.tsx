"use client";

import AccommodationBuilderStep from "@/1-widgets/builder/ui/AccommodationBuilderStep";
import ContactBuilderStep from "@/1-widgets/builder/ui/ContactBuilderStep";
import DomainAndBillingBuilderStep from "@/1-widgets/builder/ui/DomainAndBillingBuilderStep";
import GeneralSiteForm from "@/1-widgets/builder/ui/GeneralSiteForm";
import ImagesBuilderStep from "@/1-widgets/builder/ui/ImagesBuilderStep";
import ProgramEventsBuilderStep from "@/1-widgets/builder/ui/ProgramEventsBuilderStep";
import WeddingGiftBuilderStep from "@/1-widgets/builder/ui/WeddingGiftBuilderStep";
import WhatToSeeBuilderStep from "@/1-widgets/builder/ui/WhatToSeeBuilderStep";

import { getPlanLimit } from "@/4-shared/helpers/billing/entitlements";
import { useSite } from "@/4-shared/hooks/useSite";
import { useSupabaseAuth } from "@/4-shared/hooks/useSupabaseAuth";
import { usePlan } from "@/app/providers";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Fragment, useCallback, useEffect, useState } from "react";

import { fetchAccommodationEntries } from "@/3-entities/accommodation/api";
import { fetchImagesBySite } from "@/3-entities/images/api";
import { fetchHasMainProgramEvent } from "@/3-entities/program_events/api";
import { fetchContactSection } from "@/3-entities/sections/api/fetchContactSection"; // fetched from "sections" table
import { fetchWeddingGiftBySite } from "@/3-entities/wedding_gifts/api";
import { fetchWhatToSeeEntries } from "@/3-entities/what_to_see/api";
import { BuilderHeader } from "@/4-shared/ui/builder";
import {
  GrayCircleIcon,
  GreenCheckIcon,
  RedDotIcon,
} from "@/4-shared/ui/commons/icons/completenessIcons";
import { EMAIL_RE } from "@/4-shared/utils/validations";

interface ImageSection {
  type: string;
  [key: string]: unknown;
}

interface Props {
  initialLang?: string;
  translations: Record<string, string>;
}

/** Three-state step status: done (green), pending (red, mandatory), optional (gray). */
type StepStatus = "done" | "pending" | "optional";

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
  translations,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user } = useSupabaseAuth();
  const {
    site,
    loading: siteLoading,
    error: siteError,
    refresh,
  } = useSite(user ?? null);
  const { planType, subscription } = usePlan();
  // console.log("XXXXXXBuilderClient { planType, subscription } XXXXXXXX", {
  //   planType,
  //   subscription,
  // });

  const [active, setActive] = useState(0);
  const [currentLang, setCurrentLang] = useState(initialLang);

  // --- step completeness state ---
  const [hasHeroContent, setHasHeroContent] = useState(false);
  const [heroImageExists, setHeroImageExists] = useState(false);
  const [hasMainProgramEvent, setHasMainProgramEvent] = useState(false);
  const [accommodationCount, setAccommodationCount] = useState(0);
  const [whatToSeeCount, setWhatToSeeCount] = useState(0);
  const [hasWeddingGiftData, setHasWeddingGiftData] = useState(false);
  const [hasContact, setHasContact] = useState(false);

  const langLimit = getPlanLimit(planType, "languages");

  // Provision the site if it doesn't exist
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
    // Only run when site not found after user is loaded
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, site, siteLoading]);

  useEffect(() => {
    if (!site?.id) return;
    const id = site.id;

    // Images — hero image is mandatory
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

    // Contact — both bride AND groom require name + valid email
    fetchContactSection(id).then((section) => {
      const f = section?.content ?? {};
      const bride = (f.bride ?? {}) as { name?: string; email?: string };
      const groom = (f.groom ?? {}) as { name?: string; email?: string };
      const validContact = (pt: { name?: string; email?: string }) =>
        !!pt?.name && !!pt?.email && EMAIL_RE.test(pt.email ?? "");
      setHasContact(validContact(bride) && validContact(groom));
    });

    // Program events — at least one event must be flagged as main event
    fetchHasMainProgramEvent(id).then(setHasMainProgramEvent);

    // Optional sections — load counts so sidebar shows correct status immediately
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

  const handleLanguageChange = (lang: string) => {
    setCurrentLang(lang);
    const params = new URLSearchParams(searchParams.toString());
    params.set("lang", lang);
    router.push(`${pathname}?${params.toString()}`);
  };

  // STEP_STATUS maps each step index to its 3-state indicator.
  // "done"     → green check  (requirement met)
  // "pending"  → red dot      (mandatory step, not yet complete)
  // "optional" → gray circle  (not required, ok to skip)
  const STEP_STATUS: StepStatus[] = [
    // 0 General — mandatory: subdomain set AND hero title+subtitle saved
    !!site?.subdomain && hasHeroContent ? "done" : "pending",
    // 1 Images — mandatory: hero image must exist
    heroImageExists ? "done" : "pending",
    // 2 Program events — mandatory: at least one main-event entry
    hasMainProgramEvent ? "done" : "pending",
    // 3 Accommodation — optional; green once at least one entry exists
    accommodationCount > 0 ? "done" : "optional",
    // 4 What to see — optional; same
    whatToSeeCount > 0 ? "done" : "optional",
    // 5 Wedding gift — optional; green once any payment method is saved
    hasWeddingGiftData ? "done" : "optional",
    // 6 Contact — mandatory: both bride AND groom need name + valid email
    hasContact ? "done" : "pending",
    // 7 Domain & Billing — always done; valid in all plan states
    "done",
  ];

  if (!site || !planType)
    return <div>{translations["builder.status.loading"]}</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <BuilderHeader
        translations={translations}
        site={site}
        currentLang={currentLang}
        handleLanguageChange={handleLanguageChange}
      />

      <main className="p-4 sm:p-6 overflow-x-hidden">
        <div className="md:max-w-[95vw] mx-auto bg-white shadow rounded flex flex-col lg:flex-row">
          <div className="lg:flex">
            {/* ✅ MOBILE STEP SCROLLER */}
            <div className="lg:hidden border-b bg-white">
              <div className="flex overflow-x-auto gap-2 p-3">
                {STEP_KEYS.map((k, i) => {
                  const status = STEP_STATUS[i];
                  return (
                    <button
                      key={k}
                      onClick={() => setActive(i)}
                      className={`shrink-0 flex items-center gap-2 px-3 py-2 rounded whitespace-nowrap border ${
                        i === active
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white hover:bg-gray-50"
                      }`}
                    >
                      {status === "done" ? (
                        <GreenCheckIcon />
                      ) : status === "optional" ? (
                        <GrayCircleIcon />
                      ) : (
                        <RedDotIcon />
                      )}
                      <span className="text-sm">{translations[k]}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            {/* ✅ DESKTOP SIDEBAR */}
            <nav className="hidden lg:block w-64 border-r p-4">
              <h3 className="font-semibold text-gray-700 text-2xl">
                {translations["builder.nav.steps_title"]}
              </h3>
              <ul className="mt-4 flex md:block gap-2 md:gap-0 space-y-0 md:space-y-2 min-w-max md:min-w-0">
                {STEP_KEYS.map((k, i) => {
                  const status = STEP_STATUS[i];
                  return (
                    <Fragment key={k}>
                      {i === 7 && (
                        <li className="my-3 px-3" aria-hidden="true">
                          <div className="h-px bg-gray-200" />
                        </li>
                      )}
                      <li>
                        <button
                          className={`flex items-center px-3 py-2 rounded whitespace-nowrap md:w-full md:text-left ${
                            i === active
                              ? "bg-blue-50 font-semibold"
                              : "hover:bg-gray-50"
                          }`}
                          onClick={() => setActive(i)}
                        >
                          <span className="w-6 flex justify-center items-center">
                            {status === "done" ? (
                              <GreenCheckIcon />
                            ) : status === "optional" ? (
                              <GrayCircleIcon />
                            ) : (
                              <RedDotIcon />
                            )}
                          </span>
                          {translations[k]}
                        </button>
                      </li>
                    </Fragment>
                  );
                })}
              </ul>
            </nav>
          </div>

          {/* ✅ CONTENT */}
          <section className="flex-1 min-w-0 p-4 sm:p-6">
            <h2 className="text-xl font-semibold">
              {translations[STEP_KEYS[active]]}
            </h2>
            <div className="mt-4">
              {siteLoading ? (
                <p>{translations["builder.status.loading"]}</p>
              ) : siteError ? (
                <p className="text-red-600">
                  {translations["builder.status.error"]} {siteError}
                </p>
              ) : (
                <>
                  {/* <p className="text-sm text-gray-600">
                    {translations["builder.status.site_id"]}{" "}
                    {site?.id ?? translations["builder.status.site_id_empty"]}
                  </p> */}
                  <p className="text-sm text-gray-600">
                    {translations["builder.status.subdomain"]}{" "}
                    {site?.subdomain ??
                      translations["builder.status.subdomain_empty"]}
                  </p>
                </>
              )}

              <div className="mt-8 border rounded p-4 bg-gray-50">
                {/* Steps are always mounted to preserve local state across tab switches.
                    Unmounting + remounting would trigger a re-fetch that can land in the
                    brief stale-read window after a Supabase write, showing pre-save data. */}
                <div className={active !== 0 ? "hidden" : undefined}>
                  <GeneralSiteForm
                    site={site}
                    refresh={refresh}
                    lang={currentLang}
                    translations={translations}
                    langLimit={langLimit}
                    planType={planType}
                    setGeneralComplete={setHasHeroContent}
                  />
                </div>
                <div className={active !== 1 ? "hidden" : undefined}>
                  <ImagesBuilderStep
                    site={site}
                    refresh={refresh}
                    lang={currentLang}
                    translations={translations}
                    setHeroImageExists={setHeroImageExists}
                    planType={planType}
                  />
                </div>
                <div className={active !== 2 ? "hidden" : undefined}>
                  <ProgramEventsBuilderStep
                    site={site}
                    refresh={refresh}
                    lang={currentLang}
                    translations={translations}
                    planType={planType}
                    setHasMainProgramEvent={setHasMainProgramEvent}
                  />
                </div>
                <div className={active !== 3 ? "hidden" : undefined}>
                  <AccommodationBuilderStep
                    site={site}
                    refresh={refresh}
                    lang={currentLang}
                    translations={translations}
                    planType={planType}
                    setItemCount={setAccommodationCount}
                  />
                </div>
                <div className={active !== 4 ? "hidden" : undefined}>
                  <WhatToSeeBuilderStep
                    site={site}
                    refresh={refresh}
                    lang={currentLang}
                    translations={translations}
                    planType={planType}
                    setItemCount={setWhatToSeeCount}
                  />
                </div>
                <div className={active !== 5 ? "hidden" : undefined}>
                  <WeddingGiftBuilderStep
                    site={site}
                    refresh={refresh}
                    lang={currentLang}
                    translations={translations}
                    planType={planType}
                    setHasData={setHasWeddingGiftData}
                  />
                </div>
                <div className={active !== 6 ? "hidden" : undefined}>
                  <ContactBuilderStep
                    site={site}
                    refresh={refresh}
                    lang={currentLang}
                    translations={translations}
                    setHasContact={setHasContact}
                  />
                </div>
                <div className={active !== 7 ? "hidden" : undefined}>
                  <DomainAndBillingBuilderStep
                    site={site}
                    refresh={refresh}
                    lang={currentLang}
                    translations={translations}
                    planType={planType}
                  />
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
