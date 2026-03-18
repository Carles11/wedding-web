# Wedding-Web

**Multilingual, SaaS-ready wedding website platform.**  
Create beautiful, customizable event pages for any couple, in any language, with built-in SEO, data-driven structure, and multi-tenant architecture. Powered by Next.js and Supabase.

## Features

- Data-driven, scalable event websites
- Multi-language support (Spanish, Catalan, and more)
- Strict Feature-Sliced Design architecture
- SEO-first, SSR/SSG with Next.js 16+
- Multi-tenant: ready for many weddings/events
- Easy future expansion to mobile/native (Expo/React Native)
- Open-source & ready for white-label deployment

## Getting Started

_(Installation and setup instructions will appear here soon)_

---

This platform is designed for flexibility, scalability, and ease-of-use for everyone planning a celebration!

###########################################################################
###########################################################################
############ Internationalization (i18n) Architecture #####################
###########################################################################

## Internationalization (i18n) Architecture

Our SaaS platform supports robust, multilingual content for both tenant-facing sites and the builder/admin experience. Here’s an overview of how translations are managed, why we have multiple helpers, and which to use in each context.

### 1. Translation Sources

Translations are stored in Supabase and are **not hardcoded** in the frontend:

- **global_translations**:  
  Global, shared keys (UI labels, button text, program day names, timeline labels, etc.) valid for all tenants.
- **global_translations_builder**:  
  Global, builder/admin-specific translation keys for the back office/builder interface.
- **global_translations_marketing**:  
  Marketing/landing-page-specific translations for the public SaaS site—keeps marketing content management separate and DRY.
- **site_translations**:  
  Per-tenant (site) overrides of individual keys for specific UI or section content. These override global translations where specified.

### 2. Translation Fetchers

We use specialized helpers per context, optimized for SaaS, SSR, and DRY:

| Function                          | Use In                  | What It Returns                              | Use Case                                                     |
| --------------------------------- | ----------------------- | -------------------------------------------- | ------------------------------------------------------------ |
| `fetchGlobalTranslations`         | Any                     | Global translation keys only                 | System-wide UI (timeline labels, buttons, etc.)              |
| `fetchBuilderTranslations`        | Builder/Admin           | Builder-specific + global fallback           | Builder/admin interface, internal tools                      |
| `getMergedTranslations`           | Tenant/Public           | Merged: site-specific keys + global fallback | Any user-facing (tenant) page, section, public SSR/SSG route |
| `getMergedTranslationsWithGlobal` | (Rarely)                | Global keys (all), then overlay with site    | Only needed if your legacy helpers _don’t_ overlay global    |
| `fetchMarketingTranslations`      | Marketing/Landing Pages | Marketing-specific + global fallback         | Public SaaS landing, pricing, company marketing site         |

- **All helpers implement in-memory caching** with configurable TTL for performance in both dev and prod.
- **All fetchers support language fallback** (e.g., ca → en).

### 3. Merge Priority (How Translations Are Resolved)

When performing a lookup for a translation key, the following priority applies (**highest wins**):

1. **Site-specific translation** (from `site_translations`)
2. **Marketing-specific translation** (from `global_translations_marketing` for marketing pages)
3. **Global translation** (from `global_translations` or, in the builder, `global_translations_builder`)
4. **Fallback to lower-preference locales** (e.g., "en" if not present in "ca")
5. **Hardcoded key** (as an absolute fallback in dev/testing)

### 4. Recommended Patterns

#### Builder/Admin (Back Office)

Use:

```ts
import { fetchBuilderTranslations } from "@/4-shared/lib/builderTranslations";

const translations = await fetchBuilderTranslations(lang);
// Use: translations["builder.help_label"], etc.
```

- Ensures builder-only translations and universal UI keys are available.

#### Tenant/Public Site

Use:

```ts
import { getMergedTranslations } from "@/4-shared/lib/i18n";

const translations = await getMergedTranslations(siteId, lang, "en");
// Use: translations["program.day_before.label"], translations["button.save"], etc.
```

- Makes site-specific keys (if any) override the global defaults.

#### Marketing or Public SaaS Landing Pages

Use:

```ts
import { fetchMarketingTranslations } from "@/4-shared/api/marketing";

const translations = await fetchMarketingTranslations(lang, "en");
// Use: translations["marketing.hero.headline"], etc.
```

- Keeps marketing/landing content (including unique A/B tests or promotional copy) isolated from the main product and builder.
- If a translation is missing in the marketing table for a locale, the system auto-falls back to the corresponding global value (so labels are never blank).

#### Global UI Key Only (Rare Case)

Use:

```ts
import { fetchGlobalTranslations } from "@/4-shared/lib/globalTranslations";

const translations = await fetchGlobalTranslations(lang, "en");
// Use for system-wide universal UI keys if needed.
```

