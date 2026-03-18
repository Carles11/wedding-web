-- ============================================================================
-- MIGRATION: Update Plan Features and Translations
-- ============================================================================
-- This migration rebalances the plan features and updates translation keys
-- Table structure: global_translations_builder(key, locale, value)

-- ============================================================================
-- PART 1: UPDATE PREMIUM FEATURE TITLES IN global_translations_builder
-- ============================================================================

-- Update premium.feature_1 from "1 website" to "Unlimited websites + custom domain"
UPDATE global_translations_builder SET value = 'Unlimited websites + custom domain' WHERE key = 'pricing.plan.premium.feature_1' AND locale = 'en';
UPDATE global_translations_builder SET value = '无限网站+自定义域名' WHERE key = 'pricing.plan.premium.feature_1' AND locale = 'zh';
UPDATE global_translations_builder SET value = 'असीमित वेबसाइटें + कस्टम डोमेन' WHERE key = 'pricing.plan.premium.feature_1' AND locale = 'hi';
UPDATE global_translations_builder SET value = 'Sitios web ilimitados + dominio personalizado' WHERE key = 'pricing.plan.premium.feature_1' AND locale = 'es';
UPDATE global_translations_builder SET value = 'Webs il·limitades + domini personalitzat' WHERE key = 'pricing.plan.premium.feature_1' AND locale = 'ca';
UPDATE global_translations_builder SET value = 'مواقع ويب غير محدودة + نطاق مخصص' WHERE key = 'pricing.plan.premium.feature_1' AND locale = 'ar';
UPDATE global_translations_builder SET value = 'Sites web illimités + domaine personnalisé' WHERE key = 'pricing.plan.premium.feature_1' AND locale = 'fr';
UPDATE global_translations_builder SET value = 'Unbegrenzte Websites + benutzerdefinierte Domain' WHERE key = 'pricing.plan.premium.feature_1' AND locale = 'de';
UPDATE global_translations_builder SET value = 'Websites ilimitados + domínio personalizado' WHERE key = 'pricing.plan.premium.feature_1' AND locale = 'pt';
UPDATE global_translations_builder SET value = 'Неограниченные веб-сайты + пользовательский домен' WHERE key = 'pricing.plan.premium.feature_1' AND locale = 'ru';
UPDATE global_translations_builder SET value = 'Siti web illimitati + dominio personalizzato' WHERE key = 'pricing.plan.premium.feature_1' AND locale = 'it';

-- Update premium.feature_2 from "Unlimited events" to "Unlimited languages"
UPDATE global_translations_builder SET value = 'Unlimited languages' WHERE key = 'pricing.plan.premium.feature_2' AND locale = 'en';
UPDATE global_translations_builder SET value = '无限语言' WHERE key = 'pricing.plan.premium.feature_2' AND locale = 'zh';
UPDATE global_translations_builder SET value = 'असीमित भाषाएँ' WHERE key = 'pricing.plan.premium.feature_2' AND locale = 'hi';
UPDATE global_translations_builder SET value = 'Idiomas ilimitados' WHERE key = 'pricing.plan.premium.feature_2' AND locale = 'es';
UPDATE global_translations_builder SET value = 'Idiomes il·limitats' WHERE key = 'pricing.plan.premium.feature_2' AND locale = 'ca';
UPDATE global_translations_builder SET value = 'لغات غير محدودة' WHERE key = 'pricing.plan.premium.feature_2' AND locale = 'ar';
UPDATE global_translations_builder SET value = 'Langues illimitées' WHERE key = 'pricing.plan.premium.feature_2' AND locale = 'fr';
UPDATE global_translations_builder SET value = 'Unbegrenzte Sprachen' WHERE key = 'pricing.plan.premium.feature_2' AND locale = 'de';
UPDATE global_translations_builder SET value = 'Idiomas ilimitados' WHERE key = 'pricing.plan.premium.feature_2' AND locale = 'pt';
UPDATE global_translations_builder SET value = 'Неограниченные языки' WHERE key = 'pricing.plan.premium.feature_2' AND locale = 'ru';
UPDATE global_translations_builder SET value = 'Lingue illimitate' WHERE key = 'pricing.plan.premium.feature_2' AND locale = 'it';

