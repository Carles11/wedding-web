BEGIN;

WITH seed("key", en, zh, hi, es, ca, ar, fr, de, pt, ru, it) AS (
  VALUES
    ('builder.gift.error.method_limit',
      'Free plan supports up to {limit} gift method. Upgrade to add more.',
      '免费计划最多支持 {limit} 种礼金方式。升级以添加更多。',
      'फ्री प्लान में अधिकतम {limit} उपहार विधि समर्थित है। अधिक जोड़ने के लिए अपग्रेड करें।',
      'El plan gratuito admite hasta {limit} método de regalo. Mejora para añadir más.',
      'El pla gratuït admet fins a {limit} mètode de regal. Millora per afegir-ne més.',
      'تدعم الخطة المجانية ما يصل إلى {limit} طريقة هدية. قم بالترقية لإضافة المزيد.',
      'Le plan gratuit prend en charge jusqu''à {limit} méthode de cadeau. Passez à un niveau supérieur pour en ajouter plus.',
      'Der kostenlose Plan unterstützt bis zu {limit} Geschenkmethode. Upgrade, um mehr hinzuzufügen.',
      'O plano gratuito suporta até {limit} método de presente. Faça upgrade para adicionar mais.',
      'Бесплатный план поддерживает до {limit} способа подарка. Обновитесь, чтобы добавить больше.',
      'Il piano gratuito supporta fino a {limit} metodo regalo. Effettua l''upgrade per aggiungerne altri.'),

    ('builder.gift.limit_info',
      'Free plan supports up to {limit} gift method.',
      '免费计划最多支持 {limit} 种礼金方式。',
      'फ्री प्लान में अधिकतम {limit} उपहार विधि समर्थित है।',
      'El plan gratuito admite hasta {limit} método de regalo.',
      'El pla gratuït admet fins a {limit} mètode de regal.',
      'تدعم الخطة المجانية ما يصل إلى {limit} طريقة هدية.',
      'Le plan gratuit prend en charge jusqu''à {limit} méthode de cadeau.',
      'Der kostenlose Plan unterstützt bis zu {limit} Geschenkmethode.',
      'O plano gratuito suporta até {limit} método de presente.',
      'Бесплатный план поддерживает до {limit} способа подарка.',
      'Il piano gratuito supporta fino a {limit} metodo regalo.'),

    ('builder.gift.upgrade_title',
      'Unlock more gift methods',
      '解锁更多礼金方式',
      'अधिक उपहार विधियाँ अनलॉक करें',
      'Desbloquea más métodos de regalo',
      'Desbloqueja més mètodes de regal',
      'افتح المزيد من طرق الهدايا',
      'Débloquez plus de méthodes de cadeau',
      'Mehr Geschenkmethoden freischalten',
      'Desbloqueie mais métodos de presente',
      'Разблокируйте больше способов подарка',
      'Sblocca più metodi regalo'),

    ('builder.gift.upgrade_description',
      'Your current plan allows up to {limit} gift method. Upgrade to Premium to add multiple payment methods.',
      '您当前的计划最多允许 {limit} 种礼金方式。升级到高级版以添加多种支付方式。',
      'आपका वर्तमान प्लान अधिकतम {limit} उपहार विधि की अनुमति देता है। कई भुगतान विधियाँ जोड़ने के लिए प्रीमियम में अपग्रेड करें।',
      'Tu plan actual permite hasta {limit} método de regalo. Mejora a Premium para añadir múltiples métodos de pago.',
      'El teu pla actual permet fins a {limit} mètode de regal. Passa a Premium per afegir múltiples mètodes de pagament.',
      'تتيح خطتك الحالية ما يصل إلى {limit} طريقة هدية. قم بالترقية إلى المميز لإضافة طرق دفع متعددة.',
      'Votre plan actuel autorise jusqu''à {limit} méthode de cadeau. Passez à Premium pour ajouter plusieurs méthodes de paiement.',
      'Ihr aktueller Plan erlaubt bis zu {limit} Geschenkmethode. Upgrade auf Premium, um mehrere Zahlungsmethoden hinzuzufügen.',
      'O seu plano atual permite até {limit} método de presente. Faça upgrade para Premium para adicionar múltiplos métodos de pagamento.',
      'Ваш текущий план допускает до {limit} способа подарка. Обновитесь до Premium, чтобы добавить несколько способов оплаты.',
      'Il tuo piano attuale consente fino a {limit} metodo regalo. Effettua l''upgrade a Premium per aggiungere più metodi di pagamento.')
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
