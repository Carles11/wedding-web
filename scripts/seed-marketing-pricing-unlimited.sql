-- Upsert for pricing.unlimited in all 11 supported languages for public.global_translations_marketing
INSERT INTO public.global_translations_marketing (key, locale, value, updated_at)
VALUES
  ('pricing.unlimited', 'en', 'Unlimited', NOW()),
  ('pricing.unlimited', 'es', 'Ilimitado', NOW()),
  ('pricing.unlimited', 'ca', 'Il·limitat', NOW()),
  ('pricing.unlimited', 'zh', '无限', NOW()),
  ('pricing.unlimited', 'hi', 'असीमित', NOW()),
  ('pricing.unlimited', 'ar', 'غير محدود', NOW()),
  ('pricing.unlimited', 'fr', 'Illimité', NOW()),
  ('pricing.unlimited', 'de', 'Unbegrenzt', NOW()),
  ('pricing.unlimited', 'pt', 'Ilimitado', NOW()),
  ('pricing.unlimited', 'ru', 'Без ограничений', NOW()),
  ('pricing.unlimited', 'it', 'Illimitato', NOW())
ON CONFLICT (key, locale)
DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();
