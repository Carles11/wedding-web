import { BuilderButton } from "@/4-shared/ui/builder";
import { Lock, Sparkles } from "lucide-react";

interface LegacyModeBannerProps {
  onUpgrade?: () => void;
  // Pass the strings directly
  title: string;
  description: string;
  buttonText: string;
}

// REMOVE 'async' - this is now a standard Client Component
export function LegacyModeBanner({
  onUpgrade,
  title,
  description,
  buttonText,
}: LegacyModeBannerProps) {
  return (
    <div className="w-full bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200 dark:border-amber-800/50 py-3 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-amber-100 dark:bg-amber-950/40 p-2 rounded-full">
            <Lock className="w-5 h-5 text-amber-700 dark:text-amber-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-amber-900 dark:text-amber-100">{title}</p>
            <p className="text-xs text-amber-800 dark:text-amber-200">{description}</p>
          </div>
        </div>

        <BuilderButton
          onClick={onUpgrade}
          variant="primary"
          className="bg-amber-600 hover:bg-amber-700 text-white border-none flex items-center gap-2 shadow-sm"
        >
          <Sparkles className="w-4 h-4" />
          {buttonText}
        </BuilderButton>
      </div>
    </div>
  );
}
