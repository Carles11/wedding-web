"use client";

import type { MarketingFloatingLanguageSelectorProps } from "@/4-shared/types";
import LanguageSelector from "@/4-shared/ui/builder/LanguageSelector";
import { usePathname, useRouter } from "next/navigation"; // Add usePathname

export default function MarketingFloatingLanguageSelector({
  currentLang,
  label,
  onLanguageChange,
}: MarketingFloatingLanguageSelectorProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLangChange = (newLang: string) => {
    if (onLanguageChange) {
      onLanguageChange(newLang);
    } else {
      // Logic: Swap the first part of the path (the lang) with the new one
      // Example: /en/pricing -> /es/pricing
      const pathSegments = pathname.split("/");
      pathSegments[1] = newLang;
      const newPath = pathSegments.join("/");
      router.push(newPath);
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 bg-white/80 shadow-lg rounded-lg backdrop-blur-sm">
      <LanguageSelector
        currentLang={currentLang}
        label={label}
        onLanguageChange={handleLangChange}
      />
    </div>
  );
}
