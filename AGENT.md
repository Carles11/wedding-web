# Copilot/AI Agent Brief: wedding-web SaaS

## Project Scope

- Multilingual, multi-tenant wedding/event platform.
- Built on Next.js, Supabase.
- All features are white-label; no hardcoded content/user logic.
- SEO-first, SSR default, FSD structure.

## Coding Standards

- TypeScript everywhere
- Feature-Sliced Design enforced (see FSD docs)
- All queries/components are tenant-aware: must include `site_id` or `customer_id`
- SEO metadata, hreflang, lang attribute for all public pages (see /agents/marketing.md)
- Only use libraries compatible with SSR and Expo/React Native

## Testing

- See /agents/testing.md for detailed rules

## Sub-agent Files

- See /agents/marketing.md, /agents/tenant.md, /agents/builder.md

## Languages

Supported languages: en, zh, hi, es, ca, ar, fr, de, pt, ru, it

## Enforce: No hardcoded content, emails, or 1-couple logic
