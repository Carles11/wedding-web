BEGIN;

WITH seed("key", en, zh, hi, es, ca, ar, fr, de, pt, ru, it) AS (
  VALUES
    ('onboarding.welcome', 'Welcome to Your Wedding Website', '欢迎来到你的婚礼网站', 'आपकी शादी वेबसाइट में आपका स्वागत है', 'Bienvenido a tu web de boda', 'Benvingut al teu web de casament', 'مرحبًا بك في موقع زفافك', 'Bienvenue sur votre site de mariage', 'Willkommen auf deiner Hochzeitswebsite', 'Bem-vindo ao seu site de casamento', 'Добро пожаловать на ваш свадебный сайт', 'Benvenuto nel tuo sito di matrimonio'),
    ('onboarding.subtitle', 'Choose a plan that works for you. Start free and upgrade anytime as you add more features.', '选择适合你的套餐。先免费开始，后续可随时升级。', 'अपने लिए सही प्लान चुनें। फ्री से शुरू करें और जरूरत के साथ कभी भी अपग्रेड करें।', 'Elige un plan que se adapte a ti. Empieza gratis y mejora cuando lo necesites.', 'Tria un pla que s''adapti a tu. Comenca gratis i millora quan ho necessitis.', 'اختر الخطة المناسبة لك. ابدأ مجانًا ويمكنك الترقية في أي وقت.', 'Choisissez une offre adaptee. Commencez gratuitement et passez en premium a tout moment.', 'Waehle einen passenden Tarif. Starte kostenlos und upgrade jederzeit.', 'Escolha um plano ideal para voce. Comece gratis e faca upgrade quando quiser.', 'Выберите подходящий тариф. Начните бесплатно и обновляйтесь в любой момент.', 'Scegli un piano adatto a te. Inizia gratis e fai upgrade quando vuoi.'),
    ('onboarding.free_plan_note', 'Ready to start free?', '准备免费开始了吗？', 'फ्री में शुरू करने के लिए तैयार हैं?', 'Listo para empezar gratis?', 'Preparat per comencar gratis?', 'هل أنت جاهز للبدء مجانًا؟', 'Pret a commencer gratuitement ?', 'Bereit, kostenlos zu starten?', 'Pronto para comecar gratis?', 'Готовы начать бесплатно?', 'Pronto a iniziare gratis?'),
    ('onboarding.free_feature_1', 'Create your beautiful wedding website with your custom subdomain', '使用你的自定义子域名创建精美婚礼网站', 'अपने कस्टम सबडोमेन के साथ सुंदर शादी वेबसाइट बनाएं', 'Crea una bonita web de boda con tu subdominio personalizado', 'Crea un web de casament bonic amb el teu subdomini personalitzat', 'أنشئ موقع زفاف جميلًا باستخدام نطاق فرعي مخصص', 'Creez un beau site de mariage avec votre sous-domaine personnalise', 'Erstelle eine schoene Hochzeitswebsite mit deiner eigenen Subdomain', 'Crie um lindo site de casamento com seu subdominio personalizado', 'Создайте красивый свадебный сайт с вашим поддоменом', 'Crea un bellissimo sito di matrimonio con il tuo sottodominio personalizzato'),
    ('onboarding.free_feature_2', 'Upgrade to premium anytime to unlock more features', '随时升级到高级版以解锁更多功能', 'ज्यादा फीचर्स पाने के लिए कभी भी प्रीमियम में अपग्रेड करें', 'Mejora a premium cuando quieras para desbloquear mas funciones', 'Passa a premium quan vulguis per desbloquejar mes funcionalitats', 'قم بالترقية إلى المميز في أي وقت لفتح مزايا أكثر', 'Passez en premium a tout moment pour debloquer plus de fonctionnalites', 'Upgrade jederzeit auf Premium, um mehr Funktionen freizuschalten', 'Faca upgrade para premium quando quiser para liberar mais recursos', 'Обновляйтесь до premium в любой момент, чтобы открыть больше функций', 'Passa a premium quando vuoi per sbloccare piu funzionalita'),
    ('onboarding.free_feature_3', 'Add upgrade prompts at key moments when you need them', '在关键时刻展示升级提示', 'जरूरत के महत्वपूर्ण पलों में अपग्रेड सुझाव दिखाएं', 'Muestra avisos de mejora en momentos clave', 'Mostra avisos de millora en moments clau', 'اعرض رسائل الترقية في اللحظات المهمة', 'Affichez des invitations a upgrader aux moments cles', 'Zeige Upgrade-Hinweise in wichtigen Momenten', 'Mostre avisos de upgrade nos momentos-chave', 'Показывайте предложения апгрейда в ключевые моменты', 'Mostra suggerimenti di upgrade nei momenti chiave'),
    ('onboarding.start_free', 'Start with Free Plan ->', '使用免费套餐开始 ->', 'फ्री प्लान से शुरू करें ->', 'Empezar con plan gratis ->', 'Comencar amb pla gratis ->', 'ابدأ بالخطة المجانية ->', 'Commencer avec l''offre gratuite ->', 'Mit kostenlosem Plan starten ->', 'Comecar com plano gratuito ->', 'Начать с бесплатного плана ->', 'Inizia con piano gratuito ->'),

    ('pricing.free', 'Free', '免费', 'फ्री', 'Gratis', 'Gratis', 'مجاني', 'Gratuit', 'Kostenlos', 'Gratis', 'Бесплатно', 'Gratis'),
    ('pricing.for_couples', 'For couples', '适合情侣', 'कपल्स के लिए', 'Para parejas', 'Per a parelles', 'للازواج', 'Pour les couples', 'Fuer Paare', 'Para casais', 'Для пар', 'Per le coppie'),
    ('pricing.unlimited', 'Unlimited', '无限', 'असीमित', 'Ilimitado', 'Illimitat', 'غير محدود', 'Illimite', 'Unbegrenzt', 'Ilimitado', 'Безлимитно', 'Illimitato'),
    ('pricing.none', 'None', '无', 'कोई नहीं', 'Ninguno', 'Cap', 'لا يوجد', 'Aucun', 'Keine', 'Nenhum', 'Нет', 'Nessuno'),
    ('pricing.cta', 'Select', '选择', 'चुनें', 'Seleccionar', 'Seleccionar', 'اختيار', 'Selectionner', 'Auswaehlen', 'Selecionar', 'Выбрать', 'Seleziona'),
    ('pricing.most_popular', 'Most popular', '最受欢迎', 'सबसे लोकप्रिय', 'Mas popular', 'Mes popular', 'الاكثر شيوعًا', 'Le plus populaire', 'Am beliebtesten', 'Mais popular', 'Самый популярный', 'Piu popolare'),

    ('pricing.limit.images', 'Images', '图片', 'चित्र', 'Imagenes', 'Imatges', 'صور', 'Images', 'Bilder', 'Imagens', 'Изображения', 'Immagini'),
    ('pricing.limit.accommodations', 'Accommodations', '住宿', 'आवास', 'Alojamientos', 'Allotjaments', 'الاقامة', 'Hebergements', 'Unterkuenfte', 'Hospedagens', 'Проживание', 'Alloggi'),
    ('pricing.limit.events', 'Events', '活动', 'कार्यक्रम', 'Eventos', 'Esdeveniments', 'الفعاليات', 'Evenements', 'Events', 'Eventos', 'События', 'Eventi'),
    ('pricing.limit.whatToSee', 'Recommendations', '推荐', 'सिफारिशें', 'Recomendaciones', 'Recomanacions', 'التوصيات', 'Recommandations', 'Empfehlungen', 'Recomendacoes', 'Рекомендации', 'Raccomandazioni'),
    ('pricing.limit.languages', 'Languages', '语言', 'भाषाएं', 'Idiomas', 'Idiomes', 'اللغات', 'Langues', 'Sprachen', 'Idiomas', 'Языки', 'Lingue'),
    ('pricing.limit.customDomains', 'Custom domains', '自定义域名', 'कस्टम डोमेन', 'Dominios personalizados', 'Dominis personalitzats', 'نطاقات مخصصة', 'Domaines personnalises', 'Eigene Domains', 'Dominios personalizados', 'Пользовательские домены', 'Domini personalizzati'),

    ('pricing.plan.free.name', 'Free', '免费', 'फ्री', 'Gratis', 'Gratis', 'مجاني', 'Gratuit', 'Kostenlos', 'Gratis', 'Бесплатно', 'Gratis'),
    ('pricing.plan.free.feature_1', '1 website', '1个网站', '1 वेबसाइट', '1 sitio web', '1 web', 'موقع واحد', '1 site web', '1 Website', '1 site', '1 сайт', '1 sito web'),
    ('pricing.plan.free.feature_2', '2 accommodations', '2个住宿', '2 आवास', '2 alojamientos', '2 allotjaments', '2 وحدات اقامة', '2 hebergements', '2 Unterkuenfte', '2 hospedagens', '2 варианта проживания', '2 alloggi'),
    ('pricing.plan.free.feature_3', 'Unlimited events', '无限活动', 'असीमित कार्यक्रम', 'Eventos ilimitados', 'Esdeveniments il-limitats', 'فعاليات غير محدودة', 'Evenements illimites', 'Unbegrenzte Events', 'Eventos ilimitados', 'Неограниченные события', 'Eventi illimitati'),
    ('pricing.plan.free.feature_4', '2 recommendations (What to See)', '2条推荐（看什么）', '2 सिफारिशें', '2 recomendaciones', '2 recomanacions', '2 توصيتان', '2 recommandations', '2 Empfehlungen', '2 recomendacoes', '2 рекомендации', '2 raccomandazioni'),
    ('pricing.plan.free.feature_5', '1 language', '1种语言', '1 भाषा', '1 idioma', '1 idioma', 'لغة واحدة', '1 langue', '1 Sprache', '1 idioma', '1 язык', '1 lingua'),
    ('pricing.plan.free.feature_6', 'No custom domains', '不支持自定义域名', 'कस्टम डोमेन नहीं', 'Sin dominios personalizados', 'Sense dominis personalitzats', 'بدون نطاقات مخصصة', 'Pas de domaines personnalises', 'Keine eigenen Domains', 'Sem dominios personalizados', 'Без пользовательских доменов', 'Nessun dominio personalizzato'),
    ('pricing.plan.free.feature_7', 'Basic support', '基础支持', 'बुनियादी सहायता', 'Soporte basico', 'Suport basic', 'دعم اساسي', 'Support basique', 'Basis-Support', 'Suporte basico', 'Базовая поддержка', 'Supporto base'),
    ('pricing.plan.free.feature_8', 'Custom subdomain (your-names.weddweb.com)', '自定义子域名（your-names.weddweb.com）', 'कस्टम सबडोमेन (your-names.weddweb.com)', 'Subdominio personalizado (your-names.weddweb.com)', 'Subdomini personalitzat (your-names.weddweb.com)', 'نطاق فرعي مخصص (your-names.weddweb.com)', 'Sous-domaine personnalise (your-names.weddweb.com)', 'Eigene Subdomain (your-names.weddweb.com)', 'Subdominio personalizado (your-names.weddweb.com)', 'Пользовательский поддомен (your-names.weddweb.com)', 'Sottodominio personalizzato (your-names.weddweb.com)'),

    ('pricing.plan.premium.name', 'Premium', '高级版', 'प्रीमियम', 'Premium', 'Premium', 'مميز', 'Premium', 'Premium', 'Premium', 'Премиум', 'Premium'),
    ('pricing.plan.premium.feature_1', '1 website', '1个网站', '1 वेबसाइट', '1 sitio web', '1 web', 'موقع واحد', '1 site web', '1 Website', '1 site', '1 сайт', '1 sito web'),
    ('pricing.plan.premium.feature_2', 'Unlimited events', '无限活动', 'असीमित कार्यक्रम', 'Eventos ilimitados', 'Esdeveniments il-limitats', 'فعاليات غير محدودة', 'Evenements illimites', 'Unbegrenzte Events', 'Eventos ilimitados', 'Неограниченные события', 'Eventi illimitati'),
    ('pricing.plan.premium.feature_3', 'Priority support', '优先支持', 'प्राथमिक सहायता', 'Soporte prioritario', 'Suport prioritari', 'دعم اولوية', 'Support prioritaire', 'Prioritaets-Support', 'Suporte prioritario', 'Приоритетная поддержка', 'Supporto prioritario'),
    ('pricing.plan.premium.feature_4', 'Premium customization', '高级定制', 'प्रीमियम कस्टमाइजेशन', 'Personalizacion premium', 'Personalitzacio premium', 'تخصيص مميز', 'Personnalisation premium', 'Premium-Anpassung', 'Personalizacao premium', 'Премиум-настройка', 'Personalizzazione premium')
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
