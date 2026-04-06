-- ============================================================================
-- MIGRATION: Update Plan Features and Translations (FIXED)
-- ============================================================================
-- Corrected mapping: descriptions use sequential numbering 1-5
-- This migration now uses upserts so reruns update existing values.

-- ============================================================================
-- PART 1: UPDATE PREMIUM FEATURE TITLES IN global_translations_builder
-- ============================================================================

-- Set premium.feature_1 to "1 website + custom domain"
UPDATE global_translations_builder SET value = '1 website + custom domain' WHERE key = 'pricing.plan.premium.feature_1' AND locale = 'en';
UPDATE global_translations_builder SET value = '1 个网站 + 自定义域名' WHERE key = 'pricing.plan.premium.feature_1' AND locale = 'zh';
UPDATE global_translations_builder SET value = '1 वेबसाइट + कस्टम डोमेन' WHERE key = 'pricing.plan.premium.feature_1' AND locale = 'hi';
UPDATE global_translations_builder SET value = '1 sitio web + dominio personalizado' WHERE key = 'pricing.plan.premium.feature_1' AND locale = 'es';
UPDATE global_translations_builder SET value = '1 web + domini personalitzat' WHERE key = 'pricing.plan.premium.feature_1' AND locale = 'ca';
UPDATE global_translations_builder SET value = 'موقع ويب واحد + نطاق مخصص' WHERE key = 'pricing.plan.premium.feature_1' AND locale = 'ar';
UPDATE global_translations_builder SET value = '1 site web + domaine personnalisé' WHERE key = 'pricing.plan.premium.feature_1' AND locale = 'fr';
UPDATE global_translations_builder SET value = '1 Website + benutzerdefinierte Domain' WHERE key = 'pricing.plan.premium.feature_1' AND locale = 'de';
UPDATE global_translations_builder SET value = '1 site + domínio personalizado' WHERE key = 'pricing.plan.premium.feature_1' AND locale = 'pt';
UPDATE global_translations_builder SET value = '1 сайт + пользовательский домен' WHERE key = 'pricing.plan.premium.feature_1' AND locale = 'ru';
UPDATE global_translations_builder SET value = '1 sito web + dominio personalizzato' WHERE key = 'pricing.plan.premium.feature_1' AND locale = 'it';

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

-- Update free.feature_2 from "2 accommodations" to "Limited content"
UPDATE global_translations_builder SET value = 'Limited content' WHERE key = 'pricing.plan.free.feature_2' AND locale = 'en';
UPDATE global_translations_builder SET value = '内容受限' WHERE key = 'pricing.plan.free.feature_2' AND locale = 'zh';
UPDATE global_translations_builder SET value = 'सीमित सामग्री' WHERE key = 'pricing.plan.free.feature_2' AND locale = 'hi';
UPDATE global_translations_builder SET value = 'Contenido limitado' WHERE key = 'pricing.plan.free.feature_2' AND locale = 'es';
UPDATE global_translations_builder SET value = 'Contingut limitat' WHERE key = 'pricing.plan.free.feature_2' AND locale = 'ca';
UPDATE global_translations_builder SET value = 'محتوى محدود' WHERE key = 'pricing.plan.free.feature_2' AND locale = 'ar';
UPDATE global_translations_builder SET value = 'Contenu limité' WHERE key = 'pricing.plan.free.feature_2' AND locale = 'fr';
UPDATE global_translations_builder SET value = 'Begrenzter Inhalt' WHERE key = 'pricing.plan.free.feature_2' AND locale = 'de';
UPDATE global_translations_builder SET value = 'Conteúdo limitado' WHERE key = 'pricing.plan.free.feature_2' AND locale = 'pt';
UPDATE global_translations_builder SET value = 'Ограниченный контент' WHERE key = 'pricing.plan.free.feature_2' AND locale = 'ru';
UPDATE global_translations_builder SET value = 'Contenuto limitato' WHERE key = 'pricing.plan.free.feature_2' AND locale = 'it';

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

