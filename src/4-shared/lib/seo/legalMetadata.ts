import type { SupportedLanguage } from "@/4-shared/config/i18n";

export interface LegalMetaTranslation {
  privacyTitle: string;
  privacyDesc: string;
  privacyPageName: string;
  termsTitle: string;
  termsDesc: string;
  termsPageName: string;
  cookieTitle: string;
  cookieDesc: string;
  cookiePageName: string;
}

export const legalTranslations: Record<
  SupportedLanguage,
  LegalMetaTranslation
> = {
  en: {
    privacyTitle: "Privacy Policy | WeddWeb",
    privacyDesc:
      "Read WeddWeb's Privacy Policy to learn how we collect, use, and protect your data, what choices and rights you have, and how we meet global privacy requirements.",
    termsTitle: "Terms of Service | WeddWeb",
    termsDesc:
      "Review WeddWeb's Terms of Service for clear, fair, and transparent rules. Understand your rights, responsibilities, and our commitment to your experience.",
    cookieTitle: "Cookie Policy | WeddWeb",
    cookieDesc:
      "Read WeddWeb's Cookie Policy to learn which cookies and similar technologies we use, why we use them, and how you can manage consent settings and preferences.",
    privacyPageName: "Privacy Policy",
    termsPageName: "Terms of Service",
    cookiePageName: "Cookie Policy",
  },
  zh: {
    privacyTitle: "隐私政策 | WeddWeb",
    privacyDesc:
      "阅读 WeddWeb 的隐私政策，了解我们如何收集、使用、保护与共享您的数据，您享有哪些权利与选择，以及我们如何满足全球隐私要求、数据处理义务与透明度标准，帮助您在使用网站、提交信息、管理婚礼内容和邀请宾客时，更清楚了解个人信息的处理方式、保存范围、访问控制、删除请求流程与联系方式，让您在使用服务时更安心地管理隐私与账号数据。",
    termsTitle: "服务条款 | WeddWeb",
    termsDesc:
      "阅读 WeddWeb 的服务条款，了解平台使用规则、您的权利与责任，以及我们如何处理访问权限、用户内容、付款安排、可接受使用、账户限制、服务变更与相关法律义务。页面会帮助您在创建婚礼网站、邀请宾客、管理内容和使用付费功能前，更清楚掌握双方责任、服务边界、退款规则与合规要求，减少误解与后续纠纷风险。",
    cookieTitle: "Cookie 政策 | WeddWeb",
    cookieDesc:
      "阅读 WeddWeb 的 Cookie 政策，了解我们使用哪些 Cookie 与类似技术、各自用途、保存时间，以及您如何管理同意、偏好设置、分析选项与浏览器控制。页面也会说明必要 Cookie 与可选 Cookie 的区别，以及如何更新授权与站点设置，帮助您更清楚地管理隐私选择与站点体验，更安心些。",
    privacyPageName: "隐私政策",
    termsPageName: "服务条款",
    cookiePageName: "Cookie 政策",
  },
  hi: {
    privacyTitle: "गोपनीयता नीति | WeddWeb",
    privacyDesc:
      "WeddWeb की गोपनीयता नीति पढ़ें और जानें कि हम डेटा कैसे इकट्ठा, इस्तेमाल और सुरक्षित करते हैं, आपके अधिकार क्या हैं और हम global privacy rules का पालन कैसे करते हैं।",
    termsTitle: "सेवा की शर्तें | WeddWeb",
    termsDesc:
      "WeddWeb की सेवा शर्तें पढ़ें और समझें कि platform use के नियम, आपके अधिकार, जिम्मेदारियां, access, content, payment और legal obligations कैसे तय किए जाते हैं।",
    cookieTitle: "कुकी नीति | WeddWeb",
    cookieDesc:
      "WeddWeb की कुकी नीति पढ़ें और जानें कि हम कौन सी कुकीज़ व तकनीकें इस्तेमाल करते हैं, उनका उद्देश्य क्या है और आप सहमति व प्राथमिकताएं कैसे नियंत्रित करें।",
    privacyPageName: "गोपनीयता नीति",
    termsPageName: "सेवा की शर्तें",
    cookiePageName: "कुकी नीति",
  },
  es: {
    privacyTitle: "Política de Privacidad | WeddWeb",
    privacyDesc:
      "Lee la Política de Privacidad de WeddWeb para saber cómo recopilamos, usamos y protegemos tus datos, qué derechos tienes y cómo cumplimos requisitos globales.",
    termsTitle: "Términos de Servicio | WeddWeb",
    termsDesc:
      "Consulta los Términos de Servicio de WeddWeb para entender reglas de uso, derechos, responsabilidades y cómo gestionamos acceso, contenido, pagos y obligaciones legales.",
    cookieTitle: "Política de Cookies | WeddWeb",
    cookieDesc:
      "Descubre cómo WeddWeb utiliza cookies y tecnologías similares para mejorar tu experiencia. Transparencia total y cumplimiento de los estándares globales.",
    privacyPageName: "Política de Privacidad",
    termsPageName: "Términos de Servicio",
    cookiePageName: "Política de Cookies",
  },
  ca: {
    privacyTitle: "Política de Privacitat | WeddWeb",
    privacyDesc:
      "Llegeix la Política de Privacitat de WeddWeb per saber com recopilem, utilitzem i protegim les teves dades, quins drets tens i com complim els requisits globals.",
    termsTitle: "Termes del Servei | WeddWeb",
    termsDesc:
      "Consulta els Termes del Servei de WeddWeb per entendre les regles d'ús, els teus drets i responsabilitats, i com gestionem accés, contingut, pagaments i obligacions legals.",
    cookieTitle: "Política de Cookies | WeddWeb",
    cookieDesc:
      "Descobreix com WeddWeb utilitza cookies i tecnologies similars per millorar la teva experiència. Transparència total i conformitat amb els estàndards globals.",
    privacyPageName: "Política de Privacitat",
    termsPageName: "Termes del Servei",
    cookiePageName: "Política de Cookies",
  },
  ar: {
    privacyTitle: "سياسة الخصوصية | WeddWeb",
    privacyDesc:
      "اقرأ سياسة الخصوصية في WeddWeb لتعرف كيف نجمع بياناتك ونستخدمها ونحميها، وما حقوقك وخياراتك، وكيف نلتزم بمتطلبات الخصوصية والشفافية الدولية.",
    termsTitle: "شروط الخدمة | WeddWeb",
    termsDesc:
      "راجع شروط خدمة WeddWeb لتفهم قواعد استخدام المنصة وحقوقك ومسؤولياتك، وما الذي نتوقعه من المستخدمين، وكيف يتم تنظيم الوصول، والمحتوى، والدفع، والالتزامات القانونية بوضوح.",
    cookieTitle: "سياسة ملفات تعريف الارتباط | WeddWeb",
    cookieDesc:
      "اقرأ سياسة ملفات تعريف الارتباط في WeddWeb لتعرف أنواع ملفات الارتباط والتقنيات المشابهة التي نستخدمها، ولماذا نستخدمها، وكيف تدير موافقتك وتفضيلاتك بوضوح.",
    privacyPageName: "سياسة الخصوصية",
    termsPageName: "شروط الخدمة",
    cookiePageName: "سياسة ملفات تعريف الارتباط",
  },
  fr: {
    privacyTitle: "Politique de Confidentialité | WeddWeb",
    privacyDesc:
      "Lisez la Politique de Confidentialité de WeddWeb pour savoir comment nous collectons, utilisons et protégeons vos données, vos droits, et notre conformité globale.",
    termsTitle: "Conditions d'Utilisation | WeddWeb",
    termsDesc:
      "Consultez les Conditions d'utilisation de WeddWeb pour comprendre les règles d'usage, vos droits et responsabilités, ainsi que l'accès, le contenu, le paiement et nos obligations.",
    cookieTitle: "Politique de Cookies | WeddWeb",
    cookieDesc:
      "Lisez la Politique de cookies de WeddWeb pour savoir quels cookies et technologies similaires nous utilisons, pourquoi, et comment gérer votre consentement.",
    privacyPageName: "Politique de Confidentialité",
    termsPageName: "Conditions d'Utilisation",
    cookiePageName: "Politique de Cookies",
  },
  de: {
    privacyTitle: "Datenschutzrichtlinie | WeddWeb",
    privacyDesc:
      "Lesen Sie die Datenschutzrichtlinie von WeddWeb, um zu erfahren, wie wir Daten erfassen, nutzen und schützen, welche Rechte Sie haben und wie wir Vorschriften einhalten.",
    termsTitle: "Nutzungsbedingungen | WeddWeb",
    termsDesc:
      "Lesen Sie die Nutzungsbedingungen von WeddWeb, um Regeln, Rechte, Pflichten sowie Zugang, Inhalte, Zahlungen und rechtliche Bedingungen klar zu verstehen.",
    cookieTitle: "Cookie-Richtlinie | WeddWeb",
    cookieDesc:
      "Lesen Sie die Cookie-Richtlinie von WeddWeb, um zu erfahren, welche Cookies und ähnlichen Technologien wir nutzen, warum und wie Sie Einwilligungen verwalten.",
    privacyPageName: "Datenschutzrichtlinie",
    termsPageName: "Nutzungsbedingungen",
    cookiePageName: "Cookie-Richtlinie",
  },
  pt: {
    privacyTitle: "Política de Privacidade | WeddWeb",
    privacyDesc:
      "Leia a Política de Privacidade da WeddWeb para saber como recolhemos, usamos e protegemos os seus dados, que direitos tem e como cumprimos requisitos globais.",
    termsTitle: "Termos de Serviço | WeddWeb",
    termsDesc:
      "Consulte os Termos de Serviço da WeddWeb para compreender regras de uso, direitos, responsabilidades e como tratamos acesso, conteúdo, pagamentos e obrigações legais.",
    cookieTitle: "Política de Cookies | WeddWeb",
    cookieDesc:
      "Leia a Política de Cookies da WeddWeb para saber que cookies e tecnologias semelhantes usamos, por que os usamos e como pode gerir consentimento e preferências.",
    privacyPageName: "Política de Privacidade",
    termsPageName: "Termos de Serviço",
    cookiePageName: "Política de Cookies",
  },
  ru: {
    privacyTitle: "Политика конфиденциальности | WeddWeb",
    privacyDesc:
      "Прочитайте Политику конфиденциальности WeddWeb, чтобы узнать, как мы собираем, используем и защищаем данные, какие права у вас есть и как мы соблюдаем требования.",
    termsTitle: "Условия использования | WeddWeb",
    termsDesc:
      "Прочитайте Условия использования WeddWeb, чтобы понять правила сервиса, свои права и обязанности, а также как регулируются доступ, контент, платежи и юридические условия.",
    cookieTitle: "Политика в отношении файлов cookie | WeddWeb",
    cookieDesc:
      "Прочитайте Политику cookie WeddWeb, чтобы узнать, какие cookie и похожие технологии мы используем, зачем они нужны и как управлять согласием и настройками.",
    privacyPageName: "Политика конфиденциальности",
    termsPageName: "Условия использования",
    cookiePageName: "Политика в отношении файлов cookie",
  },
  it: {
    privacyTitle: "Informativa sulla Privacy | WeddWeb",
    privacyDesc:
      "Leggi la Privacy Policy di WeddWeb per sapere come raccogliamo, utilizziamo e proteggiamo i dati, quali diritti hai e come rispettiamo i requisiti globali.",
    termsTitle: "Termini di Servizio | WeddWeb",
    termsDesc:
      "Consulta i Termini di Servizio di WeddWeb per capire regole d'uso, diritti, responsabilità e come gestiamo accesso, contenuti, pagamenti e obblighi legali.",
    cookieTitle: "Politica sui Cookie | WeddWeb",
    cookieDesc:
      "Scopri come WeddWeb utilizza i cookie e tecnologie simili per migliorare la tua esperienza. Piena trasparenza e conformità agli standard globali.",
    privacyPageName: "Informativa sulla Privacy",
    termsPageName: "Termini di Servizio",
    cookiePageName: "Politica sui Cookie",
  },
};