-- Update premium.feature_4 from "Premium customization" to "Unlimited content"
UPDATE global_translations_builder SET value = 'Unlimited content' WHERE key = 'pricing.plan.premium.feature_4' AND locale = 'en';
UPDATE global_translations_builder SET value = '无限内容' WHERE key = 'pricing.plan.premium.feature_4' AND locale = 'zh';
UPDATE global_translations_builder SET value = 'असीमित सामग्री' WHERE key = 'pricing.plan.premium.feature_4' AND locale = 'hi';
UPDATE global_translations_builder SET value = 'Contenido ilimitado' WHERE key = 'pricing.plan.premium.feature_4' AND locale = 'es';
UPDATE global_translations_builder SET value = 'Contingut il·limitat' WHERE key = 'pricing.plan.premium.feature_4' AND locale = 'ca';
UPDATE global_translations_builder SET value = 'محتوى غير محدود' WHERE key = 'pricing.plan.premium.feature_4' AND locale = 'ar';
UPDATE global_translations_builder SET value = 'Contenu illimité' WHERE key = 'pricing.plan.premium.feature_4' AND locale = 'fr';
UPDATE global_translations_builder SET value = 'Unbegrenzter Inhalt' WHERE key = 'pricing.plan.premium.feature_4' AND locale = 'de';
UPDATE global_translations_builder SET value = 'Conteúdo ilimitado' WHERE key = 'pricing.plan.premium.feature_4' AND locale = 'pt';
UPDATE global_translations_builder SET value = 'Неограниченный контент' WHERE key = 'pricing.plan.premium.feature_4' AND locale = 'ru';
UPDATE global_translations_builder SET value = 'Contenuto illimitato' WHERE key = 'pricing.plan.premium.feature_4' AND locale = 'it';

-- INSERT premium.feature_5 "Advanced gift registry"
INSERT INTO global_translations_builder (key, locale, value) VALUES ('pricing.plan.premium.feature_5', 'en', 'Advanced gift registry') ON CONFLICT DO NOTHING;
INSERT INTO global_translations_builder (key, locale, value) VALUES ('pricing.plan.premium.feature_5', 'zh', '高级礼物登记册') ON CONFLICT DO NOTHING;
INSERT INTO global_translations_builder (key, locale, value) VALUES ('pricing.plan.premium.feature_5', 'hi', 'उन्नत उपहार रजिस्ट्री') ON CONFLICT DO NOTHING;
INSERT INTO global_translations_builder (key, locale, value) VALUES ('pricing.plan.premium.feature_5', 'es', 'Registro de regalos avanzado') ON CONFLICT DO NOTHING;
INSERT INTO global_translations_builder (key, locale, value) VALUES ('pricing.plan.premium.feature_5', 'ca', 'Registre de regalos avançat') ON CONFLICT DO NOTHING;
INSERT INTO global_translations_builder (key, locale, value) VALUES ('pricing.plan.premium.feature_5', 'ar', 'سجل الهدايا المتقدم') ON CONFLICT DO NOTHING;
INSERT INTO global_translations_builder (key, locale, value) VALUES ('pricing.plan.premium.feature_5', 'fr', 'Registre de cadeaux avancé') ON CONFLICT DO NOTHING;
INSERT INTO global_translations_builder (key, locale, value) VALUES ('pricing.plan.premium.feature_5', 'de', 'Erweitertes Geschenkregister') ON CONFLICT DO NOTHING;
INSERT INTO global_translations_builder (key, locale, value) VALUES ('pricing.plan.premium.feature_5', 'pt', 'Registro de presentes avançado') ON CONFLICT DO NOTHING;
INSERT INTO global_translations_builder (key, locale, value) VALUES ('pricing.plan.premium.feature_5', 'ru', 'Продвинутый реестр подарков') ON CONFLICT DO NOTHING;
INSERT INTO global_translations_builder (key, locale, value) VALUES ('pricing.plan.premium.feature_5', 'it', 'Registro regali avanzato') ON CONFLICT DO NOTHING;

