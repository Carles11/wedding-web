"use client";

import { BuilderStepContentProps } from "@/4-shared/types";
import Heading from "@/4-shared/ui/commons/typography/Heading";
import {
  AccommodationBuilderStep,
  ContactBuilderStep,
  DomainAndBillingBuilderStep,
  GeneralSiteForm,
  ImagesBuilderStep,
  ProgramEventsBuilderStep,
  RsvpBuilderStep,
  WeddingGiftBuilderStep,
  WhatToSeeBuilderStep,
} from "./steps";

/**
 * Renders the right-hand content pane of the builder.
 * All steps are always mounted (hidden via CSS) to preserve local state
 * across tab switches and avoid stale-read issues after Supabase writes.
 */
export default function BuilderStepContent({
  active,
  site,
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
  setHasRsvpEnabled,
  account,
  stepStatuses,
}: BuilderStepContentProps) {
  const requiredSteps = stepStatuses?.filter((s) => s !== "optional") ?? [];
  const allRequiredDone = requiredSteps.every((s) => s === "done");

  return (
    <section className=" flex-1 min-w-0 p-4 sm:p-6">
      <Heading as="h2" className="text-xl font-semibold">
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
              "builder.nav.step.rsvp",
              "builder.nav.step.domain_billing",
            ][active]
          ]
        }
      </Heading>
      <div className="mt-4">
        <div className="mt-8 p-0 md:p-4 bg-gray-50">
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
              account={account}
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
              account={account}
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
              account={account}
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
              account={account}
            />
          </div>
          <div className={active !== 6 ? "hidden" : undefined}>
            <ContactBuilderStep
              site={site}
              refresh={refresh}
              lang={currentLang}
              translations={translations}
              setHasContact={setHasContact}
              account={account}
            />
          </div>
          <div className={active !== 7 ? "hidden" : undefined}>
            <RsvpBuilderStep
              site={site}
              refresh={refresh}
              lang={currentLang}
              translations={translations}
              setHasRsvpEnabled={setHasRsvpEnabled}
            />
          </div>
          <div className={active !== 8 ? "hidden" : undefined}>
            <DomainAndBillingBuilderStep
              site={site}
              refresh={refresh}
              lang={currentLang}
              translations={translations}
              planType={planType}
              allStepsComplete={allRequiredDone}
            />
          </div>
          {/* Account step removed: now only accessible as standalone dashboard page */}
        </div>
      </div>
    </section>
  );
}
