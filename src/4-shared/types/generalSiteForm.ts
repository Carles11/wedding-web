import { getSiteGeneralContent } from "../api/builder/getSiteGeneralContent";
import { SupportedLanguage } from "../config/i18n";
import { PlanType } from "./billing";
import { Site } from "./sites";

export type GeneralSiteFormProps = {
  site: Site | null;
  refresh: () => void;
  lang: string;
  translations: Record<string, string>;
  langLimit: number;
  planType: PlanType;
  /** Called with true once hero title + subtitle are saved for the default language. */
  setGeneralComplete?: (v: boolean) => void;
};

export type GeneralContentState = Awaited<
  ReturnType<typeof getSiteGeneralContent>
>;

export type GeneralContent = {
  languages: SupportedLanguage[];
  default_lang: SupportedLanguage;
  subdomain: string;
  heroId: string | null;
  titles: Record<SupportedLanguage, string>;
  subtitles: Record<SupportedLanguage, string>;
};
