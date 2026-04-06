jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => "/en",
}));

jest.mock("@/4-shared/hooks/useSupabaseAuth", () => ({
  useSupabaseAuth: () => ({
    user: null,
    supabase: {
      auth: {
        getSession: async () => ({ data: { session: null } }),
      },
    },
  }),
}));

import { Footer } from "@/4-shared/ui/commons/footer/Footer";
import "@testing-library/jest-dom";
import { render, screen, within } from "@testing-library/react";
import MarketingPageComponent from "../MarketingPageComponent";

// Minimal test translations, adjust keys if needed!
const translations = {
  "marketing.hero.headline": "Create Stunning Wedding Websites",
  "marketing.hero.subheadline": "Multilingual, SaaS-ready, for all events",
  "marketing.hero.cta_primary": "Start creating free",
  "marketing.hero.cta_secondary": "View Example Site",
  "marketing.faq.title": "Frequently Asked Questions",
  "marketing.cta.button_text": "Start Free Now",
  "marketing.pricing.premium_plan_cta": "Get Started",
  "marketing.lang_selector.label": "Language",
  // Add any more keys your view model might access!
};

describe("MarketingPageComponent (SEO & Semantic)", () => {
  beforeEach(() => {
    render(
      <>
        <MarketingPageComponent initialLang="en" translations={translations} />,
        <Footer lang="en" translations={translations} />
      </>,
    );
  });

  it("renders SEO-critical headline in <h1>", () => {
    // Looks for <h1>, e.g., 'Create Stunning Wedding Websites'
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      /wedding|event|celebration/i,
    );
  });

  it("renders signup and login CTAs as links or buttons", () => {
    // At least one is present as a link or button
    expect(
      screen.getByRole("button", {
        name: /Start Creating free | Get Started Free/i,
      }),
    ).toBeInTheDocument();
    // May also be a button somewhere for login
    expect(
      screen.getAllByRole("button", { name: /Start Free Now|Get Started/i })[0],
    ).toBeInTheDocument();
  });

  it("renders FAQ CTA or link for navigation", () => {
    // Accept any link with FAQ/Questions/Help in the accessible name
    const faqLinks = screen.getAllByRole("link", {
      name: /faq|questions|help/i,
    });
    expect(faqLinks.length).toBeGreaterThan(0);

    // (Optional) Assert that at least one of them has text "FAQ"
    expect(
      faqLinks.some((link) => link.textContent.match(/faq/i)),
    ).toBeTruthy();
  });

  it("includes a visible language selector", () => {
    expect(screen.getByLabelText(/language/i)).toBeInTheDocument();
  });

  it("shows semantic footer with legal/privacy links", () => {
    const footer = screen.getByRole("contentinfo");
    expect(footer).toBeInTheDocument();

    expect(
      within(footer).getByRole("link", { name: /privacy policy/i }),
    ).toBeInTheDocument();

    expect(
      within(footer).getByRole("link", { name: /terms of service/i }),
    ).toBeInTheDocument();

    expect(
      within(footer).getByRole("link", { name: /cookie policy/i }),
    ).toBeInTheDocument();
  });
});
