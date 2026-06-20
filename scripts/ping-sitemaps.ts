// scripts/ping-sitemaps.ts
import { createClient } from "@supabase/supabase-js";
import "dotenv/config";
import fetch from "node-fetch";

type TenantSite = {
  domains: string[];
  subdomain?: string;
  seo_enabled: boolean;
};

const MAIN_DOMAIN = "weddweb.com";
const MARKETING_SITEMAP = `https://${MAIN_DOMAIN}/sitemap-marketing.xml`;
const MAIN_SITEMAP = `https://${MAIN_DOMAIN}/sitemap.xml`;

// --- Supabase Setup ---
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// --- Ping Endpoints ---
const GOOGLE_PING = "https://www.google.com/ping?sitemap=";
const BING_PING = "https://www.bing.com/ping?sitemap=";
const INDEXNOW_ENDPOINT = process.env.INDEXNOW_ENDPOINT || ""; // Optional

// --- Utility Functions ---
function unique<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

function now() {
  return new Date().toISOString();
}

async function getTenantSites(): Promise<TenantSite[]> {
  const { data, error } = await supabase
    .from("sites")
    .select("domains, subdomain, seo_enabled")
    .eq("seo_enabled", true);

  if (error) throw new Error("Failed to fetch tenant sites: " + error.message);
  return data as TenantSite[];
}

function getSitemapUrlsFromTenants(sites: TenantSite[]): string[] {
  const urls: string[] = [];
  for (const site of sites) {
    if (!site.seo_enabled) continue;
    // Custom domains
    if (Array.isArray(site.domains)) {
      for (const domain of site.domains) {
        if (domain && !domain.includes("localhost")) {
          urls.push(`https://${domain}/sitemap.xml`);
        }
      }
    }
    // Subdomain fallback
    if (site.subdomain && !site.subdomain.includes("localhost")) {
      urls.push(
        `https://${site.subdomain}.${MAIN_DOMAIN.replace("www.", "")}/sitemap.xml`,
      );
    }
  }
  return urls;
}

async function pingEngine(
  engine: "Google" | "Bing",
  sitemapUrl: string,
): Promise<{ status: number; ok: boolean }> {
  const endpoint = engine === "Google" ? GOOGLE_PING : BING_PING;
  const url = endpoint + encodeURIComponent(sitemapUrl);
  const res = await fetch(url, { method: "GET" });
  return { status: res.status, ok: res.ok };
}

async function pingIndexNow(
  sitemapUrl: string,
): Promise<{ status: number; ok: boolean }> {
  if (!INDEXNOW_ENDPOINT) return { status: 0, ok: false };
  const res = await fetch(INDEXNOW_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ urlList: [sitemapUrl] }),
  });
  return { status: res.status, ok: res.ok };
}

// --- Main Logic ---
async function main() {
  console.log(`[${now()}] Starting sitemap ping script...`);

  // 1. Collect all sitemap URLs
  const tenantSites = await getTenantSites();
  const tenantSitemaps = getSitemapUrlsFromTenants(tenantSites);
  const allSitemaps = unique([
    MAIN_SITEMAP,
    MARKETING_SITEMAP,
    ...tenantSitemaps,
  ]);

  // 2. Ping each engine for each sitemap
  const results: Array<{
    sitemap: string;
    engine: string;
    status: number;
    ok: boolean;
    timestamp: string;
  }> = [];

  for (const sitemap of allSitemaps) {
    // Google
    try {
      const res = await pingEngine("Google", sitemap);
      results.push({ sitemap, engine: "Google", ...res, timestamp: now() });
      console.log(
        `[Google] ${sitemap} -> ${res.ok ? "OK" : "FAIL"} (${res.status})`,
      );
    } catch (e) {
      results.push({
        sitemap,
        engine: "Google",
        status: 0,
        ok: false,
        timestamp: now(),
      });
      console.error(`[Google] ${sitemap} -> ERROR`, e);
    }
    // Bing
    try {
      const res = await pingEngine("Bing", sitemap);
      results.push({ sitemap, engine: "Bing", ...res, timestamp: now() });
      console.log(
        `[Bing] ${sitemap} -> ${res.ok ? "OK" : "FAIL"} (${res.status})`,
      );
    } catch (e) {
      results.push({
        sitemap,
        engine: "Bing",
        status: 0,
        ok: false,
        timestamp: now(),
      });
      console.error(`[Bing] ${sitemap} -> ERROR`, e);
    }
    // IndexNow (optional)
    if (INDEXNOW_ENDPOINT) {
      try {
        const res = await pingIndexNow(sitemap);
        results.push({ sitemap, engine: "IndexNow", ...res, timestamp: now() });
        console.log(
          `[IndexNow] ${sitemap} -> ${res.ok ? "OK" : "FAIL"} (${res.status})`,
        );
      } catch (e) {
        results.push({
          sitemap,
          engine: "IndexNow",
          status: 0,
          ok: false,
          timestamp: now(),
        });
        console.error(`[IndexNow] ${sitemap} -> ERROR`, e);
      }
    }
    // Optional: delay to avoid rate limits
    await new Promise((r) => setTimeout(r, 500));
  }

  // 3. Summary
  console.log("\n--- Sitemap Ping Summary ---");
  for (const r of results) {
    console.log(
      `[${r.timestamp}] [${r.engine}] ${r.sitemap} -> ${r.ok ? "SUCCESS" : "FAIL"} (${r.status})`,
    );
  }
  console.log(`\nTotal sitemaps pinged: ${allSitemaps.length}`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
