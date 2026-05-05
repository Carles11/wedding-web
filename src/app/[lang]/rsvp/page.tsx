import { RSVPFormComponent } from "@/0-pages/(tenant)/RSVPFormComponent";
import { validateRsvpAccessCode } from "@/3-entities/rsvp/lib/validateRsvpAccessCode";
import { t } from "@/4-shared/helpers/t";
import { fetchGlobalTranslations } from "@/4-shared/lib/i18n";
import { resolveSiteIdFromHost } from "@/4-shared/lib/site/resolveSiteIdFromHost";
import { supabaseAdmin } from "@/4-shared/lib/supabase/supabaseServer";
import type { Metadata } from "next";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

// ---------------------------------------------------------------------------
// Metadata — static, always NOINDEX (private invite-only page)
// ---------------------------------------------------------------------------
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "RSVP",
    robots: {
      index: false,
      follow: false,
      googleBot: { index: false, follow: false },
    },
  };
}

type RsvpStatus = "attending" | "not_attending";

function isRsvpStatus(value: unknown): value is RsvpStatus {
  return value === "attending" || value === "not_attending";
}

export default async function RsvpPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ code?: string }>;
}) {
  const { lang } = await params;
  const { code } = await searchParams;

  const host = (await headers()).get("host") ?? "";
  const resolved = await resolveSiteIdFromHost(host);

  const globalTranslations = await fetchGlobalTranslations(lang, "en");
  console.log({ globalTranslations });
  // --- State A: site not found ---
  if (!resolved) {
    return (
      <main className="min-h-screen bg-(--color-background) py-10 sm:py-14">
        <div className="mx-auto w-full max-w-2xl px-4 sm:px-6">
          <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
            <h1 className="text-3xl text-(--color-foreground) sm:text-4xl">
              {t(globalTranslations, "rsvp.page.title", "RSVP")}
            </h1>
            <p className="mt-3 text-sm leading-6 text-gray-500">
              Site not found.
            </p>
          </section>
        </div>
      </main>
    );
  }

  const { siteId } = resolved;
  const rawCode = code?.trim() ?? "";

  // --- Fetch site plan ---
  const { data: siteRow } = await supabaseAdmin
    .from("sites")
    .select("plan_type")
    .eq("id", siteId)
    .maybeSingle();
  const isPremium = siteRow?.plan_type === "premium";

  // --- State B: missing code (before DB call) ---
  if (!rawCode) {
    return (
      <main className="min-h-screen bg-(--color-background) py-10 sm:py-14">
        <div className="mx-auto w-full max-w-2xl px-4 sm:px-6">
          <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
            <h1 className="text-3xl text-(--color-foreground) sm:text-4xl">
              {t(globalTranslations, "rsvp.page.title", "RSVP")}
            </h1>
            <p className="mt-3 text-sm leading-6 text-gray-500">
              {t(
                globalTranslations,
                "rsvp.page.invalid_link",
                "This link is invalid or has expired.",
              )}
            </p>
          </section>
        </div>
      </main>
    );
  }

  const result = await validateRsvpAccessCode({ siteId, rawCode });

  // --- State C: invalid/expired code ---
  if (!result.ok) {
    return (
      <main className="min-h-screen bg-(--color-background) py-10 sm:py-14">
        <div className="mx-auto w-full max-w-2xl px-4 sm:px-6">
          <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
            <h1 className="text-3xl text-(--color-foreground) sm:text-4xl">
              {t(globalTranslations, "rsvp.page.title", "Guests & RSVP")}
            </h1>
            <p className="mt-3 text-sm leading-6 text-gray-500">
              {t(
                globalTranslations,
                "rsvp.page.invalid_link",
                "This link is invalid or has expired.",
              )}
            </p>
          </section>
        </div>
      </main>
    );
  }

  // --- State D: valid code — render form ---
  const { party, partyState } = result;

  if (party.max_guests < 1) {
    return (
      <main className="min-h-screen bg-(--color-background) py-10 sm:py-14">
        <div className="mx-auto w-full max-w-2xl px-4 sm:px-6">
          <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
            <h1 className="text-3xl text-(--color-foreground) sm:text-4xl">
              {t(globalTranslations, "rsvp.page.title", "RSVP")}
            </h1>
            <p className="mt-3 text-sm leading-6 text-gray-500">
              {t(
                globalTranslations,
                "rsvp.page.invalid_link",
                "This link is invalid or has expired.",
              )}
            </p>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-(--color-background) py-10 sm:py-14">
      <div className="mx-auto w-full max-w-2xl px-4 sm:px-6">
        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
          <h1 className="text-3xl text-(--color-foreground) sm:text-4xl">
            {t(globalTranslations, "rsvp.page.title", "RSVP")}
          </h1>

          <RSVPFormComponent
            lang={lang}
            rawCode={rawCode}
            t={globalTranslations}
            party={{ max_guests: party.max_guests }}
            isPremium={isPremium}
            partyState={
              partyState && isRsvpStatus(partyState.status)
                ? {
                    status: partyState.status,
                    headcount: partyState.headcount,
                    comment: partyState.comment,
                    meal_intolerances: partyState.meal_intolerances,
                    song_request: partyState.song_request,
                  }
                : null
            }
          />
        </section>
      </div>
    </main>
  );
}
