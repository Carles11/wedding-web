// Centralized meta, icon, and JSON-LD config for global layout

export const ORGANIZATION_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "WeddWeb",
  url: "https://weddweb.com",
  logo: "https://weddweb.com/android-chrome-192x192.png",
  sameAs: [
    "https://www.facebook.com/weddweb",
    "https://www.instagram.com/weddweb",
  ],
};

export const WEBSITE_JSONLD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  url: "https://weddweb.com",
  name: "WeddWeb",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://weddweb.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

export const ICONS = [
  { rel: "icon", href: "/favicon.ico" },
  { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
  {
    rel: "icon",
    type: "image/png",
    sizes: "32x32",
    href: "/favicon-32x32.png",
  },
  {
    rel: "icon",
    type: "image/png",
    sizes: "16x16",
    href: "/favicon-16x16.png",
  },
  { rel: "mask-icon", href: "/safari-pinned-tab.svg", color: "#5bbad5" },
];

export const THEME_COLOR = "#ffffff";
export const GOOGLE_SITE_VERIFICATION = "YOUR_GOOGLE_VERIFICATION";
