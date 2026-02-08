/**
 * Page-level SEO metadata
 */
export interface PageSEO {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterCard?: "summary" | "summary_large_image";
  keywords?: string[];
  canonicalUrl?: string;
  locale: string;
  alternateLanguages?: Array<{ locale: string; url: string }>;
}

/**
 * Sitewide SEO structure grouping pages by area
 */
export interface SitewideSEO {
  marketing: PageSEO;
  // future: tenantSite: PageSEO;
  // future: adminDashboard: PageSEO;
  // future: blog: PageSEO;
}