-- Update premium.feature_3 title to "Priority support"
UPDATE global_translations_builder SET value = 'Priority support' WHERE key = 'pricing.plan.premium.feature_3' AND locale = 'en';
UPDATE global_translations_builder SET value = '优先支持' WHERE key = 'pricing.plan.premium.feature_3' AND locale = 'zh';
UPDATE global_translations_builder SET value = 'प्राथमिक समर्थन' WHERE key = 'pricing.plan.premium.feature_3' AND locale = 'hi';
UPDATE global_translations_builder SET value = 'Soporte prioritario' WHERE key = 'pricing.plan.premium.feature_3' AND locale = 'es';
UPDATE global_translations_builder SET value = 'Suport prioritari' WHERE key = 'pricing.plan.premium.feature_3' AND locale = 'ca';
UPDATE global_translations_builder SET value = 'دعم ذو أولوية' WHERE key = 'pricing.plan.premium.feature_3' AND locale = 'ar';
UPDATE global_translations_builder SET value = 'Support prioritaire' WHERE key = 'pricing.plan.premium.feature_3' AND locale = 'fr';
UPDATE global_translations_builder SET value = 'Priorisierter Support' WHERE key = 'pricing.plan.premium.feature_3' AND locale = 'de';
UPDATE global_translations_builder SET value = 'Suporte prioritário' WHERE key = 'pricing.plan.premium.feature_3' AND locale = 'pt';
UPDATE global_translations_builder SET value = 'Приоритетная поддержка' WHERE key = 'pricing.plan.premium.feature_3' AND locale = 'ru';
UPDATE global_translations_builder SET value = 'Supporto prioritario' WHERE key = 'pricing.plan.premium.feature_3' AND locale = 'it';

-- INSERT premium.feature_5 "Advanced gift registry"
INSERT INTO global_translations_builder (key, locale, value) VALUES ('pricing.plan.premium.feature_5', 'en', 'Advanced gift registry') ON CONFLICT (key, locale) DO UPDATE SET value = EXCLUDED.value;
INSERT INTO global_translations_builder (key, locale, value) VALUES ('pricing.plan.premium.feature_5', 'zh', '高级礼物登记册') ON CONFLICT (key, locale) DO UPDATE SET value = EXCLUDED.value;
INSERT INTO global_translations_builder (key, locale, value) VALUES ('pricing.plan.premium.feature_5', 'hi', 'उन्नत उपहार रजिस्ट्री') ON CONFLICT (key, locale) DO UPDATE SET value = EXCLUDED.value;
INSERT INTO global_translations_builder (key, locale, value) VALUES ('pricing.plan.premium.feature_5', 'es', 'Registro de regalos avanzado') ON CONFLICT (key, locale) DO UPDATE SET value = EXCLUDED.value;
INSERT INTO global_translations_builder (key, locale, value) VALUES ('pricing.plan.premium.feature_5', 'ca', 'Registre de regals avançat') ON CONFLICT (key, locale) DO UPDATE SET value = EXCLUDED.value;
INSERT INTO global_translations_builder (key, locale, value) VALUES ('pricing.plan.premium.feature_5', 'ar', 'سجل الهدايا المتقدم') ON CONFLICT (key, locale) DO UPDATE SET value = EXCLUDED.value;
INSERT INTO global_translations_builder (key, locale, value) VALUES ('pricing.plan.premium.feature_5', 'fr', 'Registre de cadeaux avancé') ON CONFLICT (key, locale) DO UPDATE SET value = EXCLUDED.value;
INSERT INTO global_translations_builder (key, locale, value) VALUES ('pricing.plan.premium.feature_5', 'de', 'Erweitertes Geschenkregister') ON CONFLICT (key, locale) DO UPDATE SET value = EXCLUDED.value;
INSERT INTO global_translations_builder (key, locale, value) VALUES ('pricing.plan.premium.feature_5', 'pt', 'Registro de presentes avançado') ON CONFLICT (key, locale) DO UPDATE SET value = EXCLUDED.value;
INSERT INTO global_translations_builder (key, locale, value) VALUES ('pricing.plan.premium.feature_5', 'ru', 'Продвинутый реестр подарков') ON CONFLICT (key, locale) DO UPDATE SET value = EXCLUDED.value;
INSERT INTO global_translations_builder (key, locale, value) VALUES ('pricing.plan.premium.feature_5', 'it', 'Registro regali avanzato') ON CONFLICT (key, locale) DO UPDATE SET value = EXCLUDED.value;

