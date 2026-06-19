"use client";

import { t } from "@/4-shared/helpers/t";
import { notify } from "@/4-shared/lib/toast/toast";
import { BuilderButton } from "@/4-shared/ui/builder";
import { Info } from "lucide-react";
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

  // Default to "Natural" for translation or "Romantic" for generation
  const hasContent = Object.values(currentContent).some((val: any) => {
    return val?.title?.trim() || val?.name?.trim() || val?.description?.trim();
  });

  const [tone, setTone] = useState(hasContent ? "Natural" : "Minimalist");

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
      <div className="w-full max-w-md rounded-xl bg-white dark:bg-gray-800 p-6 shadow-2xl">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
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

        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {t(
            translations,
            "builder.ai.modal.description",
            "Gemini will process your details for all languages.",
          )}
        </p>

        <div className="mt-6">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t(translations, "builder.ai.modal.label.mode", "Select AI Mode")}
          </label>
          <select
            className="mt-1 block w-full rounded border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm focus:border-emerald-500 dark:focus:border-emerald-400 focus:outline-none"
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            disabled={loading}
          >
            {/* Subsection: Translate */}
            <optgroup
              label={t(translations, "ai.category.translate", "Translate")}
            >
              <option value="Natural">
                {t(
                  translations,
                  "ai.tone.natural",
                  "Just translate (Natural tone)",
                )}
              </option>
            </optgroup>

            {/* Subsection: Generate */}
            <optgroup
              label={t(
                translations,
                "ai.category.generate",
                "Generate with Style",
              )}
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
            </optgroup>
          </select>

          <p className="mt-2 text-[11px] text-gray-400 dark:text-gray-500 italic">
            {tone === "Natural"
              ? t(
                  translations,
                  "ai.mode.help.translate",
                  "Maintains your original meaning accurately.",
                )
              : t(
                  translations,
                  "ai.mode.help.generate",
                  "AI will rewrite content to match this personality.",
                )}
          </p>
        </div>
        <div className="mt-4 rounded-lg bg-amber-50 dark:bg-amber-950/30 p-3 flex gap-3">
          <div className="text-amber-600 dark:text-amber-400">
            <Info size={16} />
          </div>
          <p className="text-[12px] leading-tight text-amber-700 dark:text-amber-400">
            {t(
              translations,
              "builder.ai.modal.save_reminder",
              "AI results will be applied to your fields, but you must click 'Save' in the builder to keep changes permanently.",
            )}
          </p>
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
            loadingLabel={t(
              translations,
              "builder.ai.modal.button.translating",
              "Translating...",
            )}
          >
            {t(translations, "builder.ai.modal.button.start", "Start AI")}
          </BuilderButton>
        </div>
      </div>
    </div>
  );
}
