import { validateRsvpAccessCode } from "@/3-entities/rsvp/lib/validateRsvpAccessCode";
import { getMergedTranslations } from "@/4-shared/lib/i18n";
import { resolveSiteIdFromHost } from "@/4-shared/lib/site/resolveSiteIdFromHost";
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

// ---------------------------------------------------------------------------
// Translation helper — resolves a key from the pre-fetched flat dict
// ---------------------------------------------------------------------------

function tr(
  dict: Record<string, string>,
  key: string,
  fallback: string,
): string {
  return dict[key] ?? fallback;
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

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

  // --- State A: site not found ---
  if (!resolved) {
    return (
      <main className="min-h-screen bg-(--color-background) py-10 sm:py-14">
        <div className="mx-auto w-full max-w-2xl px-4 sm:px-6">
          <section className="rounded-xl border border-(--builder-color-border) bg-(--builder-color-surface) p-5 shadow-(--builder-shadow) sm:p-7">
            <h1 className="text-3xl text-(--builder-color-text) sm:text-4xl">
              RSVP
            </h1>
            <p className="mt-3 text-sm leading-6 text-(--builder-color-text-muted)">
              Site not found.
            </p>
          </section>
        </div>
      </main>
    );
  }

  const { siteId } = resolved;
  const rawCode = code?.trim() ?? "";

  // --- State B: missing code (before DB call) ---
  if (!rawCode) {
    const t = await getMergedTranslations(siteId, lang, "en");
    return (
      <main className="min-h-screen bg-(--color-background) py-10 sm:py-14">
        <div className="mx-auto w-full max-w-2xl px-4 sm:px-6">
          <section className="rounded-xl border border-(--builder-color-border) bg-(--builder-color-surface) p-5 shadow-(--builder-shadow) sm:p-7">
            <h1 className="text-3xl text-(--builder-color-text) sm:text-4xl">
              {tr(t, "rsvp.page.title", "RSVP")}
            </h1>
            <p className="mt-3 text-sm leading-6 text-(--builder-color-text-muted)">
              {tr(
                t,
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

  // --- State B: invalid/expired code ---
  if (!result.ok) {
    const t = await getMergedTranslations(siteId, lang, "en");
    return (
      <main className="min-h-screen bg-(--color-background) py-10 sm:py-14">
        <div className="mx-auto w-full max-w-2xl px-4 sm:px-6">
          <section className="rounded-xl border border-(--builder-color-border) bg-(--builder-color-surface) p-5 shadow-(--builder-shadow) sm:p-7">
            <h1 className="text-3xl text-(--builder-color-text) sm:text-4xl">
              {tr(t, "rsvp.page.title", "RSVP")}
            </h1>
            <p className="mt-3 text-sm leading-6 text-(--builder-color-text-muted)">
              {tr(
                t,
                "rsvp.page.invalid_link",
                "This link is invalid or has expired.",
              )}
            </p>
          </section>
        </div>
      </main>
    );
  }

  // --- State C: valid code — render form ---
  const { party, partyState } = result;
  const t = await getMergedTranslations(siteId, lang, "en");

  const defaultStatus = partyState?.status ?? "attending";
  const defaultHeadcount = String(partyState?.headcount ?? 1);
  const defaultComment = partyState?.comment ?? "";

  const headcountOptions = Array.from(
    { length: party.max_guests },
    (_, i) => i + 1,
  );

  return (
    <main className="min-h-screen bg-(--color-background) py-10 sm:py-14">
      <div className="mx-auto w-full max-w-2xl px-4 sm:px-6">
        <section className="rounded-xl border border-(--builder-color-border) bg-(--builder-color-surface) p-5 shadow-(--builder-shadow) sm:p-7">
          <h1 className="text-3xl text-(--builder-color-text) sm:text-4xl">
            {tr(t, "rsvp.page.title", "RSVP")}
          </h1>

          <form
            method="POST"
            action="/api/rsvp/submit"
            className="mt-6 space-y-6"
          >
            <input type="hidden" name="code" value={rawCode} />
            <input type="hidden" name="lang" value={lang} />

            <fieldset className="space-y-3 rounded-lg border border-(--builder-color-border) bg-(--builder-color-muted-surface) p-4">
              <legend className="px-1 text-sm font-semibold text-(--builder-color-text)">
                {tr(t, "rsvp.form.status.label", "Will you attend?")}
              </legend>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="flex items-start gap-3 rounded-lg border border-(--builder-color-border) bg-white px-3 py-3 text-sm text-(--builder-color-text)">
                  <input
                    type="radio"
                    name="status"
                    value="attending"
                    defaultChecked={defaultStatus === "attending"}
                    className="mt-0.5 h-4 w-4 shrink-0"
                  />
                  <span>
                    {tr(t, "rsvp.form.status.attending", "Yes, I'll be there")}
                  </span>
                </label>

                <label className="flex items-start gap-3 rounded-lg border border-(--builder-color-border) bg-white px-3 py-3 text-sm text-(--builder-color-text)">
                  <input
                    type="radio"
                    name="status"
                    value="not_attending"
                    defaultChecked={defaultStatus === "not_attending"}
                    className="mt-0.5 h-4 w-4 shrink-0"
                  />
                  <span>
                    {tr(
                      t,
                      "rsvp.form.status.not_attending",
                      "Sorry, I can't make it",
                    )}
                  </span>
                </label>
              </div>
            </fieldset>

            <div className="space-y-1.5 rounded-lg border border-(--builder-color-border) bg-(--builder-color-muted-surface) p-4">
              <label
                htmlFor="rsvp-headcount"
                className="block text-sm font-medium text-(--builder-color-text)"
              >
                {tr(t, "rsvp.form.headcount.label", "Number of guests")}
              </label>
              <select
                id="rsvp-headcount"
                name="headcount"
                defaultValue={defaultHeadcount}
                className="w-full rounded-md border border-(--builder-color-border) bg-white px-3 py-2 text-sm text-(--builder-color-text) focus:border-(--builder-color-primary) focus:outline-none focus:ring-2 focus:ring-(--builder-color-primary)/20"
              >
                {headcountOptions.map((n) => (
                  <option key={n} value={String(n)}>
                    {n}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5 rounded-lg border border-(--builder-color-border) bg-(--builder-color-muted-surface) p-4">
              <label
                htmlFor="rsvp-comment"
                className="block text-sm font-medium text-(--builder-color-text)"
              >
                {tr(t, "rsvp.form.comment.label", "Message (optional)")}
              </label>
              <textarea
                id="rsvp-comment"
                name="comment"
                rows={4}
                defaultValue={defaultComment}
                className="w-full rounded-md border border-(--builder-color-border) bg-white px-3 py-2 text-sm text-(--builder-color-text) focus:border-(--builder-color-primary) focus:outline-none focus:ring-2 focus:ring-(--builder-color-primary)/20"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-md bg-(--builder-color-primary) px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-(--builder-color-primary-hover) focus:outline-none focus:ring-2 focus:ring-(--builder-color-primary-focus) focus:ring-offset-2"
            >
              {tr(t, "rsvp.form.submit", "Send RSVP")}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
