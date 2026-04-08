"use client";
import { renderAnswerWithEmail } from "@/4-shared/helpers/renderTextWithEmail";
import { useState } from "react";

interface FAQItemProps {
  question: string;
  answer: string;
}

export default function FAQItem({ question, answer }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="mb-3 overflow-hidden transition-all duration-200 border bg-white/50 backdrop-blur-sm"
      style={{
        borderRadius: "var(--marketing-radius-rect)",
        borderColor: isOpen
          ? "var(--marketing-color-primary)"
          : "rgba(0,0,0,0.05)",
      }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-5 text-left transition-colors hover:bg-white"
      >
        <span className="font-semibold text-gray-800 pr-4">{question}</span>
        <span
          className={`transform transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          style={{ color: "var(--marketing-color-primary)" }}
        >
          <svg
            width="20"
            height="20"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>
      <div
        className={`transition-all duration-300 ease-in-out ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="p-5 pt-0 text-gray-600 leading-relaxed border-t border-gray-50">
          {renderAnswerWithEmail(answer)}
        </div>
      </div>
    </div>
  );
}
