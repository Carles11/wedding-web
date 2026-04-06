"use client";

import { SUPPORTED_LANGUAGES, SupportedLanguage } from "@/4-shared/config/i18n";
import { i18n404 } from "@/4-shared/config/seo/i18n404";
import Link from "next/link";
import { usePathname } from "next/navigation";

// REMOVED: import "./globals.css";
/**
 * RootNotFound Component
 * * WHY INLINE STYLES?
 * This page is a "Root" entry point that exists outside the main [lang] layout.
 * By using scoped inline CSS instead of importing the heavy 'globals.css', we:
 * 1. Eliminate a massive render-blocking request for a simple page.
 * 2. Prevent "Flash of Unstyled Content" (FOUC) during 404 redirects.
 * 3. Keep the 404 experience extremely fast and resilient to CSS architecture changes.
 */
export default function RootNotFound() {
  const pathname = usePathname();
  const segments = pathname?.split("/") || [];
  const langCandidate = segments[1] as SupportedLanguage;
  const lang = SUPPORTED_LANGUAGES.includes(langCandidate)
    ? langCandidate
    : "en";

  const dict = i18n404[lang as keyof typeof i18n404] || i18n404.en;

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .nf-container { 
          min-height: 100vh; display: flex; align-items: center; justify-content: center; 
          background: #f9fafb; padding: 0 1rem; font-family: ui-sans-serif, system-ui, sans-serif; 
        }
        .nf-content { max-width: 28rem; width: 100%; text-align: center; }
        .nf-404 { font-size: 8rem; font-weight: 800; color: #f3f4f6; margin-bottom: 1.5rem; user-select: none; line-height: 1; }
        .nf-title { font-size: 1.875rem; font-weight: 700; color: #111827; margin-bottom: 1rem; }
        .nf-desc { color: #4b5563; margin-bottom: 2rem; line-height: 1.6; }
        .nf-actions { display: flex; flex-direction: column; gap: 1rem; justify-content: center; }
        @media (min-width: 640px) { .nf-actions { flex-direction: row; } }
        .btn-main { 
          padding: 0.75rem 1.5rem; border-radius: 0.375rem; color: #fff; font-weight: 600; 
          text-decoration: none; background-color: #6ABDA6; transition: opacity 0.2s;
        }
        .btn-sec { 
          padding: 0.75rem 1.5rem; border-radius: 0.375rem; color: #374151; font-weight: 500; 
          text-decoration: none; border: 1px solid #d1d5db; background: #fff; transition: background 0.2s;
        }
        .btn-main:hover { opacity: 0.9; }
        .btn-sec:hover { background: #f9fafb; }
      `,
        }}
      />

      <main className="nf-container">
        <div className="nf-content">
          <div className="nf-404">404</div>
          <h1 className="nf-title">{dict.title}</h1>
          <p className="nf-desc">{dict.desc}</p>

          <div className="nf-actions">
            <Link href={`/${lang}`} className="btn-main">
              {dict.home}
            </Link>
            <Link href={`/${lang}/faq`} className="btn-sec">
              {dict.faq}
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