-- ============================================================================
-- PART 2: DELETE UNUSED FREE FEATURE KEYS FROM global_translations_builder
-- ============================================================================
DELETE FROM global_translations_builder WHERE key = 'pricing.plan.free.feature_3';
DELETE FROM global_translations_builder WHERE key = 'pricing.plan.free.feature_4';
DELETE FROM global_translations_builder WHERE key = 'pricing.plan.free.feature_6';

-- ============================================================================
-- PART 3: ADD MARKETING DESCRIPTION KEYS (global_translations_marketing)
-- ============================================================================

-- FREE PLAN DESCRIPTIONS
INSERT INTO global_translations_marketing (key, locale, value) VALUES 
('marketing.features.free_plan_feature_1_description', 'en', 'Your site lives at yourname.weddweb.com'),
('marketing.features.free_plan_feature_1_description', 'zh', '您的网站位于 yourname.weddweb.com'),
('marketing.features.free_plan_feature_1_description', 'hi', 'आपकी साइट yourname.weddweb.com पर रहती है'),
('marketing.features.free_plan_feature_1_description', 'es', 'Tu sitio está en yourname.weddweb.com'),
('marketing.features.free_plan_feature_1_description', 'ca', 'El teu web està a yourname.weddweb.com'),
('marketing.features.free_plan_feature_1_description', 'ar', 'موقعك يعيش على yourname.weddweb.com'),
('marketing.features.free_plan_feature_1_description', 'fr', 'Votre site vit sur yourname.weddweb.com'),
('marketing.features.free_plan_feature_1_description', 'de', 'Deine Website lebt auf yourname.weddweb.com'),
('marketing.features.free_plan_feature_1_description', 'pt', 'Seu site fica em yourname.weddweb.com'),
('marketing.features.free_plan_feature_1_description', 'ru', 'Ваш сайт находится на yourname.weddweb.com'),
('marketing.features.free_plan_feature_1_description', 'it', 'Il tuo sito vive su yourname.weddweb.com')
ON CONFLICT DO NOTHING;

INSERT INTO global_translations_marketing (key, locale, value) VALUES 
('marketing.features.free_plan_feature_2_description', 'en', 'Share your site in one language of your choice'),
('marketing.features.free_plan_feature_2_description', 'zh', '用您选择的一种语言分享您的网站'),
('marketing.features.free_plan_feature_2_description', 'hi', 'अपनी पसंद की एक भाषा में अपनी साइट साझा करें'),
('marketing.features.free_plan_feature_2_description', 'es', 'Comparte tu sitio en un idioma de tu elección'),
('marketing.features.free_plan_feature_2_description', 'ca', 'Comparteix el teu web amb un idioma de la teva elecció'),
('marketing.features.free_plan_feature_2_description', 'ar', 'شارك موقعك بلغة واحدة من اختيارك'),
('marketing.features.free_plan_feature_2_description', 'fr', 'Partagez votre site dans une langue de votre choix'),
('marketing.features.free_plan_feature_2_description', 'de', 'Teilen Sie Ihre Website in einer Sprache Ihrer Wahl'),
('marketing.features.free_plan_feature_2_description', 'pt', 'Compartilhe seu site em um idioma de sua escolha'),
('marketing.features.free_plan_feature_2_description', 'ru', 'Поделитесь своим сайтом на одном языке по вашему выбору'),
('marketing.features.free_plan_feature_2_description', 'it', 'Condividi il tuo sito in una lingua a tua scelta')
ON CONFLICT DO NOTHING;

