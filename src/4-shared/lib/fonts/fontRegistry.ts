import {
  Cinzel,
  Cormorant_Garamond,
  Great_Vibes,
  Inter,
  Montserrat,
  Niconne,
  Playfair_Display,
  Plus_Jakarta_Sans,
  Roboto,
  Tangerine,
  Parisienne,
} from "next/font/google";

// ── Google Font instances ────────────────────────────────────────────

export const niconne = Niconne({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-niconne",
});

export const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display",
});

export const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-great-vibes",
});

export const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
});

export const cormorantGaramond = Cormorant_Garamond({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-cormorant-garamond",
});

export const roboto = Roboto({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
});

export const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
});

export const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const tangerine = Tangerine({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-tangerine",
});

export const parisienne = Parisienne({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-parisienne",
});

// ── All font instances (for applying CSS variables to the DOM) ──────

export const allFontInstances = [
  niconne,
  playfairDisplay,
  greatVibes,
  cinzel,
  cormorantGaramond,
  roboto,
  plusJakartaSans,
  montserrat,
  inter,
  tangerine,
  parisienne,
];

// ── Data structures ─────────────────────────────────────────────────

export type FontStyle = "Romantic" | "Classic" | "Modern" | "Luxury";

export interface FontOption {
  id: string;
  name: string;
  variable: string;
  style: FontStyle;
}

export const AVAILABLE_TITLE_FONTS: FontOption[] = [
  {
    id: "niconne",
    name: "Niconne",
    variable: "--font-niconne",
    style: "Romantic",
  },
  {
    id: "playfair",
    name: "Playfair Display",
    variable: "--font-playfair-display",
    style: "Classic",
  },
  {
    id: "great-vibes",
    name: "Great Vibes",
    variable: "--font-great-vibes",
    style: "Romantic",
  },
  {
    id: "cinzel",
    name: "Cinzel",
    variable: "--font-cinzel",
    style: "Luxury",
  },
  {
    id: "cormorant",
    name: "Cormorant Garamond",
    variable: "--font-cormorant-garamond",
    style: "Classic",
  },
  {
    id: "tangerine",
    name: "Tangerine",
    variable: "--font-tangerine",
    style: "Romantic",
  },
  {
    id: "parisienne",
    name: "Parisienne",
    variable: "--font-parisienne",
    style: "Romantic",
  },
];

export const AVAILABLE_BODY_FONTS: FontOption[] = [
  {
    id: "roboto",
    name: "Roboto",
    variable: "--font-roboto",
    style: "Modern",
  },
  {
    id: "jakarta",
    name: "Plus Jakarta Sans",
    variable: "--font-plus-jakarta-sans",
    style: "Modern",
  },
  {
    id: "montserrat",
    name: "Montserrat",
    variable: "--font-montserrat",
    style: "Classic",
  },
  {
    id: "inter",
    name: "Inter",
    variable: "--font-inter",
    style: "Modern",
  },
];

// ── Default configs ─────────────────────────────────────────────────

export const DEFAULT_MARKETING = {
  title: "playfair",
  body: "jakarta",
} as const;
export const DEFAULT_TENANT = { title: "niconne", body: "roboto" } as const;
