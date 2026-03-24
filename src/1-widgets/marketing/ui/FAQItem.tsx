interface FAQItemProps {
  question: string;
  answer: string;
}

export default function FAQItem({ question, answer }: FAQItemProps) {
  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <dt className="font-medium text-gray-900 mb-1">{question}</dt>
      <dd className="text-gray-700 text-sm">{answer}</dd>
    </div>
  );
}
