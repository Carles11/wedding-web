// Shared type for the Hero section, scalable for multilingual/SaaS structures
export type HeroSection = {
  id: string;
  site_id: string; // Multi-tenant identifier (never hardcoded)
  type: "hero";
  title: Record<string, string>; // e.g., { es: "Bienvenido", ca: "Benvingut" }
  content: {
    description: Record<string, string>;
    backgroundImage?: string;
    [key: string]: unknown; // Allow extension for future content fields
  };
  // More shared fields (future-proofing for SaaS) can be added as needed
  [key: string]: unknown;
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