-- ============================================================================
-- PART 2: DELETE UNUSED FREE FEATURE KEYS
-- ============================================================================
DELETE FROM global_translations_builder WHERE key = 'pricing.plan.free.feature_3';
DELETE FROM global_translations_builder WHERE key = 'pricing.plan.free.feature_4';
DELETE FROM global_translations_builder WHERE key = 'pricing.plan.free.feature_6';

-- ============================================================================
-- PART 3: ADD MARKETING FEATURE DESCRIPTIONS (global_translations_marketing)
-- ============================================================================

-- FREE PLAN DESCRIPTIONS (sequential numbering 1-5)
INSERT INTO global_translations_marketing (key, locale, value) VALUES 
('marketing.features.free_plan_feature_1_description', 'en', 'Your site lives at yourname.weddweb.com'),
('marketing.features.free_plan_feature_1_description', 'zh', '您的网站位于 yourname.weddweb.com'),
('marketing.features.free_plan_feature_1_description', 'hi', 'आपकी साइट yourname.weddweb.com पर रहती है'),
('marketing.features.free_plan_feature_1_description', 'es', 'Tu sitio estará en yourname.weddweb.com'),
('marketing.features.free_plan_feature_1_description', 'ca', 'El teu lloc web estarà a yourname.weddweb.com'),
('marketing.features.free_plan_feature_1_description', 'ar', 'موقعك يعيش على yourname.weddweb.com'),
('marketing.features.free_plan_feature_1_description', 'fr', 'Votre site vit sur yourname.weddweb.com'),
('marketing.features.free_plan_feature_1_description', 'de', 'Deine Website lebt auf yourname.weddweb.com'),
('marketing.features.free_plan_feature_1_description', 'pt', 'Seu site fica em yourname.weddweb.com'),
('marketing.features.free_plan_feature_1_description', 'ru', 'Ваш сайт находится на yourname.weddweb.com'),
('marketing.features.free_plan_feature_1_description', 'it', 'Il tuo sito vive su yourname.weddweb.com')
ON CONFLICT (key, locale) DO UPDATE SET value = EXCLUDED.value;

INSERT INTO global_translations_marketing (key, locale, value) VALUES 
('marketing.features.free_plan_feature_2_description', 'en', 'Share your site in one language of your choice'),
('marketing.features.free_plan_feature_2_description', 'zh', '用您选择的一种语言分享您的网站'),
('marketing.features.free_plan_feature_2_description', 'hi', 'अपनी पसंद की एक भाषा में अपनी साइट साझा करें'),
('marketing.features.free_plan_feature_2_description', 'es', 'Comparte tu sitio en un idioma de tu elección'),
('marketing.features.free_plan_feature_2_description', 'ca', 'Comparteix el teu lloc web en un idioma de la teva elecció'),
('marketing.features.free_plan_feature_2_description', 'ar', 'شارك موقعك بلغة واحدة من اختيارك'),
('marketing.features.free_plan_feature_2_description', 'fr', 'Partagez votre site dans une langue de votre choix'),
('marketing.features.free_plan_feature_2_description', 'de', 'Teilen Sie Ihre Website in einer Sprache Ihrer Wahl'),
('marketing.features.free_plan_feature_2_description', 'pt', 'Compartilhe seu site em um idioma de sua escolha'),
('marketing.features.free_plan_feature_2_description', 'ru', 'Поделитесь своим сайтом на одном языке по вашему выбору'),
('marketing.features.free_plan_feature_2_description', 'it', 'Condividi il tuo sito in una lingua a tua scelta')
ON CONFLICT (key, locale) DO UPDATE SET value = EXCLUDED.value;

