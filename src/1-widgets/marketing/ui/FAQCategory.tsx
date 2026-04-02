import Heading from "@/4-shared/ui/commons/typography/Heading";
import FAQItem from "./FAQItem";

interface FAQCategoryProps {
  id: string;
  title: string;
  questions: { q: string; a: string }[];
}

export default function FAQCategory({
  id,
  title,
  questions,
}: FAQCategoryProps) {
  return (
    <section id={id} className="mb-12 scroll-mt-24">
      <Heading
        as="h2"
        className="font-display text-2xl mb-6 flex items-center gap-3 pb-4"
      >
        <span
          className="h-1 w-8 rounded-full"
          style={{ background: "var(--marketing-color-accent)" }}
        />
        {title}
      </Heading>
      <div className="space-y-2">
        {questions.map((qa, idx) => (
          <FAQItem key={idx} question={qa.q} answer={qa.a} />
        ))}
      </div>
    </section>
  );
}
