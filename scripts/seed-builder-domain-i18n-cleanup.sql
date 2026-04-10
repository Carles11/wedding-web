-- Domain i18n cleanup: remove defunct Domain-Connect keys, insert new status/error keys
-- Target table: global_translations_builder (row-per-locale: key, locale, value)

BEGIN;

-- ============================================================
-- 1. DELETE old Domain-Connect keys (no longer referenced in code)
-- ============================================================
DELETE FROM public.global_translations_builder
WHERE key IN (
  'builder.domain.magic_title',
  'builder.domain.magic_button',
  'builder.domain.magic_warning_godaddy',
  'builder.domain.callback_verifying',
  'builder.domain.did_you_add_dns',
  'builder.domain.go_to_domain',
  'builder.domain.no_show_how'
);

-- ============================================================
-- 2. INSERT new keys (one row per key × locale)
-- ============================================================
INSERT INTO public.global_translations_builder (key, locale, value) VALUES
  -- builder.domain.status_pending_dns
  ('builder.domain.status_pending_dns', 'en', 'DNS Required'),
  ('builder.domain.status_pending_dns', 'zh', 'DNS 配置必需'),
  ('builder.domain.status_pending_dns', 'hi', 'DNS आवश्यक है'),
  ('builder.domain.status_pending_dns', 'es', 'DNS requerido'),
  ('builder.domain.status_pending_dns', 'ca', 'DNS requerit'),
  ('builder.domain.status_pending_dns', 'ar', 'مطلوب إعداد DNS'),
  ('builder.domain.status_pending_dns', 'fr', 'DNS requis'),
  ('builder.domain.status_pending_dns', 'de', 'DNS erforderlich'),
  ('builder.domain.status_pending_dns', 'pt', 'DNS necessário'),
  ('builder.domain.status_pending_dns', 'ru', 'Требуется DNS'),
  ('builder.domain.status_pending_dns', 'it', 'DNS necessario'),

  -- builder.domain.status_pending_ssl
  ('builder.domain.status_pending_ssl', 'en', 'Almost Ready'),
  ('builder.domain.status_pending_ssl', 'zh', '即将就绪'),
  ('builder.domain.status_pending_ssl', 'hi', 'लगभग तैयार'),
  ('builder.domain.status_pending_ssl', 'es', 'Casi listo'),
  ('builder.domain.status_pending_ssl', 'ca', 'Gairebé llest'),
  ('builder.domain.status_pending_ssl', 'ar', 'جاهز تقريبًا'),
  ('builder.domain.status_pending_ssl', 'fr', 'Presque prêt'),
  ('builder.domain.status_pending_ssl', 'de', 'Fast fertig'),
  ('builder.domain.status_pending_ssl', 'pt', 'Quase pronto'),
  ('builder.domain.status_pending_ssl', 'ru', 'Почти готово'),
  ('builder.domain.status_pending_ssl', 'it', 'Quasi pronto'),

  -- builder.domain.status_live
  ('builder.domain.status_live', 'en', 'Live'),
  ('builder.domain.status_live', 'zh', '已上线'),
  ('builder.domain.status_live', 'hi', 'लाइव'),
  ('builder.domain.status_live', 'es', 'Activo'),
  ('builder.domain.status_live', 'ca', 'Actiu'),
  ('builder.domain.status_live', 'ar', 'مباشر'),
  ('builder.domain.status_live', 'fr', 'En ligne'),
  ('builder.domain.status_live', 'de', 'Live'),
  ('builder.domain.status_live', 'pt', 'Ativo'),
  ('builder.domain.status_live', 'ru', 'Активен'),
  ('builder.domain.status_live', 'it', 'Attivo'),

  -- builder.domain.status_error
  ('builder.domain.status_error', 'en', 'Error'),
  ('builder.domain.status_error', 'zh', '错误'),
  ('builder.domain.status_error', 'hi', 'त्रुटि'),
  ('builder.domain.status_error', 'es', 'Error'),
  ('builder.domain.status_error', 'ca', 'Error'),
  ('builder.domain.status_error', 'ar', 'خطأ'),
  ('builder.domain.status_error', 'fr', 'Erreur'),
  ('builder.domain.status_error', 'de', 'Fehler'),
  ('builder.domain.status_error', 'pt', 'Erro'),
  ('builder.domain.status_error', 'ru', 'Ошибка'),
  ('builder.domain.status_error', 'it', 'Errore'),

  -- builder.domain.message_pending_ssl
  ('builder.domain.message_pending_ssl', 'en', 'DNS is configured correctly. SSL certificate is being generated — this usually takes a minute.'),
  ('builder.domain.message_pending_ssl', 'zh', 'DNS 已正确配置。正在生成 SSL 证书——通常只需一分钟。'),
  ('builder.domain.message_pending_ssl', 'hi', 'DNS सही ढंग से कॉन्फ़िगर किया गया है। SSL प्रमाणपत्र बनाया जा रहा है — इसमें आमतौर पर एक मिनट लगता है।'),
  ('builder.domain.message_pending_ssl', 'es', 'El DNS está configurado correctamente. Se está generando el certificado SSL, esto suele tardar un minuto.'),
  ('builder.domain.message_pending_ssl', 'ca', 'El DNS està configurat correctament. S''està generant el certificat SSL — normalment triga un minut.'),
  ('builder.domain.message_pending_ssl', 'ar', 'تم تكوين DNS بشكل صحيح. يتم إنشاء شهادة SSL — عادة ما يستغرق ذلك دقيقة واحدة.'),
  ('builder.domain.message_pending_ssl', 'fr', 'Le DNS est correctement configuré. Le certificat SSL est en cours de génération — cela prend généralement une minute.'),
  ('builder.domain.message_pending_ssl', 'de', 'DNS ist korrekt konfiguriert. Das SSL-Zertifikat wird erstellt — das dauert normalerweise eine Minute.'),
  ('builder.domain.message_pending_ssl', 'pt', 'O DNS está configurado corretamente. O certificado SSL está sendo gerado — isso geralmente leva um minuto.'),
  ('builder.domain.message_pending_ssl', 'ru', 'DNS настроен правильно. Генерируется SSL-сертификат — обычно это занимает около минуты.'),
  ('builder.domain.message_pending_ssl', 'it', 'Il DNS è configurato correttamente. Il certificato SSL è in fase di generazione — di solito ci vuole un minuto.'),

  -- builder.domain.social.help_title
  ('builder.domain.social.help_title', 'en', 'No idea what DNS is all about?'),
  ('builder.domain.social.help_title', 'zh', '完全不知道 DNS 是什么？'),
  ('builder.domain.social.help_title', 'hi', 'DNS के बारे में कोई जानकारी नहीं है?'),
  ('builder.domain.social.help_title', 'es', '¿No tienes idea de qué va el DNS?'),
  ('builder.domain.social.help_title', 'ca', 'No tens ni idea de què és el DNS?'),
  ('builder.domain.social.help_title', 'ar', 'لا فكرة لديك عن DNS؟'),
  ('builder.domain.social.help_title', 'fr', 'Aucune idée de ce qu''est le DNS ?'),
  ('builder.domain.social.help_title', 'de', 'Keine Ahnung, was DNS ist?'),
  ('builder.domain.social.help_title', 'pt', 'Não faz ideia do que é DNS?'),
  ('builder.domain.social.help_title', 'ru', 'Не знаете, что такое DNS?'),
  ('builder.domain.social.help_title', 'it', 'Non hai idea di cosa sia il DNS?'),

  -- builder.domain.social.help_button
  ('builder.domain.social.help_button', 'en', 'Forward to a tech-savvy friend'),
  ('builder.domain.social.help_button', 'zh', '转发给懂技术的朋友'),
  ('builder.domain.social.help_button', 'hi', 'किसी तकनीक-जानकार दोस्त को भेजें'),
  ('builder.domain.social.help_button', 'es', 'Reenviar a un amigo experto en tecnología'),
  ('builder.domain.social.help_button', 'ca', 'Reenvia a un amic expert en tecnologia'),
  ('builder.domain.social.help_button', 'ar', 'أرسلها إلى صديق يفهم التقنية'),
  ('builder.domain.social.help_button', 'fr', 'Transmettre à un ami doué en informatique'),
  ('builder.domain.social.help_button', 'de', 'An einen technikaffinen Freund weiterleiten'),
  ('builder.domain.social.help_button', 'pt', 'Encaminhar para um amigo que entende de tecnologia'),
  ('builder.domain.social.help_button', 'ru', 'Переслать другу, который разбирается в технике'),
  ('builder.domain.social.help_button', 'it', 'Inoltra a un amico esperto di tecnologia'),

  -- builder.domain.social.email_hint
  ('builder.domain.social.email_hint', 'en', 'We''ll prepare an email with all the DNS details ready to send.'),
  ('builder.domain.social.email_hint', 'zh', '我们将准备一封包含所有 DNS 详情的邮件供您发送。'),
  ('builder.domain.social.email_hint', 'hi', 'हम सभी DNS विवरणों के साथ एक ईमेल तैयार करेंगे जो भेजने के लिए तैयार होगा।'),
  ('builder.domain.social.email_hint', 'es', 'Prepararemos un correo con todos los datos DNS listo para enviar.'),
  ('builder.domain.social.email_hint', 'ca', 'Prepararem un correu amb tots els detalls DNS llest per enviar.'),
  ('builder.domain.social.email_hint', 'ar', 'سنُعد بريدًا إلكترونيًا يحتوي على جميع تفاصيل DNS جاهزًا للإرسال.'),
  ('builder.domain.social.email_hint', 'fr', 'Nous préparons un e-mail avec tous les détails DNS prêt à envoyer.'),
  ('builder.domain.social.email_hint', 'de', 'Wir bereiten eine E-Mail mit allen DNS-Details zum Versenden vor.'),
  ('builder.domain.social.email_hint', 'pt', 'Vamos preparar um e-mail com todos os detalhes de DNS pronto para enviar.'),
  ('builder.domain.social.email_hint', 'ru', 'Мы подготовим письмо со всеми данными DNS, готовое к отправке.'),
  ('builder.domain.social.email_hint', 'it', 'Prepareremo un''e-mail con tutti i dettagli DNS pronta da inviare.'),

  -- builder.domain.error.conflicting_caa
  ('builder.domain.error.conflicting_caa', 'en', 'Your domain has a security lock (CAA). Please update your DNS to allow ''letsencrypt.org'' so we can secure your site.'),
  ('builder.domain.error.conflicting_caa', 'zh', '您的域名有安全锁（CAA 记录）。请更新 DNS 以允许 letsencrypt.org，以便保护您的网站。'),
  ('builder.domain.error.conflicting_caa', 'hi', 'आपके डोमेन में सुरक्षा लॉक (CAA) है। कृपया अपने DNS को अपडेट करें ताकि letsencrypt.org को अनुमति मिले।'),
  ('builder.domain.error.conflicting_caa', 'es', 'Tu dominio tiene un bloqueo de seguridad (CAA). Actualiza tu DNS para permitir letsencrypt.org y proteger tu sitio.'),
  ('builder.domain.error.conflicting_caa', 'ca', 'El teu domini té un bloqueig de seguretat (CAA). Actualitza el DNS per permetre letsencrypt.org.'),
  ('builder.domain.error.conflicting_caa', 'ar', 'نطاقك يحتوي على قفل أمان (CAA). يرجى تحديث DNS للسماح بـ letsencrypt.org لتأمين موقعك.'),
  ('builder.domain.error.conflicting_caa', 'fr', 'Votre domaine a un verrou de sécurité (CAA). Veuillez mettre à jour votre DNS pour autoriser letsencrypt.org.'),
  ('builder.domain.error.conflicting_caa', 'de', 'Ihre Domain hat eine Sicherheitssperre (CAA). Bitte aktualisieren Sie Ihren DNS, um letsencrypt.org zuzulassen.'),
  ('builder.domain.error.conflicting_caa', 'pt', 'Seu domínio tem um bloqueio de segurança (CAA). Atualize seu DNS para permitir letsencrypt.org.'),
  ('builder.domain.error.conflicting_caa', 'ru', 'У вашего домена есть блокировка безопасности (CAA). Обновите DNS, чтобы разрешить letsencrypt.org.'),
  ('builder.domain.error.conflicting_caa', 'it', 'Il tuo dominio ha un blocco di sicurezza (CAA). Aggiorna il DNS per consentire letsencrypt.org.'),

  -- builder.domain.error.domain_taken
  ('builder.domain.error.domain_taken', 'en', 'This domain is already linked to another project. Please verify you own it and that it isn''t active elsewhere.'),
  ('builder.domain.error.domain_taken', 'zh', '此域名已关联到另一个项目。请确认您拥有它，且它未在其他地方使用。'),
  ('builder.domain.error.domain_taken', 'hi', 'यह डोमेन पहले से किसी अन्य प्रोजेक्ट से जुड़ा है। कृपया सत्यापित करें कि यह आपका है और कहीं और सक्रिय नहीं है।'),
  ('builder.domain.error.domain_taken', 'es', 'Este dominio ya está vinculado a otro proyecto. Verifica que eres el propietario y que no está activo en otro lugar.'),
  ('builder.domain.error.domain_taken', 'ca', 'Aquest domini ja està vinculat a un altre projecte. Verifica que en siguis el propietari i que no estigui actiu en un altre lloc.'),
  ('builder.domain.error.domain_taken', 'ar', 'هذا النطاق مرتبط بالفعل بمشروع آخر. يرجى التحقق من ملكيتك وأنه غير نشط في مكان آخر.'),
  ('builder.domain.error.domain_taken', 'fr', 'Ce domaine est déjà lié à un autre projet. Vérifiez que vous en êtes propriétaire et qu''il n''est pas actif ailleurs.'),
  ('builder.domain.error.domain_taken', 'de', 'Diese Domain ist bereits mit einem anderen Projekt verknüpft. Bitte überprüfen Sie, ob sie Ihnen gehört und nicht anderweitig aktiv ist.'),
  ('builder.domain.error.domain_taken', 'pt', 'Este domínio já está vinculado a outro projeto. Verifique se você é o proprietário e se ele não está ativo em outro lugar.'),
  ('builder.domain.error.domain_taken', 'ru', 'Этот домен уже привязан к другому проекту. Убедитесь, что он принадлежит вам и не активен в другом месте.'),
  ('builder.domain.error.domain_taken', 'it', 'Questo dominio è già collegato a un altro progetto. Verifica di esserne il proprietario e che non sia attivo altrove.'),

  -- builder.domain.error.rate_limited
  ('builder.domain.error.rate_limited', 'en', 'Too many attempts. Please wait a few minutes before trying again.'),
  ('builder.domain.error.rate_limited', 'zh', '尝试次数过多。请等待几分钟后再试。'),
  ('builder.domain.error.rate_limited', 'hi', 'बहुत अधिक प्रयास। कृपया कुछ मिनट प्रतीक्षा करें और फिर प्रयास करें।'),
  ('builder.domain.error.rate_limited', 'es', 'Demasiados intentos. Espera unos minutos antes de volver a intentarlo.'),
  ('builder.domain.error.rate_limited', 'ca', 'Massa intents. Espera uns minuts abans de tornar-ho a provar.'),
  ('builder.domain.error.rate_limited', 'ar', 'محاولات كثيرة جدًا. يرجى الانتظار بضع دقائق قبل المحاولة مرة أخرى.'),
  ('builder.domain.error.rate_limited', 'fr', 'Trop de tentatives. Veuillez patienter quelques minutes avant de réessayer.'),
  ('builder.domain.error.rate_limited', 'de', 'Zu viele Versuche. Bitte warten Sie einige Minuten, bevor Sie es erneut versuchen.'),
  ('builder.domain.error.rate_limited', 'pt', 'Muitas tentativas. Aguarde alguns minutos antes de tentar novamente.'),
  ('builder.domain.error.rate_limited', 'ru', 'Слишком много попыток. Подождите несколько минут перед повторной попыткой.'),
  ('builder.domain.error.rate_limited', 'it', 'Troppi tentativi. Attendi qualche minuto prima di riprovare.'),

  -- builder.domain.error.invalid_domain
  ('builder.domain.error.invalid_domain', 'en', 'That doesn''t look like a valid domain format. Please check for typos.'),
  ('builder.domain.error.invalid_domain', 'zh', '这看起来不像有效的域名格式。请检查是否有拼写错误。'),
  ('builder.domain.error.invalid_domain', 'hi', 'यह एक मान्य डोमेन प्रारूप नहीं लगता। कृपया टाइपो की जांच करें।'),
  ('builder.domain.error.invalid_domain', 'es', 'Eso no parece un formato de dominio válido. Revisa si hay errores de escritura.'),
  ('builder.domain.error.invalid_domain', 'ca', 'Això no sembla un format de domini vàlid. Comprova si hi ha errors.'),
  ('builder.domain.error.invalid_domain', 'ar', 'لا يبدو أن هذا تنسيق نطاق صالح. يرجى التحقق من الأخطاء الإملائية.'),
  ('builder.domain.error.invalid_domain', 'fr', 'Cela ne ressemble pas à un format de domaine valide. Vérifiez les fautes de frappe.'),
  ('builder.domain.error.invalid_domain', 'de', 'Das sieht nicht wie ein gültiges Domain-Format aus. Bitte überprüfen Sie auf Tippfehler.'),
  ('builder.domain.error.invalid_domain', 'pt', 'Isso não parece um formato de domínio válido. Verifique se há erros de digitação.'),
  ('builder.domain.error.invalid_domain', 'ru', 'Это не похоже на допустимый формат домена. Проверьте наличие опечаток.'),
  ('builder.domain.error.invalid_domain', 'it', 'Questo non sembra un formato di dominio valido. Controlla eventuali errori di battitura.'),

  -- builder.domain.dns_modal.section_diy
  ('builder.domain.dns_modal.section_diy', 'en', 'Add these records at your registrar'),
  ('builder.domain.dns_modal.section_diy', 'zh', '在您的注册商处添加这些记录'),
  ('builder.domain.dns_modal.section_diy', 'hi', 'अपने रजिस्ट्रार पर ये रिकॉर्ड जोड़ें'),
  ('builder.domain.dns_modal.section_diy', 'es', 'Añade estos registros en tu registrador'),
  ('builder.domain.dns_modal.section_diy', 'ca', 'Afegeix aquests registres al teu registrador'),
  ('builder.domain.dns_modal.section_diy', 'ar', 'أضف هذه السجلات لدى مسجّل النطاق الخاص بك'),
  ('builder.domain.dns_modal.section_diy', 'fr', 'Ajoutez ces enregistrements chez votre bureau d''enregistrement'),
  ('builder.domain.dns_modal.section_diy', 'de', 'Fügen Sie diese Einträge bei Ihrem Registrar hinzu'),
  ('builder.domain.dns_modal.section_diy', 'pt', 'Adicione esses registros no seu registrador'),
  ('builder.domain.dns_modal.section_diy', 'ru', 'Добавьте эти записи у вашего регистратора'),
  ('builder.domain.dns_modal.section_diy', 'it', 'Aggiungi questi record presso il tuo registrar'),

  -- builder.domain.dns_modal.divider_or
  ('builder.domain.dns_modal.divider_or', 'en', 'or'),
  ('builder.domain.dns_modal.divider_or', 'zh', '或者'),
  ('builder.domain.dns_modal.divider_or', 'hi', 'या'),
  ('builder.domain.dns_modal.divider_or', 'es', 'o'),
  ('builder.domain.dns_modal.divider_or', 'ca', 'o'),
  ('builder.domain.dns_modal.divider_or', 'ar', 'أو'),
  ('builder.domain.dns_modal.divider_or', 'fr', 'ou'),
  ('builder.domain.dns_modal.divider_or', 'de', 'oder'),
  ('builder.domain.dns_modal.divider_or', 'pt', 'ou'),
  ('builder.domain.dns_modal.divider_or', 'ru', 'или'),
  ('builder.domain.dns_modal.divider_or', 'it', 'oppure'),

  -- builder.domain.verified_message (updated text)
  ('builder.domain.verified_message', 'en', 'Your domain is live!'),
  ('builder.domain.verified_message', 'zh', '你的域名已上线！'),
  ('builder.domain.verified_message', 'hi', 'आपका डोमेन लाइव है!'),
  ('builder.domain.verified_message', 'es', '¡Tu dominio está activo!'),
  ('builder.domain.verified_message', 'ca', 'El teu domini està actiu!'),
  ('builder.domain.verified_message', 'ar', 'نطاقك مفعّل الآن!'),
  ('builder.domain.verified_message', 'fr', 'Votre domaine est en ligne !'),
  ('builder.domain.verified_message', 'de', 'Deine Domain ist live!'),
  ('builder.domain.verified_message', 'pt', 'Seu domínio está ativo!'),
  ('builder.domain.verified_message', 'ru', 'Ваш домен активен!'),
  ('builder.domain.verified_message', 'it', 'Il tuo dominio è attivo!'),

  -- builder.domain.verified_subtitle
  ('builder.domain.verified_subtitle', 'en', 'Everything is configured correctly. Your guests can access your site at this address.'),
  ('builder.domain.verified_subtitle', 'zh', '一切配置正确。您的客人可以通过此地址访问您的网站。'),
  ('builder.domain.verified_subtitle', 'hi', 'सब कुछ सही ढंग से कॉन्फ़िगर किया गया है। आपके मेहमान इस पते पर आपकी साइट तक पहुँच सकते हैं।'),
  ('builder.domain.verified_subtitle', 'es', 'Todo está configurado correctamente. Tus invitados pueden acceder a tu sitio en esta dirección.'),
  ('builder.domain.verified_subtitle', 'ca', 'Tot està configurat correctament. Els teus convidats poden accedir al teu web des d''aquesta adreça.'),
  ('builder.domain.verified_subtitle', 'ar', 'كل شيء مُعد بشكل صحيح. يمكن لضيوفك الوصول إلى موقعك من هذا العنوان.'),
  ('builder.domain.verified_subtitle', 'fr', 'Tout est configuré correctement. Vos invités peuvent accéder à votre site à cette adresse.'),
  ('builder.domain.verified_subtitle', 'de', 'Alles ist korrekt konfiguriert. Deine Gäste können deine Seite unter dieser Adresse erreichen.'),
  ('builder.domain.verified_subtitle', 'pt', 'Tudo está configurado corretamente. Seus convidados podem acessar seu site neste endereço.'),
  ('builder.domain.verified_subtitle', 'ru', 'Всё настроено правильно. Ваши гости могут перейти на ваш сайт по этому адресу.'),
  ('builder.domain.verified_subtitle', 'it', 'Tutto è configurato correttamente. I tuoi ospiti possono accedere al tuo sito a questo indirizzo.'),

  -- builder.domain.visit_site
  ('builder.domain.visit_site', 'en', 'Visit Site'),
  ('builder.domain.visit_site', 'zh', '访问网站'),
  ('builder.domain.visit_site', 'hi', 'साइट पर जाएं'),
  ('builder.domain.visit_site', 'es', 'Visitar sitio'),
  ('builder.domain.visit_site', 'ca', 'Visita el web'),
  ('builder.domain.visit_site', 'ar', 'زيارة الموقع'),
  ('builder.domain.visit_site', 'fr', 'Visiter le site'),
  ('builder.domain.visit_site', 'de', 'Seite besuchen'),
  ('builder.domain.visit_site', 'pt', 'Visitar site'),
  ('builder.domain.visit_site', 'ru', 'Перейти на сайт'),
  ('builder.domain.visit_site', 'it', 'Visita il sito'),

  -- builder.domain.dns_settings
  ('builder.domain.dns_settings', 'en', 'DNS Settings'),
  ('builder.domain.dns_settings', 'zh', 'DNS 设置'),
  ('builder.domain.dns_settings', 'hi', 'DNS सेटिंग्स'),
  ('builder.domain.dns_settings', 'es', 'Ajustes DNS'),
  ('builder.domain.dns_settings', 'ca', 'Configuració DNS'),
  ('builder.domain.dns_settings', 'ar', 'إعدادات DNS'),
  ('builder.domain.dns_settings', 'fr', 'Paramètres DNS'),
  ('builder.domain.dns_settings', 'de', 'DNS-Einstellungen'),
  ('builder.domain.dns_settings', 'pt', 'Configurações DNS'),
  ('builder.domain.dns_settings', 'ru', 'Настройки DNS'),
  ('builder.domain.dns_settings', 'it', 'Impostazioni DNS'),

  -- builder.domain.show_instructions
  ('builder.domain.show_instructions', 'en', 'Show me how'),
  ('builder.domain.show_instructions', 'zh', '告诉我怎么做'),
  ('builder.domain.show_instructions', 'hi', 'मुझे दिखाएं कैसे'),
  ('builder.domain.show_instructions', 'es', 'Enséñame cómo'),
  ('builder.domain.show_instructions', 'ca', 'Mostra''m com fer-ho'),
  ('builder.domain.show_instructions', 'ar', 'أرني الطريقة'),
  ('builder.domain.show_instructions', 'fr', 'Montrez-moi comment'),
  ('builder.domain.show_instructions', 'de', 'Zeig mir wie'),
  ('builder.domain.show_instructions', 'pt', 'Mostre-me como'),
  ('builder.domain.show_instructions', 'ru', 'Покажите как'),
  ('builder.domain.show_instructions', 'it', 'Mostrami come')

ON CONFLICT ON CONSTRAINT unique_key_locale_builder DO UPDATE SET
  value = EXCLUDED.value,
  updated_at = now();

COMMIT;
