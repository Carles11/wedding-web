import { UpgradeCTAModal } from "@/features/billing/ui/UpgradeCTAModal";
import { Button } from "@/shared/ui/button"; // Assuming shadcn/ui or similar
import { Sparkles } from "lucide-react";
import { useState } from "react";
import { AIPromptModal } from "./AIPromptModal";

interface Props {
  siteId: string;
  isPremium: boolean;
  siteLanguages: string[];
  currentValues: any;
  context: "general" | "program" | "what-to-see";
  onApply: (translatedData: any) => void;
}

export const MagicAIButton = ({
  isPremium,
  siteLanguages,
  currentValues,
  onApply,
  context,
  siteId,
}: Props) => {
  const [showModal, setShowModal] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);

  const handleClick = () => {
    if (!isPremium) {
      setShowUpgrade(true);
      return;
    }
    setShowModal(true);
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={handleClick}
        className="flex items-center gap-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
      >
        <Sparkles size={16} />
        <span>AI Assist</span>
      </Button>

      {showUpgrade && <UpgradeCTAModal onClose={() => setShowUpgrade(false)} />}

      {showModal && (
        <AIPromptModal
          siteId={siteId}
          languages={siteLanguages}
          currentContent={currentValues}
          context={context}
          onClose={() => setShowModal(false)}
          onSuccess={(data) => {
            onApply(data);
            setShowModal(false);
          }}
        />
      )}
    </>
  );
};
