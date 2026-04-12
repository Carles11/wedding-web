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
        allow: "/",
        disallow: [
          "/_next/data/", // Block ISR/SSR JSON payloads (duplicate content)
          "/api/", // API routes — no HTML, must stay blocked
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
                "/*/features/multilingual-wedding-website",
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
              disallow: ["/api/"],
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
