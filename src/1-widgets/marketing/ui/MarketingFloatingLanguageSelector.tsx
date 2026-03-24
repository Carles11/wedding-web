"use client";

import type { MarketingFloatingLanguageSelectorProps } from "@/4-shared/types";
import LanguageSelector from "@/4-shared/ui/builder/LanguageSelector";
import { useRouter } from "next/navigation";

export default function MarketingFloatingLanguageSelector({
  currentLang,
  label,
  onLanguageChange,
}: MarketingFloatingLanguageSelectorProps) {
  const router = useRouter();
  return (
    <div className="fixed top-4 right-4 z-50 bg-white/80 shadow-lg rounded-lg">
      <LanguageSelector
        currentLang={currentLang}
        label={label}
        onLanguageChange={
          onLanguageChange
            ? onLanguageChange
            : (lang) => {
                router.push(`/${lang}/faq`);
              }
        }
      />
    </div>
  );
}
