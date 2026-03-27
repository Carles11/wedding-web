-- Upsert for pricing.fine_print in all 11 supported languages for public.global_translations_marketing
INSERT INTO public.global_translations_marketing (key, locale, value, updated_at)
VALUES
  ('pricing.fine_print', 'en', 'All prices include applicable taxes where required.', NOW()),
  ('pricing.fine_print', 'es', 'Todos los precios incluyen los impuestos aplicables donde sea necesario.', NOW()),
  ('pricing.fine_print', 'ca', 'Tots els preus inclouen els impostos aplicables quan sigui necessari.', NOW()),
  ('pricing.fine_print', 'zh', '所有价格均包含适用税费（如需）。', NOW()),
  ('pricing.fine_print', 'hi', 'सभी कीमतों में आवश्यकतानुसार लागू कर शामिल हैं।', NOW()),
  ('pricing.fine_print', 'ar', 'جميع الأسعار تشمل الضرائب المطبقة حيثما كان ذلك مطلوبًا.', NOW()),
  ('pricing.fine_print', 'fr', 'Tous les prix incluent les taxes applicables lorsque requis.', NOW()),
  ('pricing.fine_print', 'de', 'Alle Preise enthalten die erforderlichen Steuern, sofern zutreffend.', NOW()),
  ('pricing.fine_print', 'pt', 'Todos os preços incluem os impostos aplicáveis, quando exigido.', NOW()),
  ('pricing.fine_print', 'ru', 'Все цены включают применимые налоги, если это требуется.', NOW()),
  ('pricing.fine_print', 'it', 'Tutti i prezzi includono le tasse applicabili ove richiesto.', NOW())
ON CONFLICT (key, locale)
DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();
