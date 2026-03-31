import {
  GOOGLE_SITE_VERIFICATION,
  ICONS,
  ORGANIZATION_JSONLD,
  THEME_COLOR,
  WEBSITE_JSONLD,
} from "@/4-shared/config/seo/meta";
import { isValidLanguage } from "@/4-shared/helpers/isValidLanguage";
import { ReactNode } from "react";

export default async function LangLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang?: string }>;
}) {
  const realParams = await params;
  const lang = isValidLanguage(realParams.lang) ? realParams.lang : "en";

  return (
    <>
      {/* 
          Hoisted Elements: Next.js will move these into the 
          <head> of the Root Layout automatically.
      */}
      {ICONS.filter((icon) => icon.rel !== "manifest").map((icon, i) => (
        <link key={i} {...icon} />
      ))}

      <link
        rel="manifest"
        href={`/manifests/${lang}/site.webmanifest`}
        crossOrigin="use-credentials"
      />

      <meta name="theme-color" content={THEME_COLOR} />
      <meta name="language" content={lang} />
      <meta
        name="google-site-verification"
        content={GOOGLE_SITE_VERIFICATION}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(ORGANIZATION_JSONLD),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_JSONLD) }}
      />

      {/* The actual page content */}
      {children}
    </>
  );
}
