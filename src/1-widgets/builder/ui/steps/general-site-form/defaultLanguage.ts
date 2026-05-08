// Transitional re-export for compatibility while imports migrate to shared FSD layer.
export {
  clearDefaultLanguageIfRemoved,
  getEffectiveBuilderLanguage,
  isSelectedDefaultLanguage,
} from "@/4-shared/lib/builder-language/defaultLanguage";
export type { DefaultLanguageValue } from "@/4-shared/lib/builder-language/defaultLanguage";
