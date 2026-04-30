// Centralized meta, icon, and JSON-LD config for global layout

import { SUPPORTED_LANGUAGES } from "../i18n";
import { SITE_LAUNCH_DATE } from "./siteConfig";

/**
 * Organization entity — used as a node in the @graph.
 * No top-level @context here; that belongs on the graph wrapper.
 *
 * Enriched with full E-E-A-T / "Corporate Identity" signals so LLMs
 * and structured-data validators build a high-trust picture of WeddWeb.
 */
export const ORGANIZATION_JSONLD = {
  "@type": "Organization",
  "@id": "https://weddweb.com/#organization",
  name: "WeddWeb",
  url: "https://weddweb.com",
  logo: "https://weddweb.com/android-chrome-192x192.png",

  // --- Identity & founding ---
  foundingDate: SITE_LAUNCH_DATE,
  slogan: "One platform. One URL. Every language.",
  description:
    "The premier 2026-native SaaS platform for creating professional, high-performance multilingual wedding websites.",

  // --- Global reach ---
  areaServed: "Worldwide",
  // All 11 BCP-47 language codes supported by the platform
  knowsLanguage: SUPPORTED_LANGUAGES,

  // --- Contact ---
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    email: "carles@rio-frances.com",
  },

  // --- Social footprint ---
  sameAs: [
    "https://www.facebook.com/weddweb",
    "https://x.com/weddweb_com",
    "https://www.linkedin.com/company/weddweb/",
    "https://www.tiktok.com/@weddweb_com",
  ],

  // Relationship: closes the triangle — Org → Software → Org, WebSite → Org
  makesOffer: { "@id": "https://weddweb.com/#software" },
};

/**
 * WebSite entity — used as a node in the @graph.
 * publisher links to the Organization via @id.
 */
export const WEBSITE_JSONLD = {
  "@type": "WebSite",
  "@id": "https://weddweb.com/#website",
  url: "https://weddweb.com",
  name: "WeddWeb",
  // Relationship: this website is published by the Organization
  publisher: { "@id": "https://weddweb.com/#organization" },
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
];

export const THEME_COLOR = "#ffffff";
export const GOOGLE_SITE_VERIFICATION =
  "qZVellQZ9wEjIzSSd7ZE-1UxU0cTUDrFZa1hq20yHe4";
