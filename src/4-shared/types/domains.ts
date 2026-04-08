import { PlanType, Site, TranslationDictionary } from "@/4-shared/types";

export interface CustomDomainSectionProps {
  planType: PlanType;
  translations: Record<string, string>;
  siteId: string;
  verifiedDomains: string[];
  pendingDomains: string[];
  domainStatuses: Record<string, string>;
  domainProviderApiUrl?: string | null;
  onUpgradeClick: () => void;
  refetchDomains: () => Promise<void>;
  loading?: boolean;
}

export interface DomainAndBillingBuilderStepProps {
  site: Site;
  refresh: () => void;
  lang: string;
  translations: TranslationDictionary;
  planType: PlanType;
}

export type ShareTarget = {
  id: string;
  label: string;
  description: string;
  url: string | null;
  shareText: string;
};
