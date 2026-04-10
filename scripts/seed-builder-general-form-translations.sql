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
      'Passa a Premium'),

    ('builder.general.form.label.default_language',
      'Default site language',
      '默认站点语言',
      'साइट की डिफ़ॉल्ट भाषा',
      'Idioma predeterminado del sitio',
      'Idioma predeterminat del lloc',
      'اللغة الافتراضية للموقع',
      'Langue par défaut du site',
      'Standardsprache der Website',
      'Idioma padrão do site',
      'Язык сайта по умолчанию',
      'Lingua predefinita del sito'),

    ('builder.general.form.default_language_help',
      'This is the main fallback language for your public site and the required language for builder content.',
      '这是您的公开站点的主要回退语言，也是构建器内容的必填语言。',
      'यह आपकी सार्वजनिक साइट की मुख्य फ़ॉलबैक भाषा है और बिल्डर सामग्री के लिए आवश्यक भाषा भी है।',
      'Este es el idioma principal de respaldo de tu sitio público y el idioma obligatorio para el contenido del editor.',
      'Aquest és l''idioma principal de reserva del teu lloc públic i l''idioma obligatori per al contingut de l''editor.',
      'هذه هي اللغة الاحتياطية الرئيسية لموقعك العام وهي اللغة المطلوبة لمحتوى المُنشئ.',
      'Il s''agit de la langue principale de secours de votre site public et de la langue requise pour le contenu de l''éditeur.',
      'Dies ist die wichtigste Ausweichsprache für Ihre öffentliche Website und die erforderliche Sprache für Builder-Inhalte.',
      'Este é o principal idioma de fallback do seu site público e o idioma obrigatório para o conteúdo do construtor.',
      'Это основной резервный язык вашего сайта и обязательный язык для содержимого конструктора.',
      'Questa è la lingua principale di fallback del tuo sito pubblico e la lingua richiesta per i contenuti del builder.'),

    ('builder.general.form.select_default_language',
      'Choose the default language',
      '选择默认语言',
      'डिफ़ॉल्ट भाषा चुनें',
      'Elige el idioma predeterminado',
      'Tria l''idioma predeterminat',
      'اختر اللغة الافتراضية',
      'Choisissez la langue par défaut',
      'Wählen Sie die Standardsprache',
      'Escolha o idioma padrão',
      'Выберите язык по умолчанию',
      'Scegli la lingua predefinita'),

    ('builder.general.form.default_language_required',
      'Please choose a default language from the selected site languages before saving.',
      '请在保存前从已选择的网站语言中选择一种默认语言。',
      'कृपया सहेजने से पहले चुनी गई साइट भाषाओं में से एक डिफ़ॉल्ट भाषा चुनें।',
      'Elige un idioma predeterminado entre los idiomas seleccionados del sitio antes de guardar.',
      'Tria un idioma predeterminat entre els idiomes seleccionats del lloc abans de desar.',
      'يرجى اختيار لغة افتراضية من بين لغات الموقع المحددة قبل الحفظ.',
      'Veuillez choisir une langue par défaut parmi les langues sélectionnées du site avant d''enregistrer.',
      'Bitte wählen Sie vor dem Speichern eine Standardsprache aus den ausgewählten Website-Sprachen aus.',
      'Escolha um idioma padrão entre os idiomas selecionados do site antes de salvar.',
      'Пожалуйста, выберите язык по умолчанию из выбранных языков сайта перед сохранением.',
      'Scegli una lingua predefinita tra le lingue selezionate del sito prima di salvare.'),

    ('builder.general.form.default_language_removed',
      'You removed the current default language. Please choose a new default language before saving.',
      '您已移除当前默认语言。请在保存前选择新的默认语言。',
      'आपने वर्तमान डिफ़ॉल्ट भाषा हटा दी है। कृपया सहेजने से पहले एक नई डिफ़ॉल्ट भाषा चुनें।',
      'Has eliminado el idioma predeterminado actual. Elige un nuevo idioma predeterminado antes de guardar.',
      'Has eliminat l''idioma predeterminat actual. Tria un nou idioma predeterminat abans de desar.',
      'لقد أزلت اللغة الافتراضية الحالية. يرجى اختيار لغة افتراضية جديدة قبل الحفظ.',
      'Vous avez supprimé la langue par défaut actuelle. Veuillez choisir une nouvelle langue par défaut avant d''enregistrer.',
      'Sie haben die aktuelle Standardsprache entfernt. Bitte wählen Sie vor dem Speichern eine neue Standardsprache aus.',
      'Você removeu o idioma padrão atual. Escolha um novo idioma padrão antes de salvar.',
      'Вы удалили текущий язык по умолчанию. Пожалуйста, выберите новый язык по умолчанию перед сохранением.',
      'Hai rimosso la lingua predefinita corrente. Scegli una nuova lingua predefinita prima di salvare.')
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