INSERT INTO global_translations_marketing (key, locale, value) VALUES 
('marketing.features.free_plan_feature_3_description', 'en', 'Limited content: 2 accommodations, 2 activities, unlimited events'),
('marketing.features.free_plan_feature_3_description', 'zh', '内容受限：2 个住宿、2 个活动、活动无限'),
('marketing.features.free_plan_feature_3_description', 'hi', 'सीमित सामग्री: 2 आवास, 2 गतिविधियां, असीमित कार्यक्रम'),
('marketing.features.free_plan_feature_3_description', 'es', 'Contenido limitado: 2 alojamientos, 2 actividades y eventos ilimitados'),
('marketing.features.free_plan_feature_3_description', 'ca', 'Contingut limitat: 2 allotjaments, 2 activitats i esdeveniments il·limitats'),
('marketing.features.free_plan_feature_3_description', 'ar', 'محتوى محدود: مكانا إقامة، نشاطان، وأحداث غير محدودة'),
('marketing.features.free_plan_feature_3_description', 'fr', 'Contenu limité : 2 hébergements, 2 activités et événements illimités'),
('marketing.features.free_plan_feature_3_description', 'de', 'Begrenzter Inhalt: 2 Unterkünfte, 2 Aktivitäten und unbegrenzte Events'),
('marketing.features.free_plan_feature_3_description', 'pt', 'Conteúdo limitado: 2 acomodações, 2 atividades e eventos ilimitados'),
('marketing.features.free_plan_feature_3_description', 'ru', 'Ограниченный контент: 2 варианта проживания, 2 активности и неограниченные события'),
('marketing.features.free_plan_feature_3_description', 'it', 'Contenuto limitato: 2 alloggi, 2 attività ed eventi illimitati')
ON CONFLICT (key, locale) DO UPDATE SET value = EXCLUDED.value;

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
ON CONFLICT (key, locale) DO UPDATE SET value = EXCLUDED.value;

INSERT INTO global_translations_marketing (key, locale, value) VALUES 
('marketing.features.free_plan_feature_5_description', 'en', 'Get help by email in less than 4 days'),
('marketing.features.free_plan_feature_5_description', 'zh', '在不到 4 天内通过电子邮件获得帮助'),
('marketing.features.free_plan_feature_5_description', 'hi', '4 दिनों से कम समय में ईमेल सहायता पाएं'),
('marketing.features.free_plan_feature_5_description', 'es', 'Obtén ayuda por correo electrónico en menos de 4 días'),
('marketing.features.free_plan_feature_5_description', 'ca', 'Obtén ajuda per correu electrònic en menys de 4 dies'),
('marketing.features.free_plan_feature_5_description', 'ar', 'احصل على المساعدة عبر البريد الإلكتروني خلال أقل من 4 أيام'),
('marketing.features.free_plan_feature_5_description', 'fr', 'Obtenez de l''aide par e-mail en moins de 4 jours'),
('marketing.features.free_plan_feature_5_description', 'de', 'Erhalten Sie Hilfe per E-Mail in weniger als 4 Tagen'),
('marketing.features.free_plan_feature_5_description', 'pt', 'Receba ajuda por e-mail em menos de 4 dias'),
('marketing.features.free_plan_feature_5_description', 'ru', 'Получите помощь по электронной почте менее чем за 4 дня'),
('marketing.features.free_plan_feature_5_description', 'it', 'Ricevi assistenza via e-mail in meno di 4 giorni')
ON CONFLICT (key, locale) DO UPDATE SET value = EXCLUDED.value;

