"use client";

import { BuilderStepContentProps } from "@/4-shared/types";
import {
  AccommodationBuilderStep,
  ContactBuilderStep,
  DomainAndBillingBuilderStep,
  GeneralSiteForm,
  ImagesBuilderStep,
  ProgramEventsBuilderStep,
  WeddingGiftBuilderStep,
  WhatToSeeBuilderStep,
} from "./steps";

/**
 * Renders the right-hand content pane of the builder.
 * All 8 steps are always mounted (hidden via CSS) to preserve local state
 * across tab switches and avoid stale-read issues after Supabase writes.
 */
export default function BuilderStepContent({
  active,
  site,
  siteLoading,
  siteError,
  refresh,
  currentLang,
  translations,
  langLimit,
  planType,
  setHasHeroContent,
  setHeroImageExists,
  setHasMainProgramEvent,
  setAccommodationCount,
  setWhatToSeeCount,
  setHasWeddingGiftData,
  setHasContact,
}: BuilderStepContentProps) {
  return (
    <section className="flex-1 min-w-0 p-4 sm:p-6">
      <h2 className="text-xl font-semibold">
        {
          translations[
            [
              "builder.nav.step.general",
              "builder.nav.step.images",
              "builder.nav.step.program",
              "builder.nav.step.accommodation",
              "builder.nav.step.what_to_see",
              "builder.nav.step.wedding_gift",
              "builder.nav.step.contact",
              "builder.nav.step.domain_billing",
            ][active]
          ]
        }
      </h2>
      <div className="mt-4">
        {siteLoading ? (
          <p>{translations["builder.status.loading"]}</p>
        ) : siteError ? (
          <p className="text-(--builder-color-danger)">
            {translations["builder.status.error"]} {siteError}
          </p>
        ) : (
          <p className="text-sm text-gray-600">
            {translations["builder.status.subdomain"]}{" "}
            {site?.subdomain ?? translations["builder.status.subdomain_empty"]}
          </p>
        )}

        <div className="mt-8 p-4 bg-gray-50">
          {/* Steps always mounted — unmounting would cause stale-read after Supabase writes */}
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
              setHasMainProgramEvent={setHasMainProgramEvent}
              planType={planType}
            />
          </div>
          <div className={active !== 3 ? "hidden" : undefined}>
            <AccommodationBuilderStep
              site={site}
              refresh={refresh}
              lang={currentLang}
              translations={translations}
              setItemCount={setAccommodationCount}
              planType={planType}
            />
          </div>
          <div className={active !== 4 ? "hidden" : undefined}>
            <WhatToSeeBuilderStep
              site={site}
              refresh={refresh}
              lang={currentLang}
              translations={translations}
              setItemCount={setWhatToSeeCount}
              planType={planType}
            />
          </div>
          <div className={active !== 5 ? "hidden" : undefined}>
            <WeddingGiftBuilderStep
              site={site}
              refresh={refresh}
              lang={currentLang}
              translations={translations}
              setHasData={setHasWeddingGiftData}
              planType={planType}
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
          {/* Account step removed: now only accessible as standalone dashboard page */}
        </div>
      </div>
    </section>
  );
}