INSERT INTO global_translations_marketing (key, locale, value) VALUES 
('marketing.features.free_plan_feature_3_description', 'en', 'Help guests find nearby places to stay'),
('marketing.features.free_plan_feature_3_description', 'zh', '帮助客人找到附近的住宿地点'),
('marketing.features.free_plan_feature_3_description', 'hi', 'अतिथि को पास के रहने के स्थान खोजने में मदद करें'),
('marketing.features.free_plan_feature_3_description', 'es', 'Ayuda a los huéspedes a encontrar alojamiento cercano'),
('marketing.features.free_plan_feature_3_description', 'ca', 'Ajuda els convidats a trobar allotjament a la vora'),
('marketing.features.free_plan_feature_3_description', 'ar', 'ساعد الضيوف في العثور على أماكن إقامة قريبة'),
('marketing.features.free_plan_feature_3_description', 'fr', 'Aidez les invités à trouver un hébergement à proximité'),
('marketing.features.free_plan_feature_3_description', 'de', 'Helfen Sie Gästen, in der Nähe gelegene Unterkünfte zu finden'),
('marketing.features.free_plan_feature_3_description', 'pt', 'Ajude os convidados a encontrar hospedagem próxima'),
('marketing.features.free_plan_feature_3_description', 'ru', 'Помогите гостям найти ближайшие места проживания'),
('marketing.features.free_plan_feature_3_description', 'it', 'Aiuta gli ospiti a trovare alloggi nelle vicinanze')
ON CONFLICT DO NOTHING;

INSERT INTO global_translations_marketing (key, locale, value) VALUES 
('marketing.features.free_plan_feature_4_description', 'en', 'Choose a personalized subdomain for your site'),
('marketing.features.free_plan_feature_4_description', 'zh', '为您的网站选择个性化的子域名'),
('marketing.features.free_plan_feature_4_description', 'hi', 'अपनी साइट के लिए एक व्यक्तिगत सबडोमेन चुनें'),
('marketing.features.free_plan_feature_4_description', 'es', 'Elige un subdominio personalizado para tu sitio'),
('marketing.features.free_plan_feature_4_description', 'ca', 'Tria un subdomini personalitzat per al teu web'),
('marketing.features.free_plan_feature_4_description', 'ar', 'اختر نطاق فرعي مخصص لموقعك'),
('marketing.features.free_plan_feature_4_description', 'fr', 'Choisissez un sous-domaine personnalisé pour votre site'),
('marketing.features.free_plan_feature_4_description', 'de', 'Wählen Sie eine personalisierte Subdomain für Ihre Website'),
('marketing.features.free_plan_feature_4_description', 'pt', 'Escolha um subdomínio personalizado para seu site'),
('marketing.features.free_plan_feature_4_description', 'ru', 'Выберите персональный поддомен для вашего сайта'),
('marketing.features.free_plan_feature_4_description', 'it', 'Scegli un sottodominio personalizzato per il tuo sito')
ON CONFLICT DO NOTHING;

INSERT INTO global_translations_marketing (key, locale, value) VALUES 
('marketing.features.free_plan_feature_5_description', 'en', 'Get help by email when you need it'),
('marketing.features.free_plan_feature_5_description', 'zh', '在需要时通过电子邮件获得帮助'),
('marketing.features.free_plan_feature_5_description', 'hi', 'जब आपको जरूरत हो तो ईमेल से सहायता प्राप्त करें'),
('marketing.features.free_plan_feature_5_description', 'es', 'Obtén ayuda por correo electrónico cuando la necesites'),
('marketing.features.free_plan_feature_5_description', 'ca', 'Obtén ajuda per correu electrònic quan la necessitis'),
('marketing.features.free_plan_feature_5_description', 'ar', 'احصل على مساعدة عبر البريد الإلكتروني عند الحاجة'),
('marketing.features.free_plan_feature_5_description', 'fr', 'Obtenez de l''aide par e-mail quand vous en avez besoin'),
('marketing.features.free_plan_feature_5_description', 'de', 'Erhalten Sie per E-Mail Hilfe, wenn Sie sie benötigen'),
('marketing.features.free_plan_feature_5_description', 'pt', 'Obtenha ajuda por e-mail quando precisar'),
('marketing.features.free_plan_feature_5_description', 'ru', 'Получите помощь по электронной почте, когда вам нужно'),
('marketing.features.free_plan_feature_5_description', 'it', 'Ottieni aiuto tramite e-mail quando ne hai bisogno')
ON CONFLICT DO NOTHING;

