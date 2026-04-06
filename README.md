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

> See [Notion docs](https://gregarious-louse-24f.notion.site/32f83b723884451893ed83b4c4722a10?v=5bcada60b2b24b0294ab8d5f9f7702b4) for deep dive.

---

## Internationalization (i18n) Architecture

- **All translations are stored in Supabase** (never hardcoded).
- Multiple helpers fetch and merge translation keys for global, site, builder/, and marketing contexts.
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
- **Sections:** Hero, Program, Details, Accommodation, What Else, Bank Data, Contact, builder/ pages, marketing landing.
- All builder/ features are modular and multi-language.

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

## Stripe Webhook Setup Checklist

Follow these steps to ensure Stripe webhooks work in all environments:

### 1. Local Development

- [ ] **Stripe CLI:** Install and log in (`stripe login`).
- [ ] **Start local server:** Ensure `/api/stripe/webhooks` is running locally (e.g., `localhost:3000/api/stripe/webhooks`).
- [ ] **Forward webhooks:**
  ```bash
  stripe listen --forward-to localhost:3000/api/stripe/webhooks
  ```
- [ ] **Copy webhook secret:** Stripe CLI will show a secret (starts with `whsec_...`). Add it to your `.env.local` as `STRIPE_WEBHOOK_SECRET` (or `STRIPE_WEBHOOK_SECRET_TEST`).
- [ ] **Test payment:** Run through your payment flow. Check your local logs for webhook events and DB updates.
- [ ] **Debug:** If issues, check logs for signature errors, 400/500 responses, or missing env vars.

### 2. Beta/Preview Deploy (e.g., Vercel Preview)

- [ ] **Deploy code:** Push your latest code to your beta environment (e.g., `https://weddweb-beta.vercel.app`).
- [ ] **Add webhook in Stripe dashboard (test mode):**
  - Go to Developers → Webhooks.
  - Add endpoint: `https://weddweb-beta.vercel.app/api/stripe/webhooks`
  - Select events (at least `checkout.session.completed`).
- [ ] **Copy webhook secret:** After adding, Stripe will show a secret. Add it to your beta environment variables as `STRIPE_WEBHOOK_SECRET`.
- [ ] **Test payment:** Run through the payment flow on your beta site.
- [ ] **Check Stripe dashboard:** Webhook deliveries should show 200 OK. If not, check your beta server logs for errors.

### 3. Production

- [ ] **Deploy code:** Make sure `/api/stripe/webhooks` is deployed to your live domain (e.g., `https://www.weddweb.com`).
- [ ] **Add webhook in Stripe dashboard (live mode):**
  - Switch to live mode in Stripe.
  - Add endpoint: `https://www.weddweb.com/api/stripe/webhooks`
  - Select events (at least `checkout.session.completed`).
- [ ] **Copy webhook secret:** Add to your production environment as `STRIPE_WEBHOOK_SECRET`.
- [ ] **Test with real payment:** (or use Stripe’s test mode for a final check)
- [ ] **Monitor:** Webhook deliveries should show 200 OK. Check your production logs for any errors.

**Tips:**

- Always keep secrets separate for test and live.
- Remove or update old webhook endpoints if you change URLs.
- Use Stripe dashboard’s “Resend” feature to retry failed events after fixing issues.

---

## Email Verification & Resend Integration

WeddWeb uses the [Resend](https://resend.com/) email API to deliver all authentication and verification emails, including signup, password recovery, and email change flows. The integration is designed for reliability, localization, and security:

- **Triggering Resend:**
  - When a user requests a verification email (signup, password reset, or email change), the backend calls Supabase Auth’s `resend` method.
  - This triggers a Supabase Edge Function (`supabase/functions/resend-auth-hook/index.ts`) that securely handles the email delivery using the Resend API.

- **Localization:**
  - The Edge Function detects the user’s preferred language and selects the correct email template and translations from `EMAIL_TRANSLATIONS`.
  - All email content (subject, body, button text) is localized for 11+ languages.

- **Security:**
  - The Edge Function verifies webhook payloads and only sends emails for valid, signed requests.
  - Confirmation links are generated with secure tokens and proper redirect URLs.

- **Custom Branding:**
  - Emails are sent from `WeddWeb <hello@weddweb.com>` with a branded HTML template.

- **Error Handling:**
  - Any delivery errors are surfaced to the user, and all errors are logged for monitoring.

**How to test Resend integration:**

1. Trigger a signup, password reset, or email change in the app.
2. Check your inbox for a localized, branded email from WeddWeb.
3. If you do not receive the email, check the Edge Function logs and Resend dashboard for errors.

**Environment variables required:**

- `RESEND_API_KEY` (for the Edge Function)
- `SEND_EMAIL_HOOK_SECRET` (for webhook verification)
- `NEXT_PUBLIC_SITE_URL` (for correct redirect links)

**See also:**

- `src/2-features/auth/api/resendVerificationEmail.ts` (API logic)
- `supabase/functions/resend-auth-hook/index.ts` (Edge Function)
- `EMAIL_TRANSLATIONS` (email content)

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

## Font System Overview

The font system in this project is fully dynamic and multi-tenant aware:

- **Font Selection:** Each site (tenant) can select custom title and body fonts from a curated set of Google Fonts via the builder UI. Premium users can choose any available font; free users are limited to defaults.
- **Database Driven:** Font choices are saved per site in the database (`title_font`, `body_font` fields).
- **Dynamic CSS Variables:** On each tenant site, the selected fonts are injected as CSS variables (`--title-font`, `--body-font`) at the root of the page.
- **Tailwind Integration:** Tailwind v4 utilities (e.g. `font-sans`, `font-serif`) are mapped to these CSS variables using the `@theme` block in `globals.css`, so all typography utilities automatically use the correct fonts.
- **Consistent Theming:** Builder, marketing, and tenant themes all use the same variable-based system, ensuring font changes are reflected everywhere.
- **No Hardcoded Font-Family:** All font-family assignments in components and CSS reference the dynamic variables, never hardcoded font names.

**Result:** Changing a site's fonts in the builder instantly updates the entire site, including all Tailwind typography utilities, with no code changes or redeploys required.

---

With this test discipline, your SaaS is resilient, future-proof, and trusted by global users!  
Want a specific sample for any next roadmap item? Just ask.

---

## Sitemap Architecture & Use Cases

Wedding-Web uses a multi-level, SaaS-optimized sitemap structure to maximize SEO, discoverability, and scalability for both the main platform and all tenant (wedding) sites. Here’s how each sitemap works:

### 1. `sitemap.xml`

- **Location:** `/sitemap.xml` (served by `src/app/sitemap.xml/route.ts`)
- **Purpose:** Main entry point for all search engines. On the main domain (`weddweb.com`), returns a sitemap index referencing:
  - The marketing site sitemap (`/sitemap-marketing.xml`)
  - The tenant sitemap index (`/sitemap-tenants.xml`)
- **Custom Domains:** On a tenant’s custom domain (e.g., `alice-and-bob.com`), this route returns only that tenant’s sitemap (see below).

### 2. `sitemap-marketing.xml`

- **Location:** `/sitemap-marketing.xml`
- **Purpose:** Lists all public marketing and legal pages for the main SaaS platform (e.g., pricing, FAQ, legal, landing pages).
- **Audience:** Search engines crawling the main WeddWeb platform.

### 3. `sitemap-tenant.xml`

- **Location:** `/sitemap-tenant.xml` (served by `src/app/sitemap-tenant.xml/route.ts`)
- **Purpose:** Generates a sitemap for a single tenant (i.e., a single couple’s wedding website, usually on a custom domain or subdomain).
- **Use Case:** When a search engine requests `https://alice-and-bob.com/sitemap.xml`, this route returns only the URLs for that specific wedding site (pages, legal, etc.), not for the whole platform.
- **Audience:** Search engines crawling individual wedding sites (custom domains or subdomains).

### 4. `sitemap-tenants.xml`

- **Location:** `/sitemap-tenants.xml` (served by `src/app/sitemap-tenants.xml/route.ts`)
- **Purpose:** Generates a sitemap index listing all tenant sitemaps (i.e., all wedding sites hosted on WeddWeb).
- **Use Case:** When a search engine requests `https://weddweb.com/sitemap-tenants.xml`, it gets a list of all active tenant sitemaps (e.g., `https://alice-and-bob.com/sitemap.xml`, `https://carla-y-juan.weddweb.com/sitemap.xml`, etc.).
- **Audience:** Search engines crawling the main WeddWeb platform, so they can discover and index every wedding site hosted on the service.

---

### Summary Table

| Sitemap               | Route/Location         | Purpose/Use Case                                                                  |
| --------------------- | ---------------------- | --------------------------------------------------------------------------------- |
| sitemap.xml           | /sitemap.xml           | Main entry: index for marketing + tenants, or per-tenant sitemap on custom domain |
| sitemap-marketing.xml | /sitemap-marketing.xml | All public marketing/legal pages for SaaS                                         |
| sitemap-tenant.xml    | /sitemap-tenant.xml    | All pages for a single tenant (wedding site)                                      |
| sitemap-tenants.xml   | /sitemap-tenants.xml   | Index of all tenant sitemaps (all wedding sites)                                  |

---

**Best Practice:**
This two-level structure (index + per-tenant) is best practice for large SaaS/multisite platforms. It ensures:

- Search engines can discover every wedding site (via the index)
- Each wedding site is independently crawlable and SEO-optimized
- The main SaaS platform and all tenants are clearly separated for search and analytics

---

# 🕊️ Site Persistence & "Legacy Mode" Strategy

WeddWeb provides a "Permanent Home" for wedding memories. Unlike competitors who often delete sites after 12 months, WeddWeb keeps all sites online indefinitely. To balance infrastructure costs and provide a clear value proposition for the **Premium** upgrade, we implement a **Legacy Mode** logic.

---

## 1. Product Logic

- **Guest Experience:** All sites (Free & Premium) remain accessible to guests forever (as long as WeddWeb is active).
- **Free Plan:** Moves to **Legacy Mode (Read-Only)** after 6 months of user inactivity.
- **Premium Plan:** Remains **Fully Editable Forever** regardless of activity levels.

## 2. Technical Architecture

### Database Layer (Supabase/PostgreSQL)

Activity is tracked automatically at the database level via a centralized trigger system. This ensures the "Last Activity" date is always accurate, regardless of which part of the site is updated.

- **Storage Column:** `public.sites.last_activity_at` (TIMESTAMPTZ)
- **Automation:** The `sync_site_activity` function updates the timestamp whenever a row is modified in the following tables:
  - `site_translations` (User-generated text, names, stories)
  - `program_events` (Wedding schedule and dates)
  - `sites` (Font choices, SEO settings, Plan changes)
  - `wedding_gifts` (Registry and payment details)

### Logic Layer (Next.js / Server Side)

The `is_legacy_mode` status is calculated dynamically during the site fetch in `getSiteByDomain.ts`:

```typescript
const planType = data.plan_type || "free";
const lastActivity = data.last_activity_at ? new Date(data.last_activity_at) : new Date(data.created_at);

let isLegacyMode = false;

if (planType === "free") {
  const cutoffDate = new Date(lastActivity);
  cutoffDate.setMonth(cutoffDate.getMonth() + 6); // 180-day window
  isLegacyMode = new Date() > cutoffDate;
}

3. UI/UX Implementation
Guest-Facing Site: No change. The site remains fully visible.

Builder/Dashboard: - Detects is_legacy_mode: true.

Displays the Legacy Mode Banner at the top of the interface.

Disables "Save" and "Update" functionality.

Provides a direct CTA to upgrade to Premium to reactivate editing rights permanently.

4. Maintenance & Safety
To ensure existing users (pre-deployment) are not immediately locked out, we initialize the column with the current timestamp for all existing records:

SQL
UPDATE public.sites SET last_activity_at = now() WHERE last_activity_at IS NULL;
Last updated: April 2026
```

# 🛠️ Legacy Mode Automation (Email Notifications & 5-Month Inactivity Reminder)

## Objective

To improve user retention by automatically identifying users whose wedding websites have transitioned to Legacy Mode (triggered after 150 days/5 months of inactivity on the Free Plan). The system notifies them via email, encouraging them to log back in and reactivate their site before any data is permanently affected.

## System Architecture

The system uses a decoupled architecture to ensure high reliability and security:

1. **Database Cron (`pg_cron`):** A scheduled job runs daily at midnight (`0 0 * * *`). It manages the timing of the check to ensure users are notified exactly once when they hit the threshold.
2. **Database Function (`public.send_legacy_warnings`):**
   - Queries `public.sites` and `public.user_profiles` to identify Free Plan users.
   - Filters for accounts where `last_activity` was exactly 150 days ago.
   - Triggers an internal `POST` request to the Supabase Edge Function using the `net.http_post` extension.
3. **Edge Function (`legacy-notification`):**
   - **Auth:** Validates the request using a custom secret (`MY_CUSTOM_SERVICE_KEY`) to ensure only internal database triggers can execute the function.
   - **i18n:** Detects the user's preferred language and fetches the appropriate translation from `email-translations.ts`.
   - **Delivery:** Uses Resend to deliver a high-fidelity HTML email containing the user's name, wedding title, and their specific tenant subdomain link.

## Technical Stack

| Layer          | Technology                                                  |
| -------------- | ----------------------------------------------------------- |
| Trigger        | `pg_cron` extension in PostgreSQL                           |
| Logic Source   | `public.sites` & `public.user_profiles` tables              |
| Backend        | Supabase Edge Functions (Deno)                              |
| Email Provider | Resend (Verified Domain: `weddweb.com`)                     |
| Security       | Service Role JWT validation with custom environment secrets |

## Environment Variables & Secrets

To maintain this function, the following secrets must be set in the Supabase Vault via the CLI:

| Secret                  | Description                                                                          |
| ----------------------- | ------------------------------------------------------------------------------------ |
| `RESEND_API_KEY`        | API key from your Resend dashboard.                                                  |
| `MY_CUSTOM_SERVICE_KEY` | Your Supabase `service_role` key (manual entry to ensure actual JWT string is used). |

**Command to set secrets:**

```bash
npx supabase secrets set MY_CUSTOM_SERVICE_KEY=your_service_role_key
npx supabase secrets set RESEND_API_KEY=re_your_resend_key
```

## Local Development

To test the email flow without waiting for the scheduled cron job:

1. Add the secrets to your local `.env` file.
2. Run the function locally:

```bash
supabase functions serve legacy-notification
```

3. Invoke via the Supabase Dashboard Test sidebar (ensuring the `service_role` is selected) or via cURL:

```bash
curl -i --request POST 'http://localhost:54321/functions/v1/legacy-notification' \
  --header 'Authorization: Bearer YOUR_SERVICE_ROLE_KEY' \
  --header 'Content-Type: application/json' \
  --data '{"email":"test@example.com", "name":"User", "lang":"en", "wedding_title":"My Wedding", "subdomain":"test-site"}'
```

## Deployment

Deploy updates to the cloud using the following command:

```bash
npx supabase functions deploy legacy-notification --no-verify-jwt
```

> **Note:** The `--no-verify-jwt` flag is used because we handle the authorization logic manually within the function code for more robust key matching and to bypass placeholder issues.