#### Full Merge (Global + Site)

Use:

```ts
import { getMergedTranslationsWithGlobal } from "@/4-shared/lib/i18n.extras";

const translations = await getMergedTranslationsWithGlobal(siteId, lang, "en");
// Use for absolute guarantee of all keys, with site overrides.
```

### 5. Why Multiple Helpers?

- **Performance**: Avoids unnecessary queries and allows for targeted, cache-efficient fetching in both public and admin/marketing contexts.
- **Separation of Concerns**: Each context (tenant, marketing, builder) can evolve and localize independently, without risk of leaking content, help text, or tests into the wrong UX.
- **Clarity**: Ensures that only the correct content is shown in each context, and maintains DRY global baselines as fallback.
- **Flexibility**: Allows global UI DRY translations, clean per-site overrides, builder/admin-only expansion, and marketing-only copy—each in their right place.

### 6. Adding or Overriding Translations

1. **Add global keys** to `global_translations` for new languages or UI features.
2. **Add builder/admin-only keys** to `global_translations_builder`.
3. **Add marketing/landing-page keys** to `global_translations_marketing` for marketing-specific copy and A/B tests.
4. **Override or add tenant/site-specific content/labels** in `site_translations` for per-customer customization.

### 7. Example Workflow

- Add a translation key (e.g. `program.wedding_day.label`) to the appropriate table (`global_translations`, `global_translations_builder`, or `global_translations_marketing`) in all needed languages.
- Optionally, override the key in `site_translations` for a specific tenant’s branding.
- On render, always use the fetcher appropriate for the context (see above table) for a complete translation dictionary.

---

**Summary**:  
This architecture ensures that all public-facing experiences—including tenant sites, the builder/admin, and SaaS landing/marketing pages—are fully multilingual, scalable, and performant, with single-source-of-truth, DRY translations and a clear, isolated override system.

###########################################################################
###########################################################################
########################## Feature Update Guide ###########################
###########################################################################
###########################################################################

## Plan Feature Update Guide

Plan features are now centralized and key-mapped. Do not treat them as simple index-only labels anymore.

### Source of Truth

Plan feature metadata is defined in:

- `src/4-shared/config/plans/planCatalog.ts`

Each feature has:

- `title`: fallback text used if no translation key resolves
- `titleTranslationKeys`: ordered list of possible keys to resolve from translations
- `marketingDescription`: fallback description
- `marketingDescriptionTranslationKey`: key for marketing description text

`src/4-shared/config/plans/planDefinitions.ts` simply exports `PLAN_CATALOG`, so all billing/feature logic reads from the same centralized source.

### How Rendering Works Now

The localization helpers are in:

- `src/4-shared/helpers/billing/entitlements.ts`

Resolution behavior:

1. **Feature titles** use `getLocalizedPlanFeatureTitles(planType, translations)`.
2. For each feature title, the helper checks `titleTranslationKeys` in order and uses the first available key.
3. If no key resolves, it falls back to the feature `title` in `planCatalog.ts`.
4. **Marketing feature cards** use `getLocalizedMarketingPlanFeatures(planType, translations)`.
5. Marketing descriptions resolve via `marketingDescriptionTranslationKey` and fallback to `marketingDescription` if missing.

Marketing page usage:

- `src/1-widgets/marketing/model/buildMarketingPageViewModel.ts`

### How To Update Features (Current Workflow)

When changing any Free/Premium feature title or description:

1. Update the feature object in `src/4-shared/config/plans/planCatalog.ts`.
2. Keep translation key mappings correct:

- For title: update `titleTranslationKeys` only if key mapping changes.
- For marketing description: update `marketingDescriptionTranslationKey` only if key mapping changes.

3. Update translation values in SQL for **all locales**:

- Builder/global plan title keys: `pricing.plan.free.feature_*`, `pricing.plan.premium.feature_*`
- Marketing description keys: `marketing.features.free_plan_feature_*_description`, `marketing.features.premium_plan_feature_*_description`

4. Run migration in Supabase:

- `MIGRATION-UPDATE-TRANSLATIONS-FIXED.sql`

5. Reload UI and verify both pricing lists and marketing feature cards.

### Verification Checklist

After running SQL:

1. Confirm feature titles in builder/pricing pages (Free and Premium).
2. Confirm marketing feature descriptions match the intended feature (no key mismatch).
3. Validate at least EN + ES + CA manually.
4. If values seem stale, wait for cache TTL (translation fetchers cache for a few minutes) and reload.

### Important Notes

- The feature display order comes from `planCatalog.ts`, but translation keys are explicit mappings; do not assume index alignment if you remap keys.
- Reordering features is safe only if key mappings are reviewed carefully.
- Prefer upsert-style SQL (`ON CONFLICT (key, locale) DO UPDATE`) for repeatable fixes.
