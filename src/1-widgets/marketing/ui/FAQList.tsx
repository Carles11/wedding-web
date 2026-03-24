import type { TranslationDictionary } from "@/4-shared/types";
import { faqCategories, FAQCategory } from "../model/faqCategories";
import FAQCategoryComponent from "./FAQCategory";

interface FAQListProps {
  t: TranslationDictionary;
}

export default function FAQList({ t }: FAQListProps) {
  const categories = faqCategories(t);

  return (
    <div>
      {/* Category Navigation Index */}
      <nav className="flex flex-wrap justify-center gap-2 mb-16">
        {categories.map((cat: FAQCategory) => (
          <a
            key={cat.key}
            href={`#${cat.key}`}
            className="marketing-btn-secondary marketing-btn-sm text-xs md:text-sm hover:scale-105 transition-transform"
          >
            {cat.title}
          </a>
        ))}
      </nav>

      <div className="space-y-4">
        {categories.map((cat: FAQCategory) => (
          <FAQCategoryComponent
            key={cat.key}
            id={cat.key}
            title={cat.title}
            questions={cat.questions}
          />
        ))}
      </div>
    </div>
  );
}
