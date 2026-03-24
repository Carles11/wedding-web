import { ReactNode } from "react";

interface FAQPageShellProps {
  title: string;
  summary: string;
  fine_print?: string;
  children: ReactNode;
}

export default function FAQPageShell({
  title,
  summary,
  fine_print,
  children,
}: FAQPageShellProps) {
  return (
    <section className="max-w-4xl mx-auto px-4 py-12">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        <p className="text-lg text-gray-600 mb-4">{summary}</p>
        {fine_print && (
          <div className="text-xs text-gray-400">{fine_print}</div>
        )}
      </header>
      <div>{children}</div>
    </section>
  );
}
