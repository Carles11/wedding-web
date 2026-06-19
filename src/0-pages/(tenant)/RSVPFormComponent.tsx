import { RsvpHeadcountEnhancer } from "@/4-shared/ui/commons/RsvpHeadcountEnhancer.client";
import type { ReactNode } from "react";

type RsvpStatus = "attending" | "not_attending";

function tr(
  dict: Record<string, string>,
  key: string,
  fallback: string,
): string {
  return dict[key] ?? fallback;
}

export type RSVPFormComponentProps = {
  lang: string;
  rawCode: string;
  t: Record<string, string>;
  party: {
    max_guests: number;
  };
  partyState: null | {
    status: RsvpStatus;
    headcount: number | null;
    comment: string | null;
    meal_intolerances: string | null;
    song_request: string | null;
  };
  isPremium: boolean;
  /** Optional: allow page to inject extra content (e.g. alerts) without changing form. */
  headerSlot?: ReactNode;
};

export function RSVPFormComponent(props: RSVPFormComponentProps) {
  const { lang, rawCode, t, party, partyState, isPremium, headerSlot } = props;

  const defaultStatus: RsvpStatus = partyState?.status ?? "attending";

  const defaultHeadcount = String(
    partyState?.headcount ?? (defaultStatus === "not_attending" ? 0 : 1),
  );

  const defaultComment = partyState?.comment ?? "";
  const defaultMealIntolerances = partyState?.meal_intolerances ?? "";
  const defaultSongRequest = partyState?.song_request ?? "";

  const headcountOptions = [
    0,
    ...Array.from({ length: party.max_guests }, (_, i) => i + 1),
  ];

  return (
    <>
      {headerSlot}

      <RsvpHeadcountEnhancer />

      <form method="POST" action="/api/rsvp/submit" className="mt-6 space-y-6">
        <input type="hidden" name="code" value={rawCode} />
        <input type="hidden" name="lang" value={lang} />

        <fieldset className="space-y-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-4">
          <legend className="px-1 text-sm font-semibold text-(--color-foreground)">
            {tr(t, "rsvp.form.status.label", "Will you attend?")}
          </legend>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="flex items-start gap-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-3 text-sm text-(--color-foreground)">
              <input
                type="radio"
                name="status"
                value="attending"
                defaultChecked={defaultStatus === "attending"}
                className="mt-0.5 h-4 w-4 shrink-0 accent-(--marketing-color-primary)"
              />
              <span>
                {tr(t, "rsvp.form.status.attending", "Yes, I'll be there")}
              </span>
            </label>

            <label className="flex items-start gap-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-3 text-sm text-(--color-foreground)">
              <input
                type="radio"
                name="status"
                value="not_attending"
                defaultChecked={defaultStatus === "not_attending"}
                className="mt-0.5 h-4 w-4 shrink-0 accent-(--marketing-color-primary)"
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

          {/* SSR-only hint: server enforces headcount=0 when not attending */}
          <p className="text-xs leading-5 text-gray-500 dark:text-gray-400">
            {tr(
              t,
              "rsvp.form.headcount.note",
              "If you can’t attend, the number of guests will be saved as 0.",
            )}
          </p>
        </fieldset>

        <div className="space-y-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-4">
          <label
            htmlFor="rsvp-headcount"
            className="block text-sm font-medium text-(--color-foreground)"
          >
            {tr(t, "rsvp.form.headcount.label", "Number of guests")}
          </label>

          <select
            id="rsvp-headcount"
            name="headcount"
            defaultValue={defaultHeadcount}
            className="w-full rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-(--color-foreground) outline-none focus:border-[var(--marketing-color-primary)] focus:ring-2 focus:ring-[var(--marketing-color-primary-focus)]"
          >
            {headcountOptions.map((n) => (
              <option key={n} value={String(n)}>
                {n}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-4">
          <label
            htmlFor="rsvp-comment"
            className="block text-sm font-medium text-(--color-foreground)"
          >
            {tr(t, "rsvp.form.comment.label", "Message (optional)")}
          </label>

          <textarea
            id="rsvp-comment"
            name="comment"
            rows={4}
            defaultValue={defaultComment}
            className="w-full rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-(--color-foreground) outline-none focus:border-(--marketing-color-primary) focus:ring-2 focus:ring-(--marketing-color-primary-focus)"
          />
        </div>

        {isPremium && (
          <>
            <div className="space-y-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-4">
              <label
                htmlFor="rsvp-meal-intolerances"
                className="block text-sm font-medium text-(--color-foreground)"
              >
                {tr(
                  t,
                  "rsvp.form.meal_intolerances.label",
                  "Meal intolerances or dietary restrictions (optional)",
                )}
              </label>

              <textarea
                id="rsvp-meal-intolerances"
                name="meal_intolerances"
                rows={3}
                defaultValue={defaultMealIntolerances}
                placeholder={tr(
                  t,
                  "rsvp.form.meal_intolerances.placeholder",
                  "E.g.: nuts, gluten, dairy, vegetarian, vegan, etc.",
                )}
                className="w-full rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-(--color-foreground) outline-none focus:border-(--marketing-color-primary) focus:ring-2 focus:ring-(--marketing-color-primary-focus)"
              />
            </div>

            <div className="space-y-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-4">
              <label
                htmlFor="rsvp-song-request"
                className="block text-sm font-medium text-(--color-foreground)"
              >
                {tr(
                  t,
                  "rsvp.form.song_request.label",
                  "Song request (optional)",
                )}
              </label>

              <input
                id="rsvp-song-request"
                type="text"
                name="song_request"
                defaultValue={defaultSongRequest}
                placeholder={tr(
                  t,
                  "rsvp.form.song_request.placeholder",
                  "Let us know a song you want to hear on the dance floor!",
                )}
                className="w-full rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-(--color-foreground) outline-none focus:border-(--marketing-color-primary) focus:ring-2 focus:ring-(--marketing-color-primary-focus)"
              />
            </div>
          </>
        )}

        <button
          type="submit"
          className="w-full rounded-md bg-(--marketing-color-primary) px-4 py-2.5 text-sm font-semibold text-white dark:text-gray-100 transition-colors hover:bg-(--marketing-color-primary-hover) focus:outline-none focus:ring-2 focus:ring-(--marketing-color-primary-focus) focus:ring-offset-2"
        >
          {tr(t, "rsvp.form.submit", "Send RSVP")}
        </button>
      </form>
    </>
  );
}
