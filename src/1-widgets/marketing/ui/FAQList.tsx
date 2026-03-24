import FAQCategory from "@/1-widgets/marketing/ui/FAQCategory";
import type { TranslationDictionary } from "@/4-shared/types";

interface FAQListProps {
  t: TranslationDictionary;
}

export default function FAQList({ t }: FAQListProps) {
  // Example categories and keys. Add more as needed for SEO.
  const categories = [
    {
      key: "general",
      title: t["faq.category.general.title"] ?? "General",
      questions: [
        {
          q: t["faq.general.what_is_wedding_web"] ?? "What is Wedding-Web?",
          a:
            t["faq.general.what_is_wedding_web.answer"] ??
            "Wedding-Web is a platform to create beautiful, multilingual wedding websites with RSVP, photo galleries, and more.",
        },
        {
          q: t["faq.general.is_it_free"] ?? "Is Wedding-Web free?",
          a:
            t["faq.general.is_it_free.answer"] ??
            "We offer a free plan with core features and paid plans for advanced options.",
        },
      ],
    },
    {
      key: "planning",
      title: t["faq.category.planning.title"] ?? "Wedding Planning",
      questions: [
        {
          q:
            t["faq.planning.can_i_manage_guests"] ??
            "Can I manage my guest list?",
          a:
            t["faq.planning.can_i_manage_guests.answer"] ??
            "Yes, you can manage RSVPs, send invites, and track responses easily.",
        },
        {
          q:
            t["faq.planning.can_i_add_schedule"] ??
            "Can I add a wedding schedule?",
          a:
            t["faq.planning.can_i_add_schedule.answer"] ??
            "Absolutely! Add ceremony, reception, and event details for your guests.",
        },
      ],
    },
    {
      key: "services",
      title: t["faq.category.services.title"] ?? "Related Services",
      questions: [
        {
          q:
            t["faq.services.can_i_link_registry"] ??
            "Can I link my gift registry?",
          a:
            t["faq.services.can_i_link_registry.answer"] ??
            "You can add links to any registry, honeymoon fund, or charity.",
        },
        {
          q:
            t["faq.services.can_i_book_photographer"] ??
            "Can I book a photographer or vendor?",
          a:
            t["faq.services.can_i_book_photographer.answer"] ??
            "We provide recommendations and integrations for popular wedding vendors.",
        },
      ],
    },
    // Add more categories for SEO as needed
  ];

  return (
    <div className="space-y-10">
      {categories.map((cat) => (
        <FAQCategory
          key={cat.key}
          title={cat.title}
          questions={cat.questions}
        />
      ))}
    </div>
  );
}
