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
      <main>
        <p>Site not found.</p>
      </main>
    );
  }

  const { siteId } = resolved;
  const rawCode = code?.trim() ?? "";

  // --- State B: missing code (before DB call) ---
  if (!rawCode) {
    const t = await getMergedTranslations(siteId, lang, "en");
    return (
      <main>
        <p>
          {tr(
            t,
            "rsvp.page.invalid_link",
            "This link is invalid or has expired.",
          )}
        </p>
      </main>
    );
  }

  const result = await validateRsvpAccessCode({ siteId, rawCode });

  // --- State B: invalid/expired code ---
  if (!result.ok) {
    const t = await getMergedTranslations(siteId, lang, "en");
    return (
      <main>
        <p>
          {tr(
            t,
            "rsvp.page.invalid_link",
            "This link is invalid or has expired.",
          )}
        </p>
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
    <main>
      <h1>{tr(t, "rsvp.page.title", "RSVP")}</h1>

      <form method="POST" action="/api/rsvp/submit">
        <input type="hidden" name="code" value={rawCode} />
        <input type="hidden" name="lang" value={lang} />

        <fieldset>
          <legend>{tr(t, "rsvp.form.status.label", "Will you attend?")}</legend>

          <label>
            <input
              type="radio"
              name="status"
              value="attending"
              defaultChecked={defaultStatus === "attending"}
            />
            {tr(t, "rsvp.form.status.attending", "Yes, I'll be there")}
          </label>

          <label>
            <input
              type="radio"
              name="status"
              value="not_attending"
              defaultChecked={defaultStatus === "not_attending"}
            />
            {tr(t, "rsvp.form.status.not_attending", "Sorry, I can't make it")}
          </label>
        </fieldset>

        <label>
          {tr(t, "rsvp.form.headcount.label", "Number of guests")}
          <select name="headcount" defaultValue={defaultHeadcount}>
            {headcountOptions.map((n) => (
              <option key={n} value={String(n)}>
                {n}
              </option>
            ))}
          </select>
        </label>

        <label>
          {tr(t, "rsvp.form.comment.label", "Message (optional)")}
          <textarea name="comment" defaultValue={defaultComment} />
        </label>

        <button type="submit">{tr(t, "rsvp.form.submit", "Send RSVP")}</button>
      </form>
    </main>
  );
}
