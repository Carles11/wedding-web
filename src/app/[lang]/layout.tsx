import {
  GOOGLE_SITE_VERIFICATION,
  ICONS,
  THEME_COLOR,
} from "@/4-shared/config/seo/meta";
import { isValidLanguage } from "@/4-shared/helpers/isValidLanguage";
import { generateGraphSchema } from "@/4-shared/lib/seo/generateGraphSchema";
import { JsonLd } from "@/4-shared/lib/seo/JsonLd";
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

      {/*
        Single consolidated @graph block — Organization, WebSite, and SoftwareApplication
        are linked via @id references so LLMs and structured-data validators see one
        coherent semantic entity instead of multiple disconnected scripts.

        SoftwareApplication uses PLAN_CATALOG static titles as fallbacks here (layout has
        no translations). The marketing page does NOT inject a duplicate — this is the
        single source of truth for all three entities.
      */}
      <JsonLd data={generateGraphSchema({}, lang)} />

      {/* The actual page content */}
      {children}
    </>
  );
}
