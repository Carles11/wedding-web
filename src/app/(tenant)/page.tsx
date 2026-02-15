// import { redirect } from "next/navigation";
// import { headers } from "next/headers";
// import { getSiteByDomain } from "@/4-shared/lib/getSiteByDomain";

// /**
//  * Root tenant page - redirects to default language.
//  *
//  * This ensures that visiting the root domain (e.g., inesundcarles.dog)
//  * automatically redirects to the default language route (e.g., /ca).
//  *
//  * Multi-tenant: uses getSiteByDomain to determine the site's default language.
//  */
// export default async function TenantRootPage() {
//   const host = ((await headers()).get("host") ?? "").toLowerCase().trim();
//   const site = await getSiteByDomain(host);

//   // Use site's default language, fallback to 'ca'
//   const defaultLang = site?.default_lang ?? "ca";

//   redirect(`/${defaultLang}`);
// }
