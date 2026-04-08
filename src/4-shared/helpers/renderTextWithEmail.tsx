import React from "react";

export function renderAnswerWithEmail(answer: string) {
  // Simple email regex (matches most emails)
  const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
  const parts = answer.split(emailRegex);

  return parts.map((part, i) =>
    emailRegex.test(part) ? (
      <a
        key={i}
        href={`mailto:${part}`}
        className="font-semibold underline decoration-2 transition-all hover:opacity-70"
        style={{
          color: "var(--marketing-color-primary)",
          textDecorationColor: "var(--marketing-color-primary-focus)",
        }}
      >
        {part}
      </a>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    ),
  );
}
