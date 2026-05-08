"use client";

import { t } from "@/4-shared/helpers/t";
import { notify } from "@/4-shared/lib/toast/toast"; // Ensure toast is imported
import { BuilderButton } from "@/4-shared/ui/builder";
import { useState } from "react";
import { useAIOrchestrator } from "../model/useAIOrchestrator";

interface Props {
  siteId: string;
  languages: string[];
  currentContent: any;
  context: string;
  onClose: () => void;
  onSuccess: (data: any) => void;
  translations: Record<string, string>;
}

export function AIPromptModal({
  siteId,
  languages,
  currentContent,
  context,
  onClose,
  onSuccess,
  translations,
}: Props) {
  const { processContent, loading } = useAIOrchestrator(siteId);
  const [tone, setTone] = useState("Romantic");

  // Logic to determine if we are translating or generating
  const hasContent = Object.values(currentContent).some((val: any) => {
    // Check various common field names for content
    return val?.title?.trim() || val?.name?.trim() || val?.description?.trim();
  });

  const action = hasContent ? "translate" : "generate";

  const handleRun = async () => {
    // We wrap everything in a try/catch here to catch parsing errors
    try {
      const result = await processContent({
        action,
        content: currentContent,
        targetLanguages: languages,
        context,
        tone,
      });

      if (result) {
        onSuccess(result);
      } else {
        // Handle cases where result is empty but no error was thrown
        throw new Error("EMPTY_RESPONSE");
      }
    } catch (err: any) {
      console.error("AI Modal Error:", err);

      // 1. Detect JSON Parsing/Mangled Response errors
      const isParsingError =
        err.message?.includes("JSON") || err.message?.includes("Unexpected");
      // 2. Detect Gemini overloading
      const isOverloaded =
        err.message?.includes("high demand") || err.status === 503;

      if (isOverloaded) {
        notify.error(
          t(
            translations,
            "ai.error.overloaded",
            "AI is busy. Please try again in a moment.",
          ),
        );
      } else if (isParsingError) {
        notify.error(
          t(
            translations,
            "ai.error.format",
            "The AI returned an invalid response. Please try one more time in a while.",
          ),
        );
      } else {
        notify.error(
          t(
            translations,
            "ai.error.generic",
            "Something went wrong. Please try again.",
          ),
        );
      }

      // IMPORTANT: If your useAIOrchestrator doesn't handle its own 'loading' state
      // perfectly on crash, you might need a local state here to force-disable it.
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
        <h3 className="text-xl font-semibold text-gray-800">
          {action === "translate"
            ? t(
                translations,
                "builder.ai.modal.title.translate",
                "Translate Content",
              )
            : t(
                translations,
                "builder.ai.modal.title.generate",
                "Generate Content",
              )}
        </h3>
        <p className="mt-2 text-sm text-gray-500">
          {t(
            translations,
            "builder.ai.modal.description",
            `Gemini will ${action} your ${context} details for all ${languages.length} languages.`,
          )}
        </p>

        <div className="mt-6">
          <label className="text-sm font-medium text-gray-700">
            {t(translations, "builder.ai.modal.label.tone", "Writing Tone")}
          </label>
          <select
            className="mt-1 block w-full rounded border border-gray-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            disabled={loading}
          >
            <option value="Romantic">Romantic</option>
            <option value="Minimalist">Minimalist</option>
            <option value="Funny & Light">Funny & Light</option>
            <option value="Formal">Formal</option>
          </select>
        </div>

        <div className="mt-8 flex gap-3">
          <BuilderButton
            variant="secondary"
            fullWidth
            onClick={onClose}
            disabled={loading}
          >
            {t(translations, "common.cancel", "Cancel")}
          </BuilderButton>
          <BuilderButton
            variant="primary"
            fullWidth
            onClick={handleRun}
            loading={loading}
          >
            {t(translations, "builder.ai.modal.button.start", "Start AI")}
          </BuilderButton>
        </div>
      </div>
    </div>
  );
}
