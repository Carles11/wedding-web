-- Upsert for builder.account.upgrade_cta_title in all 11 supported languages for public.global_translations_builder
INSERT INTO public.global_translations_builder (key, locale, value, updated_at)
VALUES
  ('builder.account.upgrade_cta_title', 'en', 'Upgrade to Premium', NOW()),
  ('builder.account.upgrade_cta_title', 'zh', '升级到高级版', NOW()),
  ('builder.account.upgrade_cta_title', 'hi', 'प्रीमियम में अपग्रेड करें', NOW()),
  ('builder.account.upgrade_cta_title', 'es', 'Mejorar a Premium', NOW()),
  ('builder.account.upgrade_cta_title', 'ca', 'Actualitza a Premium', NOW()),
  ('builder.account.upgrade_cta_title', 'ar', 'الترقية إلى بريميوم', NOW()),
  ('builder.account.upgrade_cta_title', 'fr', 'Passer en Premium', NOW()),
  ('builder.account.upgrade_cta_title', 'de', 'Auf Premium upgraden', NOW()),
  ('builder.account.upgrade_cta_title', 'pt', 'Fazer upgrade para Premium', NOW()),
  ('builder.account.upgrade_cta_title', 'ru', 'Перейти на Premium', NOW()),
  ('builder.account.upgrade_cta_title', 'it', 'Passa a Premium', NOW())
ON CONFLICT (key, locale)
DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();
