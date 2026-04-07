import { notifyIndexNow } from "./notifyIndexNow";

export const SEOService = {
  async syncWithSearchEngines(
    domains: string[],
    domainStatuses: Record<string, string> | null,
    seoEnabled: boolean,
    languages: string[] = [],
  ) {
    if (process.env.NODE_ENV !== "production" || !seoEnabled) return;

    // Filter to canonical public domains only:
    // - Exclude localhost/dev domains
    // - Exclude www.* variants (they 308-redirect to apex, not canonical)
    // - Include *.weddweb.com platform subdomains
    // - Include custom domains with verified status
    const basePublicDomains = domains.filter((d) => {
      if (d.includes("localhost") || d.includes("127.0.0.1")) return false;
      if (d.startsWith("www.")) return false;
      if (d.endsWith("weddweb.com")) return true;
      return domainStatuses?.[d] === "verified";
    });

    if (basePublicDomains.length === 0) return;

    const hostGroups: Record<string, string[]> = {};

    basePublicDomains.forEach((domain) => {
      // Only send canonical /{lang} paths — root / is a redirect, not a canonical URL.
      // This matches the hreflang tags in <head> and sitemap-tenant.xml.
      const urlList: string[] = languages.map(
        (lang) => `https://${domain}/${lang}`,
      );

      if (urlList.length > 0) {
        hostGroups[domain] = urlList;
      }
    });

    for (const [host, urlList] of Object.entries(hostGroups)) {
      await notifyIndexNow(urlList, host);
    }
  },
};
