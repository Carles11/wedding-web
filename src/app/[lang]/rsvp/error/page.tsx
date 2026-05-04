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

export default async function RsvpErrorPage({
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
        <p>
          Something went wrong. Please use the link from your email again or try
          later.
        </p>
      </main>
    );
  }

  const t = await getMergedTranslations(resolved.siteId, lang, "en");

  return (
    <main>
      <p>
        {tr(
          t,
          "rsvp.error.message",
          "Something went wrong. Please use the link from your email again or try later.",
        )}
      </p>
    </main>
  );
}
