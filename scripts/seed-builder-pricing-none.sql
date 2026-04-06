-- Upsert for pricing.none in all 11 supported languages for public.global_translations_builder
INSERT INTO public.global_translations_builder (key, locale, value, updated_at)
VALUES
  ('pricing.none', 'en', 'None', NOW()),
  ('pricing.none', 'zh', '无', NOW()),
  ('pricing.none', 'hi', 'कोई नहीं', NOW()),
  ('pricing.none', 'es', 'Ninguno', NOW()),
  ('pricing.none', 'ca', 'Cap', NOW()),
  ('pricing.none', 'ar', 'لا يوجد', NOW()),
  ('pricing.none', 'fr', 'Aucun', NOW()),
  ('pricing.none', 'de', 'Keine', NOW()),
  ('pricing.none', 'pt', 'Nenhum', NOW()),
  ('pricing.none', 'ru', 'Нет', NOW()),
  ('pricing.none', 'it', 'Nessuno', NOW())
ON CONFLICT (key, locale)
DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();
