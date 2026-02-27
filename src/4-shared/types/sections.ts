// Shared type for the Hero section, scalable for multilingual/SaaS structures
export type HeroSectionType = {
  id: string;
  site_id: string;
  type: string;
  title: string; // now always a string!
  description: string; // now always a string!
  backgroundImage?: string;
  date?: string;
  location?: string;
  dresscode?: string;
  sort_order?: number;
  // remove or refactor any fields that used to be objects
};

// ProgramSection type matches your content JSON shape in DB
export type ProgramSection = {
  id: string;
  site_id: string;
  type: "program";
  title: Record<string, string>;
  content: {
    headline: Record<string, string>;
    when: Record<string, string>;
    where: {
      wedding: Record<string, string>;
      banquet: Record<string, string>;
    };
    wear: Record<string, string>;
    [key: string]: unknown; // Future extensibility
  };
  sort_order?: number;
  created_at?: string;
  [key: string]: unknown; // For SaaS expansion
};
