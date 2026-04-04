import type { TranslationDictionary } from "@/4-shared/types";

export interface FAQQuestion {
  q: string;
  a: string;
}

export interface FAQCategory {
  key: string;
  title: string;
  questions: FAQQuestion[];
}

export function faqCategories(t: TranslationDictionary): FAQCategory[] {
  return [
    {
      key: "general",
      title: t["marketing.faq.category.general.title"] ?? "General",
      questions: [
        {
          q:
            t["marketing.faq.general.what_is_wedding_web"] ??
            "What is Wedding-Web?",
          a:
            t["marketing.faq.general.what_is_wedding_web.answer"] ??
            "WeddWeb is a 2026-native SaaS platform for creating multilingual wedding websites. It supports 11 languages, custom domains, event schedules, accommodation info, and RSVP tools — all in one URL.",
        },
        {
          q: t["marketing.faq.general.is_it_free"] ?? "Is WeddWeb free?",
          a:
            t["marketing.faq.general.is_it_free.answer"] ??
            "WeddWeb offers a permanent Free plan with one language, a custom subdomain, and all core features. A Premium plan unlocks custom domains and additional languages.",
        },
        {
          q:
            t["marketing.faq.general.site_lifetime"] ??
            "How long will my site remain online?",
          a:
            t["marketing.faq.general.site_lifetime.answer"] ??
            "Your WeddWeb site stays online permanently as long as weddweb.com exists — no expiry date on Free or Premium plans.",
        },
        {
          q:
            t["marketing.faq.general.features"] ??
            "What features does WeddWeb offer?",
          a:
            t["marketing.faq.general.features.answer"] ??
            "WeddWeb provides RSVP management (coming soon), event schedule, accommodation info, custom domains, multi-language support, and more. Some features are in development and will be released soon.",
        },
        {
          q:
            t["marketing.faq.general.custom_domain"] ??
            "Can I use my own domain?",
          a:
            t["marketing.faq.general.custom_domain.answer"] ??
            "Yes, you can use a custom domain with a paid plan.",
        },
        {
          q:
            t["marketing.faq.general.seo"] ??
            "Can I control if my site appears in search engines?",
          a:
            t["marketing.faq.general.seo.answer"] ??
            "Yes, you can enable or disable SEO indexing for your site in the settings.",
        },
        {
          q:
            t["marketing.faq.general.privacy"] ??
            "Is my data secure and private?",
          a:
            t["marketing.faq.general.privacy.answer"] ??
            "Yes, all data is securely stored and privacy is a top priority.",
        },
        {
          q: t["marketing.faq.general.mobile"] ?? "Is WeddWeb mobile-friendly?",
          a:
            t["marketing.faq.general.mobile.answer"] ??
            "Yes, all sites are fully responsive and mobile-ready.",
        },
        {
          q: t["marketing.faq.general.support"] ?? "How do I get support?",
          a:
            t["marketing.faq.general.support.answer"] ??
            "You can contact our team via the support form or email for help.",
        },
      ],
    },
    {
      key: "planning",
      title: t["marketing.faq.category.planning.title"] ?? "Wedding Planning",
      questions: [
        {
          q:
            t["marketing.faq.planning.can_i_manage_guests"] ??
            "Can I manage my guest list?",
          a:
            t["marketing.faq.planning.can_i_manage_guests.answer"] ??
            "This feature is coming soon. Basic guest management will be available for free, and extended options for premium users in a future release.",
        },
        {
          q:
            t["marketing.faq.planning.can_i_add_schedule"] ??
            "Can I add a wedding schedule?",
          a:
            t["marketing.faq.planning.can_i_add_schedule.answer"] ??
            "Yes! Add ceremony, reception, and event details for your guests.",
        },
        {
          q:
            t["marketing.faq.planning.accommodation"] ??
            "Can I share accommodation and travel info?",
          a:
            t["marketing.faq.planning.accommodation.answer"] ??
            "Yes, you can add recommended hotels, directions, and travel tips.",
        },
        {
          q:
            t["marketing.faq.planning.gallery"] ?? "Can I add a photo gallery?",
          a:
            t["marketing.faq.planning.gallery.answer"] ??
            "This feature is coming soon for premium users only.",
        },
        {
          q:
            t["marketing.faq.planning.customize"] ??
            "Can I customize the look of my site?",
          a:
            t["marketing.faq.planning.customize.answer"] ??
            "Currently, WeddWeb offers one beautiful template. More customization options may be added in the future.",
        },
        {
          q:
            t["marketing.faq.planning.multilingual"] ??
            "Can I create a multilingual site?",
          a:
            t["marketing.faq.planning.multilingual.answer"] ??
            "Yes. WeddWeb natively supports 11 languages (en, es, fr, de, it, pt, ca, nl, pl, tr, el) with AI-ready sub-second performance and global accessibility built in.",
        },
      ],
    },
    {
      key: "services",
      title: t["marketing.faq.category.services.title"] ?? "Related Services",
      questions: [
        {
          q:
            t["marketing.faq.services.can_i_link_registry"] ??
            "Can I link my gift registry?",
          a:
            t["marketing.faq.services.can_i_link_registry.answer"] ??
            "You can add links to any registry, honeymoon fund, or charity.",
        },
        {
          q:
            t["marketing.faq.services.can_i_collect_cash"] ??
            "Can I collect cash gifts or payments?",
          a:
            t["marketing.faq.services.can_i_collect_cash.answer"] ??
            "Yes, you can add bank details, PayPal, Bizum, Venmo, or other payment methods.",
        },
        {
          q:
            t["marketing.faq.services.venues"] ??
            "Can I recommend venues or restaurants?",
          a:
            t["marketing.faq.services.venues.answer"] ??
            "You can add venue details, maps, and recommendations for guests.",
        },
        {
          q:
            t["marketing.faq.services.digital_invites"] ??
            "Can I send digital invitations?",
          a:
            t["marketing.faq.services.digital_invites.answer"] ??
            "No, we do not offer this feature yet.",
        },
        // {
        //   q:
        //     t["marketing.faq.services.book_vendor"] ??
        //     "Can I book a photographer or vendor through WeddWeb?",
        //   a:
        //     t["marketing.faq.services.book_vendor.answer"] ??
        //     "WeddWeb does not directly book vendors, and does not offer vendor recommendation features.",
        // },
        // {
        //   q:
        //     t["marketing.faq.services.add_vendor"] ??
        //     "Can I add a videomaker or other service?",
        //   a:
        //     t["marketing.faq.services.add_vendor.answer"] ??
        //     "Currently, you cannot add vendor or service info for your guests to see.",
        // },
      ],
    },
    {
      key: "technical",
      title:
        t["marketing.faq.category.technical.title"] ?? "Technical & Account",
      questions: [
        {
          q:
            t["marketing.faq.technical.change_email"] ??
            "How do I change my email or password?",
          a:
            t["marketing.faq.technical.change_email.answer"] ??
            "You can update your account info in the profile section.",
        },
        {
          q:
            t["marketing.faq.technical.delete_account"] ??
            "Can I delete my account?",
          a:
            t["marketing.faq.technical.delete_account.answer"] ??
            "Yes, you can permanently delete your account from your dashboard.",
        },
        {
          q:
            t["marketing.faq.technical.plan_limits"] ??
            "What happens if I reach my plan limits?",
          a:
            t["marketing.faq.technical.plan_limits.answer"] ??
            "You’ll be notified and can upgrade at any time for more features.",
        },
      ],
    },
  ];
}
