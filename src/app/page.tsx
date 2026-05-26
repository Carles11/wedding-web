export const dynamic = "force-dynamic";
import { SUPPORTED_LANGUAGES } from "@/4-shared/config/i18n";
import { generateSiteMetadata } from "@/4-shared/lib/seo/generateSiteMetadata";
import ClientRedirect from "./ClientRedirect";

export async function generateMetadata() {
  // Simulate a "site" object for marketing context (no tenant)
  const site = {
    languages: SUPPORTED_LANGUAGES,
    default_lang: "en",
  };
  const baseUrl = "https://weddweb.com";
  const lang = "en";
  const translations = {
    "meta.marketing_title": "WeddWeb — Multilingual Wedding Website Builder",
    "meta.marketing_description":
      "Create your wedding website in 11+ languages. Fast, beautiful, and global.",
  };

  // Use generateSiteMetadata, but override canonical and x-default to root
  const meta = generateSiteMetadata({
    site,
    lang,
    translations,
    baseUrl,
    pageKind: "marketing",
  });

  // Force canonical and x-default to root
  meta.alternates = {
    canonical: "https://weddweb.com/",
    languages: Object.fromEntries([
      ...SUPPORTED_LANGUAGES.map((l) => [l, `https://weddweb.com/${l}`]),
      ["x-default", "https://weddweb.com/"],
    ]),
  };

  return meta;
}

export default function RootPage() {
  return (
    <main
      style={{
        padding: "3rem 1rem",
        maxWidth: 600,
        margin: "0 auto",
        textAlign: "center",
      }}
    >
      <h1>Welcome to WeddWeb</h1>
      <p>
        This is the multilingual wedding website builder for the world. (Replace
        this text with your real marketing copy.)
      </p>
      <ClientRedirect />
    </main>
  );
}
