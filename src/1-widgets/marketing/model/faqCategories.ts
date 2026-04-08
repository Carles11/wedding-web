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
      title: t["marketing.faq.category.general.title"] ?? "Getting Started",
      questions: [
        {
          q:
            t["marketing.faq.general.what_is_wedding_web"] ??
            "What exactly is WeddWeb?",
          a:
            t["marketing.faq.general.what_is_wedding_web.answer"] ??
            "WeddWeb is a wedding website platform built for the global family. Create your site in minutes, build it in up to 11 native scripts, and keep it online forever—on your own domain or subdomain.",
        },
        {
          q:
            t["marketing.faq.general.is_it_free"] ??
            "Is WeddWeb really free to start?",
          a:
            t["marketing.faq.general.is_it_free.answer"] ??
            "Yes. The Free plan gives you a permanent wedding website on a custom subdomain, core features, and one language—no credit card required. The Premium plan is a single one-time payment that unlocks your own custom domain, all 11 languages to add your own translations, and unlimited content.",
        },
        {
          q:
            t["marketing.faq.general.site_lifetime"] ??
            "How long will our site stay online?",
          a:
            t["marketing.faq.general.site_lifetime.answer"] ??
            "Your site stays online permanently — no expiry date on Free or Premium. Think of it as a digital keepsake, not a rental. Free sites remain fully viewable forever; editing is paused after 6 months of inactivity. Every subdomain and custom domain will remain online as long as weddweb.com continues its activity, and we have no plans to shut down. In the unlikely event of a shutdown, we will provide ample notice and tools to export your content.",
        },
        {
          q:
            t["marketing.faq.general.features"] ??
            "What can we do with WeddWeb?",
          a:
            t["marketing.faq.general.features.answer"] ??
            "Build a beautiful wedding website with a custom event schedule, accommodation info, gift registry links, multilingual support, and more. RSVP tools and a photo gallery are on the way — your site options will grow with every release.",
        },
        {
          q:
            t["marketing.faq.general.custom_domain"] ??
            "Can we use our own domain name?",
          a:
            t["marketing.faq.general.custom_domain.answer"] ??
            "Yes. With a Premium plan, you can connect any custom domain — so your site lives at yourdomain.com, not a generic URL. One payment, your domain, forever (or until weddweb.com continues its activity).",
        },
        {
          q:
            t["marketing.faq.general.seo"] ??
            "Can we control whether our site appears in search results?",
          a:
            t["marketing.faq.general.seo.answer"] ??
            "Completely. By default all sites rank on search engines. Free users cannot disable SEO indexing. As a premium user, you decide — keep SEO indexing enabled so guests can find you via Google, or keep it private. One toggle in your settings.",
        },
        {
          q: t["marketing.faq.general.privacy"] ?? "Is our data safe?",
          a:
            t["marketing.faq.general.privacy.answer"] ??
            "Yes. All data is encrypted and securely stored. Your guest information and event details are yours alone — we never sell or share them.",
        },
        {
          q:
            t["marketing.faq.general.mobile"] ??
            "Does WeddWeb work on phones and tablets?",
          a:
            t["marketing.faq.general.mobile.answer"] ??
            "Every WeddWeb site is fully responsive — it looks beautiful on any device, screen size, or browser, without any extra setup.",
        },
        {
          q:
            t["marketing.faq.general.support"] ??
            "How do we get help if we need it?",
          a:
            t["marketing.faq.general.support.answer"] ??
            "Have a question? Email me at carles@rio-frances.com — I'm Carles, the developer behind WeddWeb, and I reply to every message personally.",
        },
      ],
    },
    {
      key: "planning",
      title: t["marketing.faq.category.planning.title"] ?? "Planning Your Day",
      questions: [
        {
          q:
            t["marketing.faq.planning.can_i_manage_guests"] ??
            "Can we manage our guest list?",
          a:
            t["marketing.faq.planning.can_i_manage_guests.answer"] ??
            "Guest management is coming soon. Free users will get basic RSVP functionality; Premium users will unlock extended tools including RSVP tracking and attendance counts.",
        },
        {
          q:
            t["marketing.faq.planning.can_i_add_schedule"] ??
            "Can we add our full wedding schedule?",
          a:
            t["marketing.faq.planning.can_i_add_schedule.answer"] ??
            "Yes. Add your ceremony, cocktail hour, reception, and any other event with dates, times, locations, and details — so every guest knows exactly where to be and when.",
        },
        {
          q:
            t["marketing.faq.planning.accommodation"] ??
            "Can we share hotel and travel info?",
          a:
            t["marketing.faq.planning.accommodation.answer"] ??
            "Absolutely. Add recommended hotels, transport options, parking info, and directions so no guest is left without a plan for the weekend.",
        },
        {
          q:
            t["marketing.faq.planning.gallery"] ??
            "Can we add a photo gallery?",
          a:
            t["marketing.faq.planning.gallery.answer"] ??
            "A photo gallery is coming soon, exclusively for Premium users. The perfect place to share your engagement shoot or wedding-day memories.",
        },
        {
          q:
            t["marketing.faq.planning.customize"] ??
            "Can we customize how our site looks?",
          a:
            t["marketing.faq.planning.customize.answer"] ??
            "The template we offer today was crafted for a real wedding — mine, in February 2026 — the spark that led me to create WeddWeb. More templates for both Free and Premium plans are on the way.",
        },
        {
          q:
            t["marketing.faq.planning.multilingual"] ??
            "Can our site be in multiple languages?",
          a:
            t["marketing.faq.planning.multilingual.answer"] ??
            "Yes — and it's one of WeddWeb's defining strengths. Your site supports up to 11 languages, so every guest — wherever they are in the world — can read it in their own.",
        },
        {
          q:
            t["marketing.faq.planning.multilingual.how"] ??
            "How does the multilingual feature work?",
          a:
            t["marketing.faq.planning.multilingual.how.answer"] ??
            "WeddWeb's interface and website builder are already available in 11 languages — so your guests and you will always feel at home. The content of your wedding site itself — your story, details, and messages — is written by you, in whichever languages you choose. Want your site in three languages? You add the content for each one. It takes a little extra effort, but every word stays authentically yours. AI-assisted translation is on our roadmap to make this seamless in the near future.",
        },
      ],
    },
    {
      key: "services",
      title: t["marketing.faq.category.services.title"] ?? "Gifts & Services",
      questions: [
        {
          q:
            t["marketing.faq.services.can_i_link_registry"] ??
            "Can we add our gift registry?",
          a:
            t["marketing.faq.services.can_i_link_registry.answer"] ??
            "Yes. You can add payment methods directly — PayPal, bank transfer, Bizum, Venmo — as well as links to any external registry: Amazon, Zola, a honeymoon fund, a charity, or anywhere else you'd like your guests to go.",
        },
        {
          q:
            t["marketing.faq.services.can_i_collect_cash"] ??
            "Can we accept cash gifts or bank transfers?",
          a:
            t["marketing.faq.services.can_i_collect_cash.answer"] ??
            "Yes. Add your bank details (IBAN/SWIFT), Bizum, PayPal, or Venmo directly to your site. Guests send money straight to you — no middleman, no fees from us.",
        },
        {
          q:
            t["marketing.faq.services.venues"] ??
            "Can we recommend venues or restaurants for our guests?",
          a:
            t["marketing.faq.services.venues.answer"] ??
            "Yes. Add venue details, maps, restaurant recommendations, and any other local tips so your guests can make the most of the trip.",
        },
        {
          q:
            t["marketing.faq.services.digital_invites"] ??
            "Can we send digital save-the-dates or invitations?",
          a:
            t["marketing.faq.services.digital_invites.answer"] ??
            "Not yet — dedicated digital invitations are coming. In the meantime, your wedding site works beautifully as a shareable link you can send to guests via WhatsApp, email, or social media.",
        },
      ],
    },
    {
      key: "technical",
      title: t["marketing.faq.category.technical.title"] ?? "Your Account",
      questions: [
        {
          q:
            t["marketing.faq.technical.change_email"] ??
            "How do we update our email address or password?",
          a:
            t["marketing.faq.technical.change_email.answer"] ??
            "You can update your email address and password at any time from the account section of your dashboard.",
        },
        {
          q:
            t["marketing.faq.technical.delete_account"] ??
            "Can we permanently delete our account?",
          a:
            t["marketing.faq.technical.delete_account.answer"] ??
            "Yes. You can permanently delete your account and all associated data from your account settings. This action is irreversible, so please make sure you're ready before proceeding.",
        },
        {
          q:
            t["marketing.faq.technical.plan_limits"] ??
            "What happens when we hit our free plan's limits?",
          a:
            t["marketing.faq.technical.plan_limits.answer"] ??
            "When you reach a limit, WeddWeb will let you know and give you the option to upgrade to Premium — a single one-time payment that removes all content limits permanently. No subscriptions, no renewals.",
        },
      ],
    },
  ];
}
