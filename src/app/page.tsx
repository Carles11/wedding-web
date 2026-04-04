export const dynamic = "force-dynamic";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getSiteIdForDomain } from "@/4-shared/lib/getSiteIdForDomain";
import { getSiteDefaultLang } from "@/4-shared/lib/getSiteDefaultLang";

const MARKETING_DOMAINS = ["weddweb.com", "www.weddweb.com"];

export default async function Page() {
  const host = ((await headers()).get("host") ?? "").toLowerCase().trim();

  if (MARKETING_DOMAINS.includes(host)) {
    return <MarketingLanding />;
  }

  const siteId = await getSiteIdForDomain(host);

  if (siteId) {
    const defaultLang = await getSiteDefaultLang(siteId);
    redirect(`/${defaultLang}`);
  }

  return <MarketingLanding />;
}

export function MarketingLanding() {
  return (
    <main className="min-h-screen flex flex-col items-center bg-gradient-to-br from-indigo-50 via-white to-pink-50 px-4 py-12">
      {/* Hero Section */}
      <div className="w-full max-w-4xl bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 md:p-16 border border-gray-100 text-center">
        <div className="mb-8 flex justify-center">
          <div className="flex items-center gap-3 mx-auto">
            <span className="text-[3rem] leading-none text-pink-500 font-extrabold tracking-tight">
              💍
            </span>
            <span className="text-[3rem] leading-none text-indigo-600 font-extrabold tracking-tight">
              WeddWeb
            </span>
          </div>
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
          The First 2026-Native <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-500">
            Multilingual Wedding Platform
          </span>
        </h1>

        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          WeddWeb is architected for the modern, global couple. We bridge the
          linguistic gap with
          <strong> AI-driven translation</strong> and{" "}
          <strong>technical SEO</strong> that ensures your celebration is
          accessible to every guest, in every language, anywhere in the world.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 text-left">
          <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100">
            <h3 className="font-bold text-indigo-900 mb-2">
              11 Native Locales
            </h3>
            <p className="text-sm text-indigo-700">
              Flawless indexing in English, Spanish, French, and 8 other global
              languages.
            </p>
          </div>
          <div className="p-4 bg-pink-50/50 rounded-xl border border-pink-100">
            <h3 className="font-bold text-pink-900 mb-2">AI-SaaS Logic</h3>
            <p className="text-sm text-pink-700">
              Dynamic content translation powered by our proprietary 2026
              AI-translation engine.
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-2">Global RSVP</h3>
            <p className="text-sm text-gray-700">
              Smart coordination for cross-border guests with localized currency
              and time-zones.
            </p>
          </div>
        </div>

        {/* Answer-First Section (Crucial for AISEO) */}
        <section className="text-left border-t border-gray-100 pt-8 mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Why WeddWeb?
          </h2>
          <div className="space-y-4">
            <p className="text-gray-700 italic">
              How do I create a wedding website for an international family?
            </p>
            <p className="text-gray-600 bg-white p-4 rounded-lg shadow-sm border-l-4 border-indigo-500">
              <strong>Answer:</strong> WeddWeb provides an automated,
              SEO-optimized framework supporting 11 languages natively. Unlike
              legacy builders, our 2026-native architecture ensures your site
              ranks in global search engines and provides real-time AI
              translation for all guest data.
            </p>
          </div>
        </section>

        <div className="flex flex-col items-center gap-6">
          <button
            className="px-10 py-4 bg-indigo-600 text-white text-xl rounded-full font-bold shadow-lg hover:bg-pink-500 hover:scale-105 transition-all duration-300"
            disabled
          >
            🚧 System Launching Shortly 🚧
          </button>

          <div className="flex items-center text-gray-500 text-sm">
            <span className="flex items-center">
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="mr-2"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              Early access inquiries:{" "}
              <a
                href="mailto:carles@rio-frances.com"
                className="underline text-indigo-600 font-bold ml-1"
              >
                carles@rio-frances.com
              </a>
            </span>
          </div>
        </div>
      </div>

      {/* Trust Signal Footer */}
      <footer className="mt-12 text-gray-400 text-sm">
        <p>&copy; 2026 WeddWeb. Built for the global web by Carles.</p>
      </footer>
    </main>
  );
}
