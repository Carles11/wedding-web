import FAQItem from "@/1-widgets/marketing/ui/FAQItem";

interface FAQCategoryProps {
  title: string;
  questions: { q: string; a: string }[];
}

export default function FAQCategory({ title, questions }: FAQCategoryProps) {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="space-y-4">
        {questions.map((qa, idx) => (
          <FAQItem key={idx} question={qa.q} answer={qa.a} />
        ))}
      </div>
    </section>
  );
}
