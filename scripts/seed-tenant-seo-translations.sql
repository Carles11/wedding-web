BEGIN;

WITH seed("key", en, zh, hi, es, ca, ar, fr, de, pt, ru, it) AS (
  VALUES
    ('seo.not_found.title',
      'Wedding Event Not Found',
      '未找到婚礼活动',
      'विवाह समारोह नहीं मिला',
      'Evento de boda no encontrado',
      'Esdeveniment de casament no trobat',
      'لم يتم العثور على حفل الزفاف',
      'Événement de mariage introuvable',
      'Hochzeitsveranstaltung nicht gefunden',
      'Evento de casamento não encontrado',
      'Свадебное мероприятие не найдено',
      'Evento di matrimonio non trovato'),

    ('seo.not_found.description',
      'This wedding website is not available.',
      '此婚礼网站不可用。',
      'यह विवाह वेबसाइट उपलब्ध नहीं है।',
      'Este sitio web de boda no está disponible.',
      'Aquest lloc web de casament no està disponible.',
      'موقع الزفاف هذا غير متاح.',
      'Ce site de mariage n''est pas disponible.',
      'Diese Hochzeitswebsite ist nicht verfügbar.',
      'Este site de casamento não está disponível.',
      'Этот свадебный сайт недоступен.',
      'Questo sito di matrimonio non è disponibile.')
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
INSERT INTO public.global_translations ("key", locale, value)
SELECT "key", locale, value
FROM expanded
ON CONFLICT ("key", locale)
DO UPDATE SET value = EXCLUDED.value;

COMMIT;
