"use client";

import BuilderStepContent from "@/1-widgets/builder/ui/BuilderStepContent";
import BuilderStepNav, {
  type StepStatus,
} from "@/1-widgets/builder/ui/BuilderStepNav";
import { fetchAccommodationEntries } from "@/3-entities/accommodation/api";
import { fetchImagesBySite } from "@/3-entities/images/api";
import { fetchHasMainProgramEvent } from "@/3-entities/program_events/api";
import { fetchContactSection } from "@/3-entities/sections/api/fetchContactSection";
import { fetchWeddingGiftBySite } from "@/3-entities/wedding_gifts/api";
import { fetchWhatToSeeEntries } from "@/3-entities/what_to_see/api";
import { getPlanLimit } from "@/4-shared/helpers/billing/entitlements";
import { useSite } from "@/4-shared/hooks/useSite";
import { useSupabaseAuth } from "@/4-shared/hooks/useSupabaseAuth";
import { BuilderHeader } from "@/4-shared/ui/builder";
import { EMAIL_RE } from "@/4-shared/utils/validations";
import { usePlan } from "@/app/providers";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

interface ImageSection {
  type: string;
  [key: string]: unknown;
}

interface Props {
  initialLang?: string;
  translations: Record<string, string>;
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
  const { planType } = usePlan();

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      const validContact = (pt: { name?: string; email?: string }) =>
        !!pt?.name && !!pt?.email && EMAIL_RE.test(pt.email ?? "");
      setHasContact(validContact(bride) && validContact(groom));
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

  const handleLanguageChange = (lang: string) => {
    setCurrentLang(lang);
    const params = new URLSearchParams(searchParams.toString());
    params.set("lang", lang);
    router.push(`${pathname}?${params.toString()}`);
  };

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
    return <div>{translations["builder.status.loading"]}</div>;

  return (
    <div className="builder-theme min-h-screen">
      <BuilderHeader
        translations={translations}
        site={site}
        currentLang={currentLang}
        handleLanguageChange={handleLanguageChange}
      />
      <main className="p-4 sm:p-6 overflow-x-hidden">
        <div className="builder-shell md:max-w-[95vw] mx-auto rounded flex flex-col lg:flex-row">
          <BuilderStepNav
            stepKeys={STEP_KEYS}
            stepStatuses={STEP_STATUS}
            active={active}
            onSelect={setActive}
            translations={translations}
          />
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
          />
        </div>
      </main>
    </div>
  );
}
