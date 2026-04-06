-- Upsert for billing.none in all 11 supported languages for public.global_translations_builder
INSERT INTO public.global_translations_builder (key, locale, value, updated_at)
VALUES
  ('billing.none', 'en', 'None', NOW()),
  ('billing.none', 'zh', '无', NOW()),
  ('billing.none', 'hi', 'कोई नहीं', NOW()),
  ('billing.none', 'es', 'Ninguno', NOW()),
  ('billing.none', 'ca', 'Cap', NOW()),
  ('billing.none', 'ar', 'لا يوجد', NOW()),
  ('billing.none', 'fr', 'Aucun', NOW()),
  ('billing.none', 'de', 'Keine', NOW()),
  ('billing.none', 'pt', 'Nenhum', NOW()),
  ('billing.none', 'ru', 'Нет', NOW()),
  ('billing.none', 'it', 'Nessuno', NOW())
ON CONFLICT (key, locale)
DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();
