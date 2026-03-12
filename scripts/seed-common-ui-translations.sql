-- Seeds common UI keys used across builder/auth pages.
-- Target table: global_translations_builder
-- Run this after seed-builder-onboarding-pricing-translations.sql

BEGIN;

WITH seed("key", en, zh, hi, es, ca, ar, fr, de, pt, ru, it) AS (
  VALUES
    ('error.something_went_wrong',
      'Something went wrong',
      '出了点问题',
      'कुछ गलत हो गया',
      'Algo salió mal',
      'Alguna cosa ha anat malament',
      'حدث خطأ ما',
      'Une erreur s''est produite',
      'Etwas ist schiefgelaufen',
      'Algo deu errado',
      'Что-то пошло не так',
      'Qualcosa è andato storto'),
    ('loading',
      'Loading...',
      '加载中...',
      'लोड हो रहा है...',
      'Cargando...',
      'Carregant...',
      'جارٍ التحميل...',
      'Chargement...',
      'Lädt...',
      'Carregando...',
      'Загрузка...',
      'Caricamento...')
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
