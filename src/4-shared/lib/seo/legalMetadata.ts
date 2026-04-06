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
      "Read WeddWeb's Privacy Policy to learn how we protect your data, respect your privacy, and comply with global regulations. Transparent, GDPR-ready, and privacy-first.",
    termsTitle: "Terms of Service | WeddWeb",
    termsDesc:
      "Review WeddWeb's Terms of Service for clear, fair, and transparent rules. Understand your rights, responsibilities, and our commitment to your experience.",
    cookieTitle: "Cookie Policy | WeddWeb",
    cookieDesc:
      "Learn how WeddWeb uses cookies and similar technologies to enhance your experience. Full transparency, user control, and compliance with global standards.",
    privacyPageName: "Privacy Policy",
    termsPageName: "Terms of Service",
    cookiePageName: "Cookie Policy",
  },
  zh: {
    privacyTitle: "隐私政策 | WeddWeb",
    privacyDesc:
      "阅读 WeddWeb 的隐私政策，了解我们如何保护您的数据、尊重您的隐私，并遵守全球法规。透明、符合 GDPR，隐私优先。",
    termsTitle: "服务条款 | WeddWeb",
    termsDesc:
      "查看 WeddWeb 的服务条款，了解清晰、公平的使用规则，明确您的权利与责任。",
    cookieTitle: "Cookie 政策 | WeddWeb",
    cookieDesc:
      "了解 WeddWeb 如何使用 Cookie 及类似技术来提升您的体验，完全透明并符合全球标准。",
    privacyPageName: "隐私政策",
    termsPageName: "服务条款",
    cookiePageName: "Cookie 政策",
  },
  hi: {
    privacyTitle: "गोपनीयता नीति | WeddWeb",
    privacyDesc:
      "WeddWeb की गोपनीयता नीति पढ़ें और जानें कि हम आपके डेटा की सुरक्षा कैसे करते हैं, आपकी गोपनीयता का सम्मान करते हैं और वैश्विक नियमों का पालन करते हैं।",
    termsTitle: "सेवा की शर्तें | WeddWeb",
    termsDesc:
      "WeddWeb की सेवा शर्तें पढ़ें — स्पष्ट, निष्पक्ष नियम जो आपके अधिकारों और जिम्मेदारियों को परिभाषित करते हैं।",
    cookieTitle: "कुकी नीति | WeddWeb",
    cookieDesc:
      "जानें कि WeddWeb आपकी अनुभव को बेहतर बनाने के लिए कुकीज़ और समान तकनीकों का उपयोग कैसे करता है। पूर्ण पारदर्शिता और वैश्विक मानकों का अनुपालन।",
    privacyPageName: "गोपनीयता नीति",
    termsPageName: "सेवा की शर्तें",
    cookiePageName: "कुकी नीति",
  },
  es: {
    privacyTitle: "Política de Privacidad | WeddWeb",
    privacyDesc:
      "Lee la Política de Privacidad de WeddWeb para saber cómo protegemos tus datos, respetamos tu privacidad y cumplimos con la normativa global, incluido el RGPD.",
    termsTitle: "Términos de Servicio | WeddWeb",
    termsDesc:
      "Consulta los Términos de Servicio de WeddWeb: reglas claras y justas que definen tus derechos y responsabilidades como usuario.",
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
      "Llegeix la Política de Privacitat de WeddWeb per saber com protegim les teves dades, respectem la teva privacitat i complim la normativa global, inclòs el RGPD.",
    termsTitle: "Termes del Servei | WeddWeb",
    termsDesc:
      "Consulta els Termes del Servei de WeddWeb: normes clares i justes que defineixen els teus drets i responsabilitats com a usuari.",
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
      "اقرأ سياسة الخصوصية الخاصة بـ WeddWeb لتعرف كيف نحمي بياناتك ونحترم خصوصيتك ونلتزم باللوائح العالمية بما فيها اللائحة الأوروبية لحماية البيانات.",
    termsTitle: "شروط الخدمة | WeddWeb",
    termsDesc:
      "راجع شروط خدمة WeddWeb — قواعد واضحة وعادلة تحدد حقوقك ومسؤولياتك كمستخدم.",
    cookieTitle: "سياسة ملفات تعريف الارتباط | WeddWeb",
    cookieDesc:
      "تعرف على كيفية استخدام WeddWeb لملفات تعريف الارتباط والتقنيات المماثلة لتحسين تجربتك. شفافية كاملة وامتثال للمعايير العالمية.",
    privacyPageName: "سياسة الخصوصية",
    termsPageName: "شروط الخدمة",
    cookiePageName: "سياسة ملفات تعريف الارتباط",
  },
  fr: {
    privacyTitle: "Politique de Confidentialité | WeddWeb",
    privacyDesc:
      "Lisez la Politique de Confidentialité de WeddWeb pour comprendre comment nous protégeons vos données, respectons votre vie privée et respectons les réglementations mondiales, incluant le RGPD.",
    termsTitle: "Conditions d'Utilisation | WeddWeb",
    termsDesc:
      "Consultez les Conditions d'Utilisation de WeddWeb : des règles claires et équitables définissant vos droits et responsabilités en tant qu'utilisateur.",
    cookieTitle: "Politique de Cookies | WeddWeb",
    cookieDesc:
      "Découvrez comment WeddWeb utilise les cookies et technologies similaires pour améliorer votre expérience. Transparence totale et conformité aux normes mondiales.",
    privacyPageName: "Politique de Confidentialité",
    termsPageName: "Conditions d'Utilisation",
    cookiePageName: "Politique de Cookies",
  },
  de: {
    privacyTitle: "Datenschutzrichtlinie | WeddWeb",
    privacyDesc:
      "Lesen Sie die Datenschutzrichtlinie von WeddWeb und erfahren Sie, wie wir Ihre Daten schützen, Ihre Privatsphäre respektieren und globale Vorschriften einschließlich der DSGVO einhalten.",
    termsTitle: "Nutzungsbedingungen | WeddWeb",
    termsDesc:
      "Lesen Sie die Nutzungsbedingungen von WeddWeb: klare, faire Regeln, die Ihre Rechte und Pflichten als Nutzer definieren.",
    cookieTitle: "Cookie-Richtlinie | WeddWeb",
    cookieDesc:
      "Erfahren Sie, wie WeddWeb Cookies und ähnliche Technologien einsetzt, um Ihr Erlebnis zu verbessern. Volle Transparenz und Einhaltung globaler Standards.",
    privacyPageName: "Datenschutzrichtlinie",
    termsPageName: "Nutzungsbedingungen",
    cookiePageName: "Cookie-Richtlinie",
  },
  pt: {
    privacyTitle: "Política de Privacidade | WeddWeb",
    privacyDesc:
      "Leia a Política de Privacidade da WeddWeb e saiba como protegemos os seus dados, respeitamos a sua privacidade e cumprimos as regulamentações globais, incluindo o RGPD.",
    termsTitle: "Termos de Serviço | WeddWeb",
    termsDesc:
      "Consulte os Termos de Serviço da WeddWeb: regras claras e justas que definem os seus direitos e responsabilidades como utilizador.",
    cookieTitle: "Política de Cookies | WeddWeb",
    cookieDesc:
      "Descubra como a WeddWeb utiliza cookies e tecnologias semelhantes para melhorar a sua experiência. Total transparência e conformidade com os padrões globais.",
    privacyPageName: "Política de Privacidade",
    termsPageName: "Termos de Serviço",
    cookiePageName: "Política de Cookies",
  },
  ru: {
    privacyTitle: "Политика конфиденциальности | WeddWeb",
    privacyDesc:
      "Ознакомьтесь с Политикой конфиденциальности WeddWeb и узнайте, как мы защищаем ваши данные, уважаем вашу приватность и соблюдаем мировые нормативные требования.",
    termsTitle: "Условия использования | WeddWeb",
    termsDesc:
      "Ознакомьтесь с Условиями использования WeddWeb: прозрачные и справедливые правила, определяющие ваши права и обязанности как пользователя.",
    cookieTitle: "Политика в отношении файлов cookie | WeddWeb",
    cookieDesc:
      "Узнайте, как WeddWeb использует файлы cookie и аналогичные технологии для улучшения вашего опыта. Полная прозрачность и соответствие мировым стандартам.",
    privacyPageName: "Политика конфиденциальности",
    termsPageName: "Условия использования",
    cookiePageName: "Политика в отношении файлов cookie",
  },
  it: {
    privacyTitle: "Informativa sulla Privacy | WeddWeb",
    privacyDesc:
      "Leggi l'Informativa sulla Privacy di WeddWeb per scoprire come proteggiamo i tuoi dati, rispettiamo la tua privacy e rispettiamo le normative globali, incluso il GDPR.",
    termsTitle: "Termini di Servizio | WeddWeb",
    termsDesc:
      "Consulta i Termini di Servizio di WeddWeb: regole chiare e trasparenti che definiscono i tuoi diritti e le tue responsabilità come utente.",
    cookieTitle: "Politica sui Cookie | WeddWeb",
    cookieDesc:
      "Scopri come WeddWeb utilizza i cookie e tecnologie simili per migliorare la tua esperienza. Piena trasparenza e conformità agli standard globali.",
    privacyPageName: "Informativa sulla Privacy",
    termsPageName: "Termini di Servizio",
    cookiePageName: "Politica sui Cookie",
  },
};
