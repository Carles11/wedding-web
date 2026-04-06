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
            "What is WeddWeb?",
          a:
            t["marketing.faq.general.what_is_wedding_web.answer"] ??
            "WeddWeb is a wedding website builder where every couple gets a beautiful, multilingual site that lives online permanently. 11 languages, custom domains, RSVP tools, event schedules, and accommodation info — all in one place, for as long as you want it.",
        },
        {
          q: t["marketing.faq.general.is_it_free"] ?? "Is WeddWeb free?",
          a:
            t["marketing.faq.general.is_it_free.answer"] ??
            "Yes. WeddWeb has a permanent Free plan — no expiry date, no trial period. It includes one language, a custom subdomain, and all core features. Upgrade to Premium once, and unlock custom domains, more languages, and everything else — forever.",
        },
        {
          q:
            t["marketing.faq.general.site_lifetime"] ??
            "How long will our site stay online?",
          a:
            t["marketing.faq.general.site_lifetime.answer"] ??
            "Your site stays online permanently — no expiry date on Free or Premium. Think of it as a digital keepsake, not a rental. Free sites remain fully viewable forever; editing is paused after 6 months of inactivity.",
        },
        {
          q:
            t["marketing.faq.general.features"] ??
            "What can we do with WeddWeb?",
          a:
            t["marketing.faq.general.features.answer"] ??
            "Build a beautiful wedding website with a custom event schedule, accommodation info, gift registry links, multilingual support, and more. RSVP tools and a photo gallery are on the way — your site will grow with every release.",
        },
        {
          q:
            t["marketing.faq.general.custom_domain"] ??
            "Can we use our own domain name?",
          a:
            t["marketing.faq.general.custom_domain.answer"] ??
            "Yes. With a Premium plan, you can connect any custom domain — so your site lives at yourdomain.com, not a generic URL. One payment, your address, forever.",
        },
        {
          q:
            t["marketing.faq.general.seo"] ??
            "Can we control whether our site appears in search results?",
          a:
            t["marketing.faq.general.seo.answer"] ??
            "Completely. You decide — enable SEO indexing so guests can find you via Google, or keep it private. One toggle in your settings.",
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
            "Drop us an email anytime. We're a small, dedicated team — you'll hear from a real person, not a bot.",
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
            "Guest management is coming soon. Basic tools will be free; extended options — including RSVP tracking and attendance counts — are planned for Premium users.",
        },
        {
          q:
            t["marketing.faq.planning.can_i_add_schedule"] ??
            "Can we add our full wedding schedule?",
          a:
            t["marketing.faq.planning.can_i_add_schedule.answer"] ??
            "Yes. Add your ceremony, cocktail hour, reception, and any other event with times, locations, and details — so every guest knows exactly where to be and when.",
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
            "WeddWeb currently offers one beautifully crafted template — designed to feel timeless, not trendy. More design options are on the way.",
        },
        {
          q:
            t["marketing.faq.planning.multilingual"] ??
            "Can our site be in multiple languages?",
          a:
            t["marketing.faq.planning.multilingual.answer"] ??
            "Yes — and it's one of WeddWeb's defining strengths. Your site can be fully translated into up to 11 languages, so every guest — wherever they are in the world — reads it in their own language.",
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
            "Yes. Link to any registry — Amazon, Zola, John Lewis, a honeymoon fund, a charity — anywhere you want your guests to go.",
        },
        {
          q:
            t["marketing.faq.services.can_i_collect_cash"] ??
            "Can we accept cash gifts or bank transfers?",
          a:
            t["marketing.faq.services.can_i_collect_cash.answer"] ??
            "Yes. Add your bank details, Bizum, PayPal, Venmo, or any payment method directly on your site — no middleman, no fees from us.",
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
            "Not yet — but your wedding site itself acts as a living invitation guests can bookmark and return to. Formal digital invitations are on our roadmap.",
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
      title: t["marketing.faq.category.technical.title"] ?? "Your Account",
      questions: [
        {
          q:
            t["marketing.faq.technical.change_email"] ??
            "How do we update our email address or password?",
          a:
            t["marketing.faq.technical.change_email.answer"] ??
            "You can update your email address and password at any time from the Profile section of your dashboard.",
        },
        {
          q:
            t["marketing.faq.technical.delete_account"] ??
            "Can we permanently delete our account?",
          a:
            t["marketing.faq.technical.delete_account.answer"] ??
            "Yes. You can permanently delete your account and all associated data from your dashboard settings. This action is irreversible, so please make sure you're ready before proceeding.",
        },
        {
          q:
            t["marketing.faq.technical.plan_limits"] ??
            "What happens when we hit our plan's limits?",
          a:
            t["marketing.faq.technical.plan_limits.answer"] ??
            "You'll receive a clear in-app notification before and when you reach a limit. Upgrading to Premium is a single one-time payment that removes all content limits permanently—no subscriptions, no renewals.",
        },
      ],
    },
  ];
}
