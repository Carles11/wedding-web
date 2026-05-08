"use client";

import { AIPromptModal } from "@/2-features/builder/ai-orchestrator/ui/AIPromptModal";
import { BuilderButton, UpgradeCTAModal } from "@/4-shared/ui/builder";
import { Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  siteId: string;
  planType: string;
  languages: any[];
  currentValues: any;
  context: string;
  onApply: (data: any) => void;
  translations: Record<string, string>;
  lang: string; // current UI language for the router
}

export const MagicAIButton = ({
  siteId,
  planType,
  languages,
  currentValues,
  context,
  onApply,
  translations,
  lang,
}: Props) => {
  const [showModal, setShowModal] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const router = useRouter();

  const isPremium = planType !== "free";

  const handleClick = () => {
    if (!isPremium) {
      setShowUpgrade(true);
      return;
    }
    setShowModal(true);
  };

  return (
    <>
      <BuilderButton
        variant="secondary"
        size="sm"
        icon={<Sparkles size={14} className="text-emerald-500" />}
        onClick={handleClick}
      >
        AI Assist
      </BuilderButton>

      <UpgradeCTAModal
        open={showUpgrade}
        title={
          translations["builder.ai.upgrade_title"] || "AI Assist is Premium"
        }
        description={
          translations["builder.ai.upgrade_desc"] ||
          "Upgrade to Premium to use AI to generate and translate your content automatically."
        }
        onClose={() => setShowUpgrade(false)}
        onUpgrade={() => router.push(`/${lang}/pricing`)}
      />

      {showModal && (
        <AIPromptModal
          siteId={siteId}
          languages={languages}
          currentContent={currentValues}
          context={context}
          onClose={() => setShowModal(false)}
          onSuccess={(data) => {
            onApply(data);
            setShowModal(false);
          }}
          translations={translations}
        />
      )}
    </>
  );
};
