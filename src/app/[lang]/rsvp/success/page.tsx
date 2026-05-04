import { getMergedTranslations } from "@/4-shared/lib/i18n";
import { resolveSiteIdFromHost } from "@/4-shared/lib/site/resolveSiteIdFromHost";
import type { Metadata } from "next";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

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

function tr(
  dict: Record<string, string>,
  key: string,
  fallback: string,
): string {
  return dict[key] ?? fallback;
}

export default async function RsvpSuccessPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const host = (await headers()).get("host") ?? "";
  const resolved = await resolveSiteIdFromHost(host);

  if (!resolved) {
    return (
      <main className="min-h-screen bg-(--color-background) py-10 sm:py-14">
        <div className="mx-auto w-full max-w-xl px-4 sm:px-6">
          <section className="rounded-xl border border-(--marketing-color-border) bg-(--marketing-color-surface) p-6 text-center shadow-(--marketing-shadow) sm:p-8">
            <h1 className="text-3xl text-(--marketing-color-text) sm:text-4xl">
              RSVP
            </h1>
            <p className="mt-3 text-sm leading-6 text-(--marketing-color-text-muted)">
              Your RSVP has been submitted. Thank you!
            </p>
          </section>
        </div>
      </main>
    );
  }

  const t = await getMergedTranslations(resolved.siteId, lang, "en");

  return (
    <main className="min-h-screen bg-(--color-background) py-10 sm:py-14">
      <div className="mx-auto w-full max-w-xl px-4 sm:px-6">
        <section className="rounded-xl border border-(--marketing-color-border) bg-(--marketing-color-surface) p-6 text-center shadow-(--marketing-shadow) sm:p-8">
          <h1 className="text-3xl text-(--marketing-color-text) sm:text-4xl">
            RSVP
          </h1>
          <p className="mt-3 text-sm leading-6 text-(--marketing-color-text-muted)">
            {tr(
              t,
              "rsvp.success.message",
              "Your RSVP has been submitted. Thank you!",
            )}
          </p>
        </section>
      </div>
    </main>
  );
}