-- PREMIUM PLAN DESCRIPTIONS
-- Feature 1: Unlimited websites + custom domain
INSERT INTO global_translations_marketing (key, locale, value) VALUES 
('marketing.features.premium_plan_feature_1_description', 'en', 'Use your own domain for a fully branded experience'),
('marketing.features.premium_plan_feature_1_description', 'zh', '使用您自己的域名获得完整的品牌体验'),
('marketing.features.premium_plan_feature_1_description', 'hi', 'पूर्ण ब्रांडेड अनुभव के लिए अपना स्वयं का डोमेन उपयोग करें'),
('marketing.features.premium_plan_feature_1_description', 'es', 'Usa tu propio dominio para una experiencia completamente personalizada'),
('marketing.features.premium_plan_feature_1_description', 'ca', 'Usa el teu propi domini per a una experiència totalment marcada'),
('marketing.features.premium_plan_feature_1_description', 'ar', 'استخدم نطاقك الخاص للحصول على تجربة بعلامة تجارية كاملة'),
('marketing.features.premium_plan_feature_1_description', 'fr', 'Utilisez votre propre domaine pour une expérience complètement marquée'),
('marketing.features.premium_plan_feature_1_description', 'de', 'Verwenden Sie Ihre eigene Domain für ein vollständig markengerechtes Erlebnis'),
('marketing.features.premium_plan_feature_1_description', 'pt', 'Use seu próprio domínio para uma experiência totalmente marcada'),
('marketing.features.premium_plan_feature_1_description', 'ru', 'Используйте собственный домен для полностью фирменного опыта'),
('marketing.features.premium_plan_feature_1_description', 'it', 'Usa il tuo dominio per un''esperienza completamente brandizzata')
ON CONFLICT DO NOTHING;

INSERT INTO global_translations_marketing (key, locale, value) VALUES 
('marketing.features.premium_plan_feature_2_description', 'en', 'Welcome guests from anywhere in the world'),
('marketing.features.premium_plan_feature_2_description', 'zh', '欢迎来自世界各地的客人'),
('marketing.features.premium_plan_feature_2_description', 'hi', 'दुनिया से कहीं भी अतिथि का स्वागत करें'),
('marketing.features.premium_plan_feature_2_description', 'es', 'Da la bienvenida a invitados de cualquier lugar del mundo'),
('marketing.features.premium_plan_feature_2_description', 'ca', 'Benvinguda als convidats de qualsevol lloc del món'),
('marketing.features.premium_plan_feature_2_description', 'ar', 'رحب بالضيوف من أي مكان في العالم'),
('marketing.features.premium_plan_feature_2_description', 'fr', 'Accueillez les invités de n''importe quel endroit du monde'),
('marketing.features.premium_plan_feature_2_description', 'de', 'Begrüßen Sie Gäste von überall auf der Welt'),
('marketing.features.premium_plan_feature_2_description', 'pt', 'Receba convidados de qualquer lugar do mundo'),
('marketing.features.premium_plan_feature_2_description', 'ru', 'Приветствуйте гостей со всего мира'),
('marketing.features.premium_plan_feature_2_description', 'it', 'Accogliere ospiti da qualsiasi parte del mondo')
ON CONFLICT DO NOTHING;

INSERT INTO global_translations_marketing (key, locale, value) VALUES 
('marketing.features.premium_plan_feature_3_description', 'en', 'Add accommodations, events, and recommendations without limits'),
('marketing.features.premium_plan_feature_3_description', 'zh', '添加住宿、活动和建议,不受限制'),
('marketing.features.premium_plan_feature_3_description', 'hi', 'सीमा के बिना आवास, कार्यक्रम और सिफारिशें जोड़ें'),
('marketing.features.premium_plan_feature_3_description', 'es', 'Agrega alojamientos, eventos y recomendaciones sin límites'),
('marketing.features.premium_plan_feature_3_description', 'ca', 'Afegeix allotjaments, esdeveniments i recomanacions sense límits'),
('marketing.features.premium_plan_feature_3_description', 'ar', 'أضف الإقامات والأحداث والتوصيات بدون حدود'),
('marketing.features.premium_plan_feature_3_description', 'fr', 'Ajoutez des hébergements, des événements et des recommandations sans limites'),
('marketing.features.premium_plan_feature_3_description', 'de', 'Unterkünfte, Veranstaltungen und Empfehlungen ohne Limits hinzufügen'),
('marketing.features.premium_plan_feature_3_description', 'pt', 'Adicione acomodações, eventos e recomendações sem limites'),
('marketing.features.premium_plan_feature_3_description', 'ru', 'Добавляйте жилье, события и рекомендации без ограничений'),
('marketing.features.premium_plan_feature_3_description', 'it', 'Aggiungi alloggi, eventi e consigli senza limiti')
ON CONFLICT DO NOTHING;

