-- Upsert for pricing.title in all 11 supported languages for public.global_translations_marketing
INSERT INTO public.global_translations_marketing (key, locale, value, updated_at)
VALUES
  ('pricing.title', 'en', 'Plans & Pricing', NOW()),
  ('pricing.title', 'es', 'Planes y precios', NOW()),
  ('pricing.title', 'ca', 'Plans i preus', NOW()),
  ('pricing.title', 'zh', '套餐与价格', NOW()),
  ('pricing.title', 'hi', 'प्लान और मूल्य', NOW()),
  ('pricing.title', 'ar', 'الخطط والأسعار', NOW()),
  ('pricing.title', 'fr', 'Forfaits et tarifs', NOW()),
  ('pricing.title', 'de', 'Pläne & Preise', NOW()),
  ('pricing.title', 'pt', 'Planos e preços', NOW()),
  ('pricing.title', 'ru', 'Тарифы и цены', NOW()),
  ('pricing.title', 'it', 'Piani e prezzi', NOW())
ON CONFLICT (key, locale)
DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();
