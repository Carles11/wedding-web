"use client";
import { SUPPORTED_LANGUAGES } from "@/4-shared/config/i18n";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LanguageAutoRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Detect browser language
    const browserLang = navigator.language?.split("-")[0] || "en";
    const bestLang = SUPPORTED_LANGUAGES.includes(
      browserLang as (typeof SUPPORTED_LANGUAGES)[number],
    )
      ? (browserLang as (typeof SUPPORTED_LANGUAGES)[number])
      : "en";

    // Redirect to path-based language if not already on it
    const currentPath = window.location.pathname;
    if (currentPath === "/") {
      router.replace(`/${bestLang}`);
    }
  }, [router]);

  return null;
}
