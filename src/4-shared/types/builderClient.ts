import type { AccountInfo, PlanType, Site } from "@/4-shared/types";

export interface BuilderClientProps {
  initialLang?: string;
  translations: Record<string, string>;
  // userId?: string | null;
  // userProfile?: {
  //   cookie_consent?: boolean | null;
  //   cookie_consent_at?: string | null;
  //   cookie_consent_version?: string | null;
  //   [key: string]: any;
  // } | null;
  account: AccountInfo;
  isLegacyMode: boolean;
}
export type StepStatus = "done" | "pending" | "optional";

export type StepStatuses = string[];

export interface BuilderStepContentProps {
  active: number;
  account: AccountInfo;
  site: Site;
  refresh: () => void;
  currentLang: string;
  translations: Record<string, string>;
  langLimit: number;
  planType: PlanType;
  stepStatuses: StepStatuses;
  TEST_ENABLED_SITE_IDS: string[]; // Your test sites id
  // step completeness callbacks
  setHasHeroContent: (v: boolean) => void;
  setHeroImageExists: (v: boolean) => void;
  setHasMainProgramEvent: (v: boolean) => void;
  setAccommodationCount: (v: number) => void;
  setWhatToSeeCount: (v: number) => void;
  setHasWeddingGiftData: (v: boolean) => void;
  setHasContact: (v: boolean) => void;
  setHasRsvpEnabled: (v: boolean) => void;
}

export interface BuilderStepNavProps {
  stepKeys: string[];
  stepStatuses: StepStatus[];
  active: number;
  onSelect: (index: number) => void;
  translations: Record<string, string>;
  currentLang: string;
}
