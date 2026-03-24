import UnderlinedLink from "@/4-shared/ui/commons/link/UnderlinedLink";
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
    <section
      className="min-h-screen pt-20 pb-12 px-4"
      style={{ background: "var(--marketing-bg-gradient)" }}
    >
      <header className="max-w-4xl mx-auto mb-12 text-center animate-fadeIn">
        <h1
          className="font-display text-4xl md:text-5xl mb-4"
          style={{ color: "var(--marketing-color-on-gradient-text)" }}
        >
          {title}
        </h1>
        <p className="text-lg opacity-80 max-w-2xl mx-auto mb-6">{summary}</p>
        {fine_print && (
          <UnderlinedLink
            href={"mailto:carles@rio-frances.com"}
            thicknessClass="h-0.5"
            durationMs={350}
            ariaLabel={"Contact support for more FAQ details"}
            external
          >
            {fine_print}
          </UnderlinedLink>
        )}
      </header>
      <div className="max-w-3xl mx-auto">{children}</div>
    </section>
  );
}
