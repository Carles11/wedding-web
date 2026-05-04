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
      <main>
        <p>Your RSVP has been submitted. Thank you!</p>
      </main>
    );
  }

  const t = await getMergedTranslations(resolved.siteId, lang, "en");

  return (
    <main>
      <p>
        {tr(
          t,
          "rsvp.success.message",
          "Your RSVP has been submitted. Thank you!",
        )}
      </p>
    </main>
  );
}
