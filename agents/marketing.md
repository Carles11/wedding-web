# Agent: Marketing & SEO

## Purpose

Guidance for language, conversion, SEO, branding, and public-facing content features for the wedding-web SaaS.

## Rules

- All marketing content must be fully data-driven and multilingual, with translations for all supported languages.
- Always use semantic HTML (correct heading levels, aria attributes, alt text).
- Use Next.js SEO best practices: fill all metadata fields (title, description, OG/image, twitter, etc) per page/language.
- Add `lang` attribute and render corresponding `<link rel="alternate" hreflang="...">` for all public pages.
- Do not hardcode couple names, event names, or language-specific content; fetch from database via tenant contex.
- Never embed email addresses, CTA copy, or domain names—use settings or translations only.
- All static content—hero, program, RSVP, gallery, FAQ, etc.—should resolve dynamically using tenant+locale aware queries.
- Optimize for Core Web Vitals and social sharing.
- Default all pages to `index,follow` in robots meta unless SEO configs dictate otherwise.

## See also

- `/AGENT.md`
- `/agents/tenant.md` for tenant isolation rules.
