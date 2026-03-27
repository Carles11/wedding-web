-- Upsert for pricing.summary in all 11 supported languages for public.global_translations_marketing
INSERT INTO public.global_translations_marketing (key, locale, value, updated_at)
VALUES
  ('pricing.summary', 'en', 'Create a beautiful wedding website and share your special day.', NOW()),
  ('pricing.summary', 'es', 'Crea una hermosa página web de boda y comparte tu día especial.', NOW()),
  ('pricing.summary', 'ca', 'Crea una bonica pàgina web de casament i comparteix el teu dia especial.', NOW()),
  ('pricing.summary', 'zh', '创建一个美丽的婚礼网站，分享你的特别日子。', NOW()),
  ('pricing.summary', 'hi', 'एक सुंदर वेडिंग वेबसाइट बनाएं और अपना खास दिन साझा करें।', NOW()),
  ('pricing.summary', 'ar', 'أنشئ موقع زفاف جميل وشارك يومك المميز.', NOW()),
  ('pricing.summary', 'fr', 'Créez un magnifique site de mariage et partagez votre journée spéciale.', NOW()),
  ('pricing.summary', 'de', 'Erstellen Sie eine schöne Hochzeitswebsite und teilen Sie Ihren besonderen Tag.', NOW()),
  ('pricing.summary', 'pt', 'Crie um lindo site de casamento e compartilhe seu dia especial.', NOW()),
  ('pricing.summary', 'ru', 'Создайте красивый свадебный сайт и поделитесь своим особенным днем.', NOW()),
  ('pricing.summary', 'it', 'Crea un bellissimo sito di matrimonio e condividi il tuo giorno speciale.', NOW())
ON CONFLICT (key, locale)
DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();
