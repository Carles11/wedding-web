-- Seeds image step translation keys for the builder.
-- Target table: global_translations_builder

BEGIN;

WITH seed("key", en, zh, hi, es, ca, ar, fr, de, pt, ru, it) AS (
  VALUES
    ('builder.images.hint.contact_vertical_tip',
      'For best results, use a portrait (vertical) image.',
      '为了最佳效果，请使用竖向（纵向）图片。',
      'सर्वोत्तम परिणाम के लिए, एक पोर्ट्रेट (ऊर्ध्वाधर) छवि का उपयोग करें।',
      'Para mejores resultados, usa una imagen en vertical (retrato).',
      'Per obtenir millors resultats, fes servir una imatge vertical (retrat).',
      'للحصول على أفضل النتائج، استخدم صورة عمودية (بورتريه).',
      'Pour de meilleurs résultats, utilisez une image en portrait (verticale).',
      'Für beste Ergebnisse ein Hochformat-Bild (Porträt) verwenden.',
      'Para melhores resultados, use uma imagem no formato retrato (vertical).',
      'Для лучшего результата используйте вертикальное (портретное) изображение.',
      'Per risultati migliori, usa un''immagine in formato verticale (ritratto).')
),
expanded AS (
  SELECT "key", 'en'::text AS locale, en AS value FROM seed
  UNION ALL SELECT "key", 'zh', zh FROM seed
  UNION ALL SELECT "key", 'hi', hi FROM seed
  UNION ALL SELECT "key", 'es', es FROM seed
  UNION ALL SELECT "key", 'ca', ca FROM seed
  UNION ALL SELECT "key", 'ar', ar FROM seed
  UNION ALL SELECT "key", 'fr', fr FROM seed
  UNION ALL SELECT "key", 'de', de FROM seed
  UNION ALL SELECT "key", 'pt', pt FROM seed
  UNION ALL SELECT "key", 'ru', ru FROM seed
  UNION ALL SELECT "key", 'it', it FROM seed
)
INSERT INTO public.global_translations_builder ("key", locale, value)
SELECT "key", locale, value
FROM expanded
ON CONFLICT ("key", locale)
DO UPDATE SET value = EXCLUDED.value;

COMMIT;
