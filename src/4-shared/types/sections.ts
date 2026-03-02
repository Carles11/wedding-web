import { TranslationDictionary } from "./translations";

// Shared type for the Hero section, scalable for multilingual/SaaS structures
export type HeroSectionType = {
  title: string; // now always a string!
  description: string; // now always a string!
};

export type ProgramSection = {
  id: string;
  site_id: string;
  type: "program";
  title: Record<string, string>; // should always exist
  content: {
    headline?: Record<string, string>;
    when?: Record<string, string>;
    where?: {
      wedding?: Record<string, string>;
      banquet?: Record<string, string>;
      [key: string]: Record<string, string> | undefined;
    };
    wear?: Record<string, string>;
    days?: Array<{
      slug: string;
      label: string;
      events: Record<string, unknown>[];
    }>;
    [key: string]: unknown;
  };
  sort_order?: number;
  created_at?: string;
  [key: string]: unknown;
};

export type ProgramSectionProps = {
  program: ProgramSection;
  lang: string;
  translations?: TranslationDictionary | null;
};
