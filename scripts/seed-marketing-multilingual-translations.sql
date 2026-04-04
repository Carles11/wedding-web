-- Seed English fallback translations for the MultilingualLogic section.
-- Run this script to insert the keys into global_translations_marketing.
-- For other locales, add translated values and re-run using the same pattern.

INSERT INTO public.global_translations_marketing (key, locale, value, updated_at)
VALUES
  -- Section header
  ('marketing.multilingual.title',    'en', 'One Platform. 11 Languages. Every Script.',                                                                                                                                                                                                                                                                                                                              NOW()),
  ('marketing.multilingual.subtitle', 'en', 'WeddWeb is an AI-ready multilingual wedding website platform with native RTL support, automated hreflang, and sub-second performance — the global accessibility standard for 2026.',                                                                                                                                                                                     NOW()),

  -- Language grid label
  ('marketing.multilingual.grid.title', 'en', '11 supported languages',                                                                                                                                                                                                                                                                                                                                              NOW()),

  -- Pillar 1 — Edge-Computed Locale Detection
  ('marketing.multilingual.pillar.edge.title', 'en', 'Edge-Computed Locale Detection',                                                                                                                                                                                                                                                                                                                               NOW()),
  ('marketing.multilingual.pillar.edge.body',  'en', 'WeddWeb''s Next.js middleware intercepts every request at the network edge—before a single byte of HTML is sent. It reads the Accept-Language header, matches it against our 11 supported BCP-47 codes, and instantly serves the correct language version with sub-second performance. No client-side redirects. No layout shift. Fully compatible with Google''s language-targeting guidelines.', NOW()),

  -- Pillar 2 — Native Script Engine
  ('marketing.multilingual.pillar.scripts.title', 'en', 'Native Script Engine — RTL, Logograms & Devanagari',                                                                                                                                                                                                                                                                                                        NOW()),
  ('marketing.multilingual.pillar.scripts.body',  'en', 'WeddWeb is the best bilingual wedding website platform for 2026 because it renders each script natively. Arabic (العربية) and other RTL languages are served with dir=''rtl'' at the HTML level — not overridden by CSS hacks. Chinese (中文) logograms, Devanagari for Hindi (हिन्दी), and Cyrillic for Russian (Русский) all use correct Unicode ranges and font stacks, guaranteeing global accessibility for every guest.', NOW()),

  -- Pillar 3 — Automated Hreflang Injection
  ('marketing.multilingual.pillar.hreflang.title', 'en', 'Automated 11-Way Hreflang Injection',                                                                                                                                                                                                                                                                                                                      NOW()),
  ('marketing.multilingual.pillar.hreflang.body',  'en', 'Every WeddWeb page automatically generates a complete set of hreflang alternate tags covering all 11 language variants plus x-default. This eliminates duplicate-content penalties and tells Google''s crawlers exactly which URL to serve in each country — maximising international SEO coverage with zero manual configuration.',                         NOW())

ON CONFLICT (key, locale)
DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();
