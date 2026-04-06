-- Seeds builder general form modal keys (language upgrade modal only)
-- Target table: global_translations_builder
-- Run after seed-builder-onboarding-pricing-translations.sql

BEGIN;

WITH seed("key", en, zh, hi, es, ca, ar, fr, de, pt, ru, it) AS (
  VALUES
    ('builder.general.form.need_more_langs',
      'Need more languages?',
      '需要更多语言？',
      'अधिक भाषाएं चाहिए?',
      '¿Necesitas más idiomas?',
      'Necessites més idiomes?',
      'هل تحتاج إلى مزيد من اللغات؟',
      'Besoin de plus de langues ?',
      'Mehr Sprachen benötigt?',
      'Precisa de mais idiomas?',
      'Нужно больше языков?',
      'Hai bisogno di più lingue?'),

    ('builder.general.form.upgrade_description',
      'Your current plan only allows one language. Upgrade to Premium to unlock all languages for your wedding site.',
      '您当前的套餐仅允许一种语言。升级到高级版以为您的婚礼网站解锁所有语言。',
      'आपकी वर्तमान योजना केवल एक भाषा की अनुमति देती है। अपनी शादी की वेबसाइट के लिए सभी भाषाओं को अनलॉक करने के लिए प्रीमियम में अपग्रेड करें।',
      'Tu plan actual solo permite un idioma. Mejora a Premium para desbloquear todos los idiomas en tu web de boda.',
      'El teu pla actual només permet un idioma. Millora a Premium per desbloquejar tots els idiomes del teu web de casament.',
      'تتيح خطتك الحالية لغة واحدة فقط. قم بالترقية إلى المميز لفتح جميع اللغات لموقع زفافك.',
      'Votre offre actuelle ne permet qu''une seule langue. Passez en Premium pour débloquer toutes les langues de votre site de mariage.',
      'Ihr aktueller Plan erlaubt nur eine Sprache. Upgrade auf Premium, um alle Sprachen für Ihre Hochzeitswebsite freizuschalten.',
      'Seu plano atual permite apenas um idioma. Faça upgrade para Premium para desbloquear todos os idiomas do seu site de casamento.',
      'Ваш текущий план позволяет только один язык. Обновитесь до Premium, чтобы разблокировать все языки для вашего свадебного сайта.',
      'Il tuo piano attuale consente una sola lingua. Passa a Premium per sbloccare tutte le lingue del tuo sito di matrimonio.'),

    ('builder.general.form.cancel',
      'Cancel',
      '取消',
      'रद्द करें',
      'Cancelar',
      'Cancel·lar',
      'إلغاء',
      'Annuler',
      'Abbrechen',
      'Cancelar',
      'Отмена',
      'Annulla'),

    ('builder.general.form.upgrade',
      'Upgrade to Premium',
      '升级到高级版',
      'प्रीमियम में अपग्रेड करें',
      'Mejorar a Premium',
      'Millorar a Premium',
      'الترقية إلى المميز',
      'Passer en Premium',
      'Auf Premium upgraden',
      'Fazer upgrade para Premium',
      'Перейти на Premium',
      'Passa a Premium')
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