-- PREMIUM PLAN DESCRIPTIONS (sequential numbering 1-5)
INSERT INTO global_translations_marketing (key, locale, value) VALUES 
('marketing.features.premium_plan_feature_1_description', 'en', 'Use your own domain for a fully branded experience'),
('marketing.features.premium_plan_feature_1_description', 'zh', '使用您自己的域名获得完整的品牌体验'),
('marketing.features.premium_plan_feature_1_description', 'hi', 'पूर्ण ब्रांडेड अनुभव के लिए अपना स्वयं का डोमेन उपयोग करें'),
('marketing.features.premium_plan_feature_1_description', 'es', 'Usa tu propio dominio para una experiencia completamente personalizada'),
('marketing.features.premium_plan_feature_1_description', 'ca', 'Utilitza el teu propi domini per a una experiència totalment personalitzada'),
('marketing.features.premium_plan_feature_1_description', 'ar', 'استخدم نطاقك الخاص للحصول على تجربة بعلامة تجارية كاملة'),
('marketing.features.premium_plan_feature_1_description', 'fr', 'Utilisez votre propre domaine pour une expérience entièrement personnalisée'),
('marketing.features.premium_plan_feature_1_description', 'de', 'Verwenden Sie Ihre eigene Domain für ein vollständig markengerechtes Erlebnis'),
('marketing.features.premium_plan_feature_1_description', 'pt', 'Use seu próprio domínio para uma experiência totalmente personalizada'),
('marketing.features.premium_plan_feature_1_description', 'ru', 'Используйте собственный домен для полностью фирменного опыта'),
('marketing.features.premium_plan_feature_1_description', 'it', 'Usa il tuo dominio per un''esperienza completamente brandizzata')
ON CONFLICT (key, locale) DO UPDATE SET value = EXCLUDED.value;

INSERT INTO global_translations_marketing (key, locale, value) VALUES 
('marketing.features.premium_plan_feature_2_description', 'en', 'Welcome guests from anywhere in the world'),
('marketing.features.premium_plan_feature_2_description', 'zh', '欢迎来自世界各地的客人'),
('marketing.features.premium_plan_feature_2_description', 'hi', 'दुनिया से कहीं भी अतिथि का स्वागत करें'),
('marketing.features.premium_plan_feature_2_description', 'es', 'Da la bienvenida a invitados de todo el mundo'),
('marketing.features.premium_plan_feature_2_description', 'ca', 'Dona la benvinguda a convidats d''arreu del món'),
('marketing.features.premium_plan_feature_2_description', 'ar', 'رحب بالضيوف من أي مكان في العالم'),
('marketing.features.premium_plan_feature_2_description', 'fr', 'Accueillez les invités de n''importe quel endroit du monde'),
('marketing.features.premium_plan_feature_2_description', 'de', 'Begrüßen Sie Gäste von überall auf der Welt'),
('marketing.features.premium_plan_feature_2_description', 'pt', 'Receba convidados de qualquer lugar do mundo'),
('marketing.features.premium_plan_feature_2_description', 'ru', 'Приветствуйте гостей со всего мира'),
('marketing.features.premium_plan_feature_2_description', 'it', 'Accogli ospiti da tutto il mondo')
ON CONFLICT (key, locale) DO UPDATE SET value = EXCLUDED.value;

INSERT INTO global_translations_marketing (key, locale, value) VALUES 
('marketing.features.premium_plan_feature_3_description', 'en', 'Add as many events, accommodation tips, and activities as you need'),
('marketing.features.premium_plan_feature_3_description', 'zh', '根据需要添加任意数量的活动、住宿建议和行程安排'),
('marketing.features.premium_plan_feature_3_description', 'hi', 'जितने चाहें उतने कार्यक्रम, आवास सुझाव और गतिविधियां जोड़ें'),
('marketing.features.premium_plan_feature_3_description', 'es', 'Añade tantos eventos, recomendaciones de alojamiento y actividades como necesites'),
('marketing.features.premium_plan_feature_3_description', 'ca', 'Afegeix tants esdeveniments, consells d''allotjament i activitats com necessitis'),
('marketing.features.premium_plan_feature_3_description', 'ar', 'أضف من الفعاليات ونصائح الإقامة والأنشطة ما تحتاجه'),
('marketing.features.premium_plan_feature_3_description', 'fr', 'Ajoutez autant d''événements, de conseils d''hébergement et d''activités que nécessaire'),
('marketing.features.premium_plan_feature_3_description', 'de', 'Fügen Sie so viele Veranstaltungen, Unterkunftstipps und Aktivitäten hinzu, wie Sie brauchen'),
('marketing.features.premium_plan_feature_3_description', 'pt', 'Adicione quantos eventos, dicas de acomodação e atividades você precisar'),
('marketing.features.premium_plan_feature_3_description', 'ru', 'Добавляйте столько событий, советов по размещению и активностей, сколько нужно'),
('marketing.features.premium_plan_feature_3_description', 'it', 'Aggiungi tutti gli eventi, i consigli sugli alloggi e le attività che ti servono')
ON CONFLICT (key, locale) DO UPDATE SET value = EXCLUDED.value;

