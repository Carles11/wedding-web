import { MetadataRoute } from "next";
import { headers } from "next/headers";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const host = ((await headers()).get("host") ?? "").toLowerCase().trim();
  const baseUrl = host ? `https://${host}` : "https://weddweb.com";

  // Check if we are on the main marketing domain
  const isMainDomain = host === "weddweb.com" || host === "www.weddweb.com";

  return {
    rules: [
      // ── Standard Search Engines (Google, Bing, Yandex) ──────────────────────
      {
        userAgent: "*",
        allow: [
          "/",
          "/_next/static/", // ALLOW Google to see your CSS and JS for rendering
          "/_next/image/", // ALLOW Google to see optimized Next.js images
        ],
        disallow: [
          "/_next/", // Block the rest (JSON data, build manifests, etc.)
          "/*/auth/",
          "/*/builder/",
          "/api/",
          "/auth/",
          "/builder/",
        ],
      },

      // ── AI training crawlers ──────────────────────────────────────────────
      {
        userAgent: [
          "GPTBot",
          "Google-Extended",
          "anthropic-ai",
          "ClaudeBot",
          "PerplexityBot",
          "AmazonBot",
          "Meta-ExternalAgent",
          "Applebot-Extended",
          "Bytespider",
        ],
        ...(isMainDomain
          ? {
              // Tight allowlist — only marketing content for LLM training
              allow: [
                "/*/pricing/",
                "/*/faq/",
                "/en/",
                "/es/",
                "/fr/",
                "/de/",
                "/pt/",
                "/it/",
                "/ca/",
                "/ar/",
                "/hi/",
                "/zh/",
                "/ru/",
              ],
              disallow: ["/*/auth/", "/*/builder/", "/api/"],
            }
          : {
              // Absolute block — protect tenant wedding data from AI training
              disallow: "/",
            }),
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
