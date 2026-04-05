import type { PlanType, Site } from "@/4-shared/types";

export interface BuilderClientProps {
  initialLang?: string;
  translations: Record<string, string>;
  userId?: string | null;
  userProfile?: {
    cookie_consent?: boolean | null;
    cookie_consent_at?: string | null;
    cookie_consent_version?: string | null;
    [key: string]: any;
  } | null;
  account: any;
  isLegacyMode: boolean;
}

export interface BuilderStepContentProps {
  active: number;
  site: Site;
  siteLoading: boolean;
  siteError: string | null;
  refresh: () => void;
  currentLang: string;
  translations: Record<string, string>;
  langLimit: number;
  planType: PlanType;
  // step completeness callbacks
  setHasHeroContent: (v: boolean) => void;
  setHeroImageExists: (v: boolean) => void;
  setHasMainProgramEvent: (v: boolean) => void;
  setAccommodationCount: (v: number) => void;
  setWhatToSeeCount: (v: number) => void;
  setHasWeddingGiftData: (v: boolean) => void;
  setHasContact: (v: boolean) => void;
}

export type StepStatus = "done" | "pending" | "optional";

export interface BuilderStepNavProps {
  stepKeys: string[];
  stepStatuses: StepStatus[];
  active: number;
  onSelect: (index: number) => void;
  translations: Record<string, string>;
  currentLang: string;
}
