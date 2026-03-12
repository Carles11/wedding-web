BEGIN;

WITH seed("key", en, zh, hi, es, ca, ar, fr, de, pt, ru, it) AS (
  VALUES
    ('builder.contact.reload', 'Reload', '重新加载', 'फिर से लोड करें', 'Recargar', 'Recarrega', 'إعادة التحميل', 'Recharger', 'Neu laden', 'Recarregar', 'Перезагрузить', 'Ricarica'),
    ('builder.contact.title', 'Contact', '联系', 'संपर्क', 'Contacto', 'Contacte', 'التواصل', 'Contact', 'Kontakt', 'Contato', 'Контакт', 'Contatto'),
    ('builder.contact.description', 'Provide the main contact details used for RSVP and site contact.', '提供用于回复出席和网站联系的主要联系信息。', 'RSVP और साइट संपर्क के लिए उपयोग किए जाने वाले मुख्य संपर्क विवरण दें।', 'Proporciona los datos de contacto principales que se usarán para el RSVP y el contacto del sitio.', 'Proporciona les dades de contacte principals que s''utilitzaran per a l''RSVP i el contacte del web.', 'قدّم بيانات الاتصال الرئيسية المستخدمة لتأكيد الحضور والتواصل عبر الموقع.', 'Fournissez les coordonnées principales utilisées pour le RSVP et le contact du site.', 'Geben Sie die wichtigsten Kontaktdaten an, die für RSVP und den Kontakt über die Website verwendet werden.', 'Forneca os dados de contato principais usados para RSVP e contato no site.', 'Укажите основные контактные данные для RSVP и связи через сайт.', 'Fornisci i contatti principali usati per RSVP e contatti del sito.'),
    ('builder.contact.image_label', 'Contact image', '联系图片', 'संपर्क छवि', 'Imagen de contacto', 'Imatge de contacte', 'صورة جهة الاتصال', 'Image de contact', 'Kontaktbild', 'Imagem de contato', 'Изображение контакта', 'Immagine di contatto'),
    ('builder.contact.image_alt', 'Contact', '联系', 'संपर्क', 'Contacto', 'Contacte', 'التواصل', 'Contact', 'Kontakt', 'Contato', 'Контакт', 'Contatto'),
    ('builder.contact.bride', 'Bride', '新娘', 'दुल्हन', 'Novia', 'Núvia', 'العروس', 'Mariée', 'Braut', 'Noiva', 'Невеста', 'Sposa'),
    ('builder.contact.groom', 'Groom', '新郎', 'दूल्हा', 'Novio', 'Nuvi', 'العريس', 'Marié', 'Bräutigam', 'Noivo', 'Жених', 'Sposo'),
    ('builder.contact.field.name', 'Name', '姓名', 'नाम', 'Nombre', 'Nom', 'الاسم', 'Nom', 'Name', 'Nome', 'Имя', 'Nome'),
    ('builder.contact.field.email', 'Email', '电子邮件', 'ईमेल', 'Email', 'Correu electrònic', 'البريد الإلكتروني', 'E-mail', 'E-Mail', 'Email', 'Эл. почта', 'Email'),
    ('builder.contact.field.phone_optional', 'Phone (optional)', '电话（可选）', 'फोन (वैकल्पिक)', 'Teléfono (opcional)', 'Telèfon (opcional)', 'الهاتف (اختياري)', 'Téléphone (optionnel)', 'Telefon (optional)', 'Telefone (opcional)', 'Телефон (необязательно)', 'Telefono (opzionale)'),
    ('builder.contact.preview_title', 'Contact section preview', '联系部分预览', 'संपर्क अनुभाग पूर्वावलोकन', 'Vista previa de la sección de contacto', 'Vista prèvia de la secció de contacte', 'معاينة قسم التواصل', 'Aperçu de la section contact', 'Vorschau des Kontaktbereichs', 'Pré-visualização da seção de contato', 'Предпросмотр раздела контактов', 'Anteprima della sezione contatti'),
    ('builder.contact.error.at_least_one', 'At least one partner must have a name and a valid email', '至少一位伴侣必须填写姓名和有效的电子邮件', 'कम से कम एक साथी के पास नाम और मान्य ईमेल होना चाहिए', 'Al menos una persona debe tener nombre y un email válido', 'Com a mínim una persona ha de tenir nom i un correu electrònic vàlid', 'يجب أن يحتوي شخص واحد على الأقل على اسم وبريد إلكتروني صالح', 'Au moins une personne doit avoir un nom et un e-mail valide', 'Mindestens eine Person muss einen Namen und eine gültige E-Mail haben', 'Pelo menos uma pessoa deve ter nome e um email válido', 'Хотя бы у одного человека должны быть имя и действительный email', 'Almeno una persona deve avere un nome e un indirizzo email valido'),
    ('builder.contact.error.phone_invalid', 'If provided, phone numbers must contain 7-15 digits', '如果填写，电话号码必须包含 7-15 位数字', 'यदि दिया गया है, तो फोन नंबर में 7-15 अंक होने चाहिए', 'Si se indican, los teléfonos deben contener entre 7 y 15 dígitos', 'Si s''indiquen, els telèfons han de contenir entre 7 i 15 dígits', 'إذا تم إدخالها، يجب أن تحتوي أرقام الهاتف على 7 إلى 15 رقمًا', 'S''ils sont renseignés, les numéros doivent contenir entre 7 et 15 chiffres', 'Wenn angegeben, müssen Telefonnummern 7 bis 15 Ziffern enthalten', 'Se informados, os telefones devem conter entre 7 e 15 dígitos', 'Если указаны, номера телефонов должны содержать от 7 до 15 цифр', 'Se forniti, i numeri di telefono devono contenere da 7 a 15 cifre')
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
