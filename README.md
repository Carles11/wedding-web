# Wedding-Web

**Multilingual, SaaS-ready wedding website platform**

Create customizable, scalable event sites for any couple or celebration, in any language, with built-in SEO, a data-driven structure, and multi-tenant architecture.  
Powered by Next.js 16+, Supabase, and strict Feature-Sliced Design.

---

## Quick Start

1. **Clone the repository**

   ```bash
   git clone https://github.com/Carles11/wedding-web.git
   cd wedding-web
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment**
   Create a `.env` file and add your Supabase keys:

   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

4. **Run locally**
   ```bash
   npm run dev
   ```
   App runs at [http://localhost:3000](http://localhost:3000).

---

## Features

- Data-driven event websites (nothing hardcoded)
- Multi-language support (11+ supported)
- Feature-Sliced Design for scalable modularity
- SEO-first, SSR/SSG rendering for all core content
- Full multi-tenancy (all queries/components per site/customer)
- Mobile-ready structure (Expo/React Native compatible)
- Open-source, white-label ready

---

## Internationalization (i18n) Architecture

- **All translations are stored in Supabase** (never hardcoded).
- Multiple helpers fetch and merge translation keys for global, site, builder/admin, and marketing contexts.
- Merge priority: site-specific → marketing → global → fallback.
- Supports 11+ languages, language fallback, in-memory caching.

> See [Notion docs](https://gregarious-louse-24f.notion.site/32f83b723884451893ed83b4c4722a10?v=5bcada60b2b24b0294ab8d5f9f7702b4) for deep dive.

---

## Feature Update Guide

- Feature metadata is centralized and key-mapped (`src/4-shared/config/plans/planCatalog.ts`).
- Titles/descriptions resolve by translation keys, with fallback if missing.
- Workflow: update plan catalog → update translation keys/SQL → run migration → verify UI/marketing cards.

> See [Notion docs](https://gregarious-louse-24f.notion.site/32f83b723884451893ed83b4c4722a10?v=5bcada60b2b24b0294ab8d5f9f7702b4) for workflow details.

---

## Architecture

- Feature-Sliced Design: strict layers/domains for maintainability.
- SSR everywhere for indexable, high-performance pages.
- Everything is database-driven and tenant-isolated (via `site_id`).
- **Sections:** Hero, Program, Details, Accommodation, What Else, Bank Data, Contact, builder/admin pages, marketing landing.
- All builder/admin features are modular and multi-language.

> See [Notion docs](https://gregarious-louse-24f.notion.site/32f83b723884451893ed83b4c4722a10?v=5bcada60b2b24b0294ab8d5f9f7702b4) for details and diagrams.

---

## SEO & Multilingual

- SSR/SSG for every public/tenant/marketing page.
- Semantic HTML, dynamic `<lang>`, hreflang, and canonical tags.
- SEO metadata per site/language, robust internationalized routing.

> See [Notion docs](https://gregarious-louse-24f.notion.site/32f83b723884451893ed83b4c4722a10?v=5bcada60b2b24b0294ab8d5f9f7702b4) for best practices.

---

## Extended Documentation

Full guides (setup, scaling, multi-tenancy, architecture, i18n, security, etc.):  
👉 [Wedding-Web Notion Documentation](https://gregarious-louse-24f.notion.site/32f83b723884451893ed83b4c4722a10?v=5bcada60b2b24b0294ab8d5f9f7702b4)

---

## License

MIT

---

## Single-Site-Per-User Enforcement (2026-03)

- By default, each user can only have **one site**. This is enforced at the database level with a unique constraint on `sites.owner_user_id` and in the API logic.
- If a user attempts to create a second site (e.g., via onboarding or builder), the backend will return the existing site instead of creating a duplicate.
- This prevents race conditions and duplicate site rows during onboarding or rapid navigation.

**How to enable multi-site (agency) support in the future:**

1. **Remove or relax the unique constraint** on `sites.owner_user_id` in your database:
   ```sql
   ALTER TABLE sites DROP CONSTRAINT unique_owner_user_id;
   ```
2. **Update API logic** in `/api/provision-site` and related hooks/components to allow multiple sites per user, and implement UI for site selection/creation.
3. **Update all queries** that assume a single site per user to handle multiple sites (e.g., show a site picker, or default to the most recent/active site).

> Until these changes are made, all users (except future agency roles) are limited to one site.

---

## 🧪 Automated SEO, i18n & Meta Testing

This project enforces **world-class automated quality for SEO, internationalization, and metadata** across all public-facing pages and all supported languages. Strict test coverage ensures that:

- Search engines and AI always see the correct `<head>` content,
- All language variants serve accurate, localized information,
- No silent SEO or translation regressions reach production.

---

### 🚦 What’s Covered

#### **Unit/SSR Metadata Tests (Jest)**

- Each language’s SSR-rendered `<title>`, `<meta name="description">`, Open Graph, Twitter Card, canonical, and `hreflang` tags are directly verified for presence, correctness, and proper localization.
- Matrix tests ensure no language is missing, using a fallback, or using incomplete/incorrect translations—tests compare meta output directly to translation files.
- Any failure blocks PRs and production deploys.

#### **E2E Meta Tests (Playwright)**

- Using browser automation, Playwright visits every `/[lang]` marketing page.
- Tests assert (in the real DOM, as a bot or browser would see it) that all meta/SEO tags are present, non-empty, and language-correct.
- Covers:
  - Title & description
  - Canonical and hreflang links (`rel="alternate"`)
  - Open Graph (`og:title`, `og:description`, `og:image`, `og:locale`)
  - Twitter card tags
  - Ensures perfect parity between SSR, deployed output, and translation data

#### **Project Layout Best Practice**

- Unit/SSR tests use Jest and reside in `src/**/__tests__` folders—run with `npm test`
- Playwright E2E tests are placed in `/e2e`—run with `npx playwright test e2e/`
- Both runners are configured to **ignore each other's test files** for isolated, rapid, and accurate feedback.

---

### 🟢 How to Run Tests

- **Unit/SSR meta tests:**
  ```bash
  npm test
  ```
- **E2E Playwright meta/browser tests:**
  _(Start your Next.js dev or production server first)_
  ```bash
  npx playwright test e2e/
  ```

---

### 🛡️ What This Guarantees

- **Zero SEO or i18n regression risk:** All supported languages always have correct and localized metadata.
- **Google, Bing, and AI-friendly:** Pages are indexable and discoverable in every locale. OpenGraph and Twitter previews are always accurate for organic sharing and ads.
- **SaaS & multi-tenant readiness:** Test structure and data logic scales to endless weddings, events, admins, and languages.

---

## 🛠️ Future Testing Roadmap & Ideas

Keep your platform ahead of the curve by considering:

- **Builder/Editor E2E Tests:**  
  Test the wedding/event site builder UI for drag/drop, form validation, accessibility, and publish flows.
- **Tenant Site E2E Coverage:**  
  Add tests for custom domain routing, private event SEO (e.g., `noindex` for unlisted events), branded OpenGraph/Twitter per tenant.
- **Guest/RSVP Form Testing:**  
  Test multi-locale RSVP flows, invitation links, and backend data validation.
- **Sitemap & robots.txt CI Tests:**  
  Assert every new public page is listed in `sitemap.xml` and indexed properly; validate dynamic robots.txt policies.
- **Lighthouse Automated Audits:**  
  Run Core Web Vitals and accessibility scores for every deploy.
- **Broken Link & 404 Tests:**  
  E2E checks that every link (in nav, footer, page content) is valid, locale-correct, and non-broken.
- **Translation Completeness CI:**  
  Automated diffs/warnings when meta or UI strings are untranslated in any supported language.
- **Theme/Brand Tests:**  
  Verify custom themes, colors, and per-customer branding on all dynamic pages.

---

With this test discipline, your SaaS is resilient, future-proof, and trusted by global users!  
Want a specific sample for any next roadmap item? Just ask.
