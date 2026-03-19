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
