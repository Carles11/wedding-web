export type PricingPageProps = {
  lang?: string;
  searchParams?:
    | { [key: string]: string | string[] | undefined }
    | Promise<{ [key: string]: string | string[] | undefined }>;
};

export type PlanFeatureCatalogItem = {
  title: string;
  titleTranslationKeys: readonly string[];
  marketingDescription: string;
  marketingDescriptionTranslationKey: string;
};
