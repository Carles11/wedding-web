import { MetadataRoute } from "next";
import { headers } from "next/headers";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const host = ((await headers()).get("host") ?? "").toLowerCase().trim();
  const baseUrl = host ? `https://${host}` : "https://weddweb.com";

  return {
    rules: [
      // ── Standard crawlers ─────────────────────────────────────────────────
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          // Auth routes under every language segment
          "/*/auth/",
          // Builder/Dashboard routes (Invisible route group (dashboard))
          "/*/builder/",
          // Internal API routes
          "/api/",
          // Legacy/Direct root paths
          "/auth/",
          "/builder/",
          // Next.js internal
          "/_next/",
        ],
      },

      // ── AI training crawlers — allow indexing marketing content only ──────
      {
        userAgent: [
          "GPTBot", // OpenAI
          "Google-Extended", // Google Gemini training
          "anthropic-ai", // Anthropic training
          "ClaudeBot", // Anthropic browsing
          "PerplexityBot", // Perplexity AI
          "AmazonBot", // Amazon / Alexa / Bedrock
          "Meta-ExternalAgent", // Meta AI
          "Applebot-Extended", // Apple Intelligence
          "Bytespider", // ByteDance / TikTok
        ],
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
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
