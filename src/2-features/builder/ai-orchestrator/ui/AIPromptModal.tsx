"use client";

import { t } from "@/4-shared/helpers/t";
import { notify } from "@/4-shared/lib/toast/toast";
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

  const hasContent = Object.values(currentContent).some((val: any) => {
    return val?.title?.trim() || val?.name?.trim() || val?.description?.trim();
  });

  const action = hasContent ? "translate" : "generate";

  const handleRun = async () => {
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
        throw new Error("EMPTY_RESPONSE");
      }
    } catch (err: any) {
      console.error("AI Modal Error:", err);

      const isParsingError =
        err.message?.includes("JSON") || err.message?.includes("Unexpected");
      const isOverloaded =
        err.message?.includes("high demand") || err.status === 503;

      if (isOverloaded) {
        notify.error(
          t(
            translations,
            "ai.error.overloaded",
            "AI is busy. Please try again.",
          ),
        );
      } else if (isParsingError) {
        notify.error(
          t(
            translations,
            "ai.error.format",
            "Invalid AI response. Please try again.",
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
          {/* We keep context/languages count dynamic as they are numbers/technical IDs, but the surrounding text is translated */}
          {t(
            translations,
            "builder.ai.modal.description",
            `Gemini will process your details for all languages.`,
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
            <option value="Romantic">
              {t(translations, "ai.tone.romantic", "Romantic")}
            </option>
            <option value="Minimalist">
              {t(translations, "ai.tone.minimalist", "Minimalist")}
            </option>
            <option value="Funny & Light">
              {t(translations, "ai.tone.funny", "Funny & Light")}
            </option>
            <option value="Formal">
              {t(translations, "ai.tone.formal", "Formal")}
            </option>
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
