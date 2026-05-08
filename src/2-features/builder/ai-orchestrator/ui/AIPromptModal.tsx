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
  const hasContent = Object.values(currentContent).some((val: any) =>
    val?.title?.trim(),
  );
  const action = hasContent ? "translate" : "generate";

  const handleRun = async () => {
    const result = await processContent({
      action,
      content: currentContent,
      targetLanguages: languages,
      context,
      tone,
    });
    if (result) onSuccess(result);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
        <h3 className="text-xl font-semibold text-gray-800">
          {action === "translate" ? "Translate Content" : "Generate Content"}
        </h3>
        <p className="mt-2 text-sm text-gray-500">
          Gemini will {action} your {context} details for all {languages.length}{" "}
          languages.
        </p>

        <div className="mt-6">
          <label className="text-sm font-medium text-gray-700">
            Writing Tone
          </label>
          <select
            className="mt-1 block w-full rounded border px-3 py-2"
            value={tone}
            onChange={(e) => setTone(e.target.value)}
          >
            <option>Romantic</option>
            <option>Minimalist</option>
            <option>Funny & Light</option>
            <option>Formal</option>
          </select>
        </div>

        <div className="mt-8 flex gap-3">
          <BuilderButton
            variant="secondary"
            fullWidth
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </BuilderButton>
          <BuilderButton
            variant="primary"
            fullWidth
            onClick={handleRun}
            loading={loading}
          >
            Start AI
          </BuilderButton>
        </div>
      </div>
    </div>
  );
}
