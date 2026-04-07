# Wedding-Web

**Multilingual, SaaS-ready wedding website platform**

Create customizable, scalable event sites for any couple or celebration, in any language, with built-in SEO, a data-driven structure, and multi-tenant architecture.  
Powered by Next.js 16+, Supabase, and strict Feature-Sliced Design.

---

## 🚀 Quick Start

**1. Clone & Install**

```bash
git clone https://github.com/Carles11/wedding-web.git
cd wedding-web
npm install
```

**2. Configure Environment**

Create a `.env` file with your Supabase and SEO keys:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
INDEXNOW_KEY=your-indexnow-key
```

**3. Run Dev**

```bash
npm run dev
```

---

## 🏗️ Architecture & Multi-Tenancy

- **Feature-Sliced Design (FSD)** — Strict separation of concerns across Pages, Widgets, Features, and Entities.
- **Dynamic Routing** — Supports both subdomains (`couple.weddweb.com`) and custom domains (`ourwedding.com`) via a unified `getPrimaryDomain` canonical logic.
- **SSR/SSG Hybrid** — Every wedding site is fully server-rendered for instant indexing and high performance.
- **Data Isolation** — Enforced via Supabase RLS and `site_id` scoping across 11+ language variants.

📖 [Deep Dive: Architecture & Multi-Tenancy Spec](#)

---

## 🌐 Internationalization (i18n)

Every site, page, and UI element supports rich translations across 11+ languages and three distinct contexts — tenant, builder/admin, and marketing — with robust fallback logic and zero hardcoded strings.

### Translation Sources

All translations are data-driven and stored in Supabase:

| Table                           | Context       | Purpose                                                         |
| ------------------------------- | ------------- | --------------------------------------------------------------- |
| `global_translations`           | Universal     | System-wide UI keys (buttons, labels) shared across all tenants |
| `site_translations`             | Per-tenant    | Site-specific overrides: custom stories, names, branding        |
| `global_translations_builder`   | Builder/Admin | Back-office and editor-only keys                                |
| `global_translations_marketing` | Marketing     | Public SaaS landing and pricing page content                    |

### Translation Fetchers

Each context uses a specialized fetcher with in-memory caching and automatic language fallback:

| Function                     | Context       | Returns                     | Use Case                        |
| ---------------------------- | ------------- | --------------------------- | ------------------------------- |
| `fetchGlobalTranslations`    | Any           | Global keys only            | Universal UI (timeline, labels) |
| `getMergedTranslations`      | Tenant/Public | Site keys + Global fallback | Public event sites              |
| `fetchBuilderTranslations`   | Builder/Admin | Builder + Global fallback   | Admin/editor interfaces         |
| `fetchMarketingTranslations` | Marketing     | Marketing + Global fallback | SaaS landing, pricing           |

### Merge Priority (Resolution Order)

1. Site-specific translation (`site_translations`)
2. Marketing-specific translation (`global_translations_marketing`)
3. Global translation (`global_translations`)
4. Fallback to `"en"`

**Fallback chain:** Target language → Default site language → English → Key name.

### SEO Integration

The i18n system is directly tied to platform SEO health:

- **Language routing** — The active `lang` determines the URL path (e.g., `/en`, `/ca`).
- **Metadata sync** — `generateSiteMetadata.ts` uses the `languages` array from the `sites` table to generate `hreflang` and `x-default` tags.
- **JSON-LD** — The `inLanguage` property in the `WeddingEvent` schema stays in sync with the current i18n context.
- **Search engine pings** — Adding a new language triggers an IndexNow ping to Bing/Yandex automatically (when `seo_enabled` is true).

### Adding or Updating Languages

1. Update the `languages` array in the `sites` table.
2. Add or edit keys in the relevant Supabase table.
3. The platform automatically notifies search engines via IndexNow — no manual action needed.

### Performance & Architecture

- **SSR caching** — Merged translations are cached per site + locale for 2–5 minutes to reduce Supabase load.
- **Full SSR rendering** — Pages render server-side so search engines receive fully translated content without waiting for client hydration.
- **FSD placement** — Translation helpers live in `src/4-shared/lib/` for modular, cross-domain usage.
- **Type safety** — Section types (e.g., `HeroSection`) use `Record<string, string>` to support all 11+ native scripts.

📖 [Deep Dive: SEO & Multilingual Spec](#)

---

## 🔍 Search & AI Optimization

- **IndexNow Engine** — Automated, non-blocking pings to Bing/Yandex for all site creation, language additions, and domain updates.
- **AI Crawler Policy** — Host-aware `robots.txt` that allows AI bots to index marketing content while strictly blocking them from training on private tenant wedding data.
- **Global i18n SEO** — Dynamic `hreflang`, `x-default`, and JSON-LD structured data synchronized across 11+ native scripts.

📖 [Deep Dive: SEO & Multilingual Spec](#)

---

## 🛠️ Key Infrastructure

- **Payments** — Stripe integration with automated multi-environment webhook handling.
- **Communications** — Resend API for localized transactional emails (11+ languages).
- **Persistence** — "Legacy Mode" automation using `pg_cron` to maintain site history while encouraging premium upgrades.
- **Fonts** — Multi-tenant font system using Tailwind v4 CSS variables.

📖 Step-by-Step Guides: [Stripe Setup](#) | [Resend i18n Guide](#)

---

## 🧪 Quality Assurance

- **Unit/SSR Tests (Jest)** — Verifies `<head>` tags, `hreflang` correctness, and translation fallbacks.
- **E2E Tests (Playwright)** — Browser automation visits localized routes to assert DOM metadata parity.
- **CI/CD** — Automated checks for SEO and translation regressions.

📖 [Deep Dive: TDD & QA Documentation](#)

---

## 📜 Full Documentation

For complete technical specs, deployment guides, and feature roadmaps, visit the:

👉 [Wedding-Web Notion Documentation Portal](#)

https://www.notion.so/32f83b723884451893ed83b4c4722a10?v=5bcada60b2b24b0294ab8d5f9f7702b4

---

**License:** MIT — Copyright (c) 2026 Carles