INSERT INTO global_translations_marketing (key, locale, value) VALUES 
('marketing.features.premium_plan_feature_4_description', 'en', 'Get help by email in less than 48 hours'),
('marketing.features.premium_plan_feature_4_description', 'zh', '在不到 48 小时内通过电子邮件获得帮助'),
('marketing.features.premium_plan_feature_4_description', 'hi', '48 घंटों से कम समय में ईमेल सहायता पाएं'),
('marketing.features.premium_plan_feature_4_description', 'es', 'Obtén ayuda por correo electrónico en menos de 48 horas'),
('marketing.features.premium_plan_feature_4_description', 'ca', 'Obtén ajuda per correu electrònic en menys de 48 hores'),
('marketing.features.premium_plan_feature_4_description', 'ar', 'احصل على المساعدة عبر البريد الإلكتروني خلال أقل من 48 ساعة'),
('marketing.features.premium_plan_feature_4_description', 'fr', 'Obtenez de l''aide par e-mail en moins de 48 heures'),
('marketing.features.premium_plan_feature_4_description', 'de', 'Erhalten Sie Hilfe per E-Mail in weniger als 48 Stunden'),
('marketing.features.premium_plan_feature_4_description', 'pt', 'Receba ajuda por e-mail em menos de 48 horas'),
('marketing.features.premium_plan_feature_4_description', 'ru', 'Получите помощь по электронной почте менее чем за 48 часов'),
('marketing.features.premium_plan_feature_4_description', 'it', 'Ricevi assistenza via e-mail in meno di 48 ore')
ON CONFLICT (key, locale) DO UPDATE SET value = EXCLUDED.value;

INSERT INTO global_translations_marketing (key, locale, value) VALUES 
('marketing.features.premium_plan_feature_5_description', 'en', 'Create and manage multiple gift registries'),
('marketing.features.premium_plan_feature_5_description', 'zh', '创建和管理多个礼物登记册'),
('marketing.features.premium_plan_feature_5_description', 'hi', 'कई उपहार रजिस्ट्रियों को बनाएं और प्रबंधित करें'),
('marketing.features.premium_plan_feature_5_description', 'es', 'Crea y administra varios registros de regalos'),
('marketing.features.premium_plan_feature_5_description', 'ca', 'Crea i gestiona múltiples registres de regals'),
('marketing.features.premium_plan_feature_5_description', 'ar', 'إنشاء وإدارة قوائم هدايا متعددة'),
('marketing.features.premium_plan_feature_5_description', 'fr', 'Créez et gérez plusieurs registres de cadeaux'),
('marketing.features.premium_plan_feature_5_description', 'de', 'Erstellen und verwalten Sie mehrere Geschenklisten'),
('marketing.features.premium_plan_feature_5_description', 'pt', 'Crie e gerencie múltiplos registros de presentes'),
('marketing.features.premium_plan_feature_5_description', 'ru', 'Создавайте и управляйте несколькими реестрами подарков'),
('marketing.features.premium_plan_feature_5_description', 'it', 'Crea e gestisci più registri regali')
ON CONFLICT (key, locale) DO UPDATE SET value = EXCLUDED.value;
