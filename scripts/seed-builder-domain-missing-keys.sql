-- Insert/update domain keys that are missing or need a value refresh
-- Target table: global_translations_builder (row-per-locale: key, locale, value)

BEGIN;

INSERT INTO public.global_translations_builder (key, locale, value) VALUES
  -- builder.domain.dns_instructions_label
  ('builder.domain.dns_instructions_label', 'en', 'DNS Instructions'),
  ('builder.domain.dns_instructions_label', 'es', 'Instrucciones DNS'),
  ('builder.domain.dns_instructions_label', 'ca', 'Instruccions DNS'),
  ('builder.domain.dns_instructions_label', 'zh', 'DNS 说明'),
  ('builder.domain.dns_instructions_label', 'hi', 'DNS निर्देश'),
  ('builder.domain.dns_instructions_label', 'ar', 'تعليمات DNS'),
  ('builder.domain.dns_instructions_label', 'fr', 'Instructions DNS'),
  ('builder.domain.dns_instructions_label', 'de', 'DNS-Anweisungen'),
  ('builder.domain.dns_instructions_label', 'pt', 'Instruções DNS'),
  ('builder.domain.dns_instructions_label', 'ru', 'Инструкции DNS'),
  ('builder.domain.dns_instructions_label', 'it', 'Istruzioni DNS'),

  -- builder.domain.custom_domain_checked
  ('builder.domain.custom_domain_checked', 'en', 'Status checked!'),
  ('builder.domain.custom_domain_checked', 'es', '¡Estado verificado!'),
  ('builder.domain.custom_domain_checked', 'ca', 'Estat verificat!'),
  ('builder.domain.custom_domain_checked', 'zh', '状态已检查！'),
  ('builder.domain.custom_domain_checked', 'hi', 'स्थिति जांची गई!'),
  ('builder.domain.custom_domain_checked', 'ar', 'تم فحص الحالة!'),
  ('builder.domain.custom_domain_checked', 'fr', 'Statut vérifié !'),
  ('builder.domain.custom_domain_checked', 'de', 'Status überprüft!'),
  ('builder.domain.custom_domain_checked', 'pt', 'Status verificado!'),
  ('builder.domain.custom_domain_checked', 'ru', 'Статус проверен!'),
  ('builder.domain.custom_domain_checked', 'it', 'Stato verificato!'),

  -- builder.domain.dns_modal.section_diy (refresh)
  ('builder.domain.dns_modal.section_diy', 'en', 'Add these records at your registrar'),
  ('builder.domain.dns_modal.section_diy', 'es', 'Añade estos registros en tu registrador'),
  ('builder.domain.dns_modal.section_diy', 'ca', 'Afegeix aquests registres al teu registrador'),
  ('builder.domain.dns_modal.section_diy', 'zh', '在您的注册商处添加这些记录'),
  ('builder.domain.dns_modal.section_diy', 'hi', 'अपने रजिस्ट्रार पर ये रिकॉर्ड जोड़ें'),
  ('builder.domain.dns_modal.section_diy', 'ar', 'أضف هذه السجلات لدى مسجّل النطاق الخاص بك'),
  ('builder.domain.dns_modal.section_diy', 'fr', 'Ajoutez ces enregistrements chez votre bureau d''enregistrement'),
  ('builder.domain.dns_modal.section_diy', 'de', 'Fügen Sie diese Einträge bei Ihrem Registrar hinzu'),
  ('builder.domain.dns_modal.section_diy', 'pt', 'Adicione esses registros no seu registrador'),
  ('builder.domain.dns_modal.section_diy', 'ru', 'Добавьте эти записи у вашего регистратора'),
  ('builder.domain.dns_modal.section_diy', 'it', 'Aggiungi questi record presso il tuo registrar'),

  -- builder.domain.show_instructions (refresh)
  ('builder.domain.show_instructions', 'en', 'Show me how'),
  ('builder.domain.show_instructions', 'es', 'Enséñame cómo'),
  ('builder.domain.show_instructions', 'ca', 'Mostra''m com fer-ho'),
  ('builder.domain.show_instructions', 'zh', '告诉我怎么做'),
  ('builder.domain.show_instructions', 'hi', 'मुझे दिखाएं कैसे'),
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
