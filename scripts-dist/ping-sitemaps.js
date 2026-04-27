"use strict";
var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g = Object.create(
        (typeof Iterator === "function" ? Iterator : Object).prototype,
      );
    return (
      (g.next = verb(0)),
      (g["throw"] = verb(1)),
      (g["return"] = verb(2)),
      typeof Symbol === "function" &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while ((g && ((g = 0), op[0] && (_ = 0)), _))
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y["return"]
                  : op[0]
                    ? y["throw"] || ((t = y["return"]) && t.call(y), 0)
                    : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
var __spreadArray =
  (this && this.__spreadArray) ||
  function (to, from, pack) {
    if (pack || arguments.length === 2)
      for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
// scripts/ping-sitemaps.ts
var supabase_js_1 = require("@supabase/supabase-js");
require("dotenv/config");
var node_fetch_1 = __importDefault(require("node-fetch"));
var MAIN_DOMAIN = "www.weddweb.com";
var MARKETING_SITEMAP = "https://".concat(
  MAIN_DOMAIN,
  "/sitemap-marketing.xml",
);
var MAIN_SITEMAP = "https://".concat(MAIN_DOMAIN, "/sitemap.xml");
// --- Supabase Setup ---
var SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
var SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
var supabase = (0, supabase_js_1.createClient)(
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
);
// --- Ping Endpoints ---
var GOOGLE_PING = "https://www.google.com/ping?sitemap=";
var BING_PING = "https://www.bing.com/ping?sitemap=";
var INDEXNOW_ENDPOINT = process.env.INDEXNOW_ENDPOINT || ""; // Optional
// --- Utility Functions ---
function unique(arr) {
  return Array.from(new Set(arr));
}
function now() {
  return new Date().toISOString();
}
function getTenantSites() {
  return __awaiter(this, void 0, void 0, function () {
    var _a, data, error;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          return [
            4 /*yield*/,
            supabase
              .from("sites")
              .select("domains, subdomain, seo_enabled")
              .eq("seo_enabled", true),
          ];
        case 1:
          ((_a = _b.sent()), (data = _a.data), (error = _a.error));
          if (error)
            throw new Error("Failed to fetch tenant sites: " + error.message);
          return [2 /*return*/, data];
      }
    });
  });
}
function getSitemapUrlsFromTenants(sites) {
  var urls = [];
  for (var _i = 0, sites_1 = sites; _i < sites_1.length; _i++) {
    var site = sites_1[_i];
    if (!site.seo_enabled) continue;
    // Custom domains
    if (Array.isArray(site.domains)) {
      for (var _a = 0, _b = site.domains; _a < _b.length; _a++) {
        var domain = _b[_a];
        if (domain && !domain.includes("localhost")) {
          urls.push("https://".concat(domain, "/sitemap.xml"));
        }
      }
    }
    // Subdomain fallback
    if (site.subdomain && !site.subdomain.includes("localhost")) {
      urls.push(
        "https://"
          .concat(site.subdomain, ".")
          .concat(MAIN_DOMAIN.replace("www.", ""), "/sitemap.xml"),
      );
    }
  }
  return urls;
}
function pingEngine(engine, sitemapUrl) {
  return __awaiter(this, void 0, void 0, function () {
    var endpoint, url, res;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          endpoint = engine === "Google" ? GOOGLE_PING : BING_PING;
          url = endpoint + encodeURIComponent(sitemapUrl);
          return [
            4 /*yield*/,
            (0, node_fetch_1.default)(url, { method: "GET" }),
          ];
        case 1:
          res = _a.sent();
          return [2 /*return*/, { status: res.status, ok: res.ok }];
      }
    });
  });
}
function pingIndexNow(sitemapUrl) {
  return __awaiter(this, void 0, void 0, function () {
    var res;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          if (!INDEXNOW_ENDPOINT)
            return [2 /*return*/, { status: 0, ok: false }];
          return [
            4 /*yield*/,
            (0, node_fetch_1.default)(INDEXNOW_ENDPOINT, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ urlList: [sitemapUrl] }),
            }),
          ];
        case 1:
          res = _a.sent();
          return [2 /*return*/, { status: res.status, ok: res.ok }];
      }
    });
  });
}
// --- Health Check Helper ---
async function checkSitemapHealth(sitemapUrl) {
  try {
    const res = await (0, node_fetch_1.default)(sitemapUrl, { method: "GET" });
    return res.status === 200;
  } catch (e) {
    return false;
  }
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

  // --- Health Check Phase ---
  const healthySitemaps = [];
  const skippedSitemaps = [];
  for (const sitemap of allSitemaps) {
    const ok = await checkSitemapHealth(sitemap);
    if (ok) {
      healthySitemaps.push(sitemap);
      console.log(`[CHECK] ${sitemap} -> OK`);
    } else {
      skippedSitemaps.push(sitemap);
      console.log(`[CHECK] ${sitemap} -> SKIP (not found)`);
    }
  }

  // --- Ping Phase ---
  const results = [];
  for (const sitemap of healthySitemaps) {
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

  // --- Summary ---
  console.log("\n--- Sitemap Health Check ---");
  for (const s of skippedSitemaps) {
    console.log(`[SKIPPED] ${s}`);
  }
  for (const s of healthySitemaps) {
    console.log(`[PINGED] ${s}`);
  }
  console.log(`\nTotal sitemaps checked: ${allSitemaps.length}`);
  console.log(`Total pinged: ${healthySitemaps.length}`);
  console.log(`Total skipped: ${skippedSitemaps.length}`);

  console.log("\n--- Sitemap Ping Results ---");
  for (const r of results) {
    console.log(
      `[${r.timestamp}] [${r.engine}] ${r.sitemap} -> ${r.ok ? "SUCCESS" : "FAIL"} (${r.status})`,
    );
  }
  process.exit(0);
}

main().catch(function (err) {
  console.error("Fatal error:", err);
  process.exit(1);
});