INSERT INTO global_translations_marketing (key, locale, value) VALUES 
('marketing.features.premium_plan_feature_4_description', 'en', 'Get help faster when you need it most'),
('marketing.features.premium_plan_feature_4_description', 'zh', '在您最需要时获得更快的帮助'),
('marketing.features.premium_plan_feature_4_description', 'hi', 'जब आपको सबसे अधिक आवश्यकता हो तो तेजी से सहायता प्राप्त करें'),
('marketing.features.premium_plan_feature_4_description', 'es', 'Obtén ayuda más rápido cuando más la necesites'),
('marketing.features.premium_plan_feature_4_description', 'ca', 'Obtén ajuda més ràpida quan més la necessitis'),
('marketing.features.premium_plan_feature_4_description', 'ar', 'احصل على مساعدة أسرع عندما تحتاجها أكثر'),
('marketing.features.premium_plan_feature_4_description', 'fr', 'Obtenez de l''aide plus rapidement quand vous en avez le plus besoin'),
('marketing.features.premium_plan_feature_4_description', 'de', 'Hilfe schneller erhalten, wenn Sie sie am meisten brauchen'),
('marketing.features.premium_plan_feature_4_description', 'pt', 'Obtenha ajuda mais rápida quando precisar mais'),
('marketing.features.premium_plan_feature_4_description', 'ru', 'Получите помощь быстрее, когда она вам нужна больше всего'),
('marketing.features.premium_plan_feature_4_description', 'it', 'Ottieni aiuto più veloce quando ne hai più bisogno')
ON CONFLICT DO NOTHING;

INSERT INTO global_translations_marketing (key, locale, value) VALUES 
('marketing.features.premium_plan_feature_5_description', 'en', 'Create and manage multiple gift registries'),
('marketing.features.premium_plan_feature_5_description', 'zh', '创建和管理多个礼物登记册'),
('marketing.features.premium_plan_feature_5_description', 'hi', 'कई उपहार रजिस्ट्रियों को बनाएं और प्रबंधित करें'),
('marketing.features.premium_plan_feature_5_description', 'es', 'Crea y administra varios registros de regalos'),
('marketing.features.premium_plan_feature_5_description', 'ca', 'Crea i gestiona múltiples registres de regalos'),
('marketing.features.premium_plan_feature_5_description', 'ar', 'إنشاء وإدارة قوائم هدايا متعددة'),
('marketing.features.premium_plan_feature_5_description', 'fr', 'Créez et gérez plusieurs registres de cadeaux'),
('marketing.features.premium_plan_feature_5_description', 'de', 'Erstellen und verwalten Sie mehrere Geschenklisten'),
('marketing.features.premium_plan_feature_5_description', 'pt', 'Crie e gerencie múltiplos registros de presentes'),
('marketing.features.premium_plan_feature_5_description', 'ru', 'Создавайте и управляйте несколькими реестрами подарков'),
('marketing.features.premium_plan_feature_5_description', 'it', 'Crea e gestisci più registri regali')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- VERIFICATION QUERIES (Run these after applying the migration)
-- ============================================================================
-- SELECT * FROM global_translations_builder WHERE key LIKE 'pricing.plan.free.%' ORDER BY key;
-- SELECT * FROM global_translations_builder WHERE key LIKE 'pricing.plan.premium.%' ORDER BY key;
-- SELECT * FROM global_translations_marketing WHERE key LIKE 'marketing.features.%' ORDER BY key;
