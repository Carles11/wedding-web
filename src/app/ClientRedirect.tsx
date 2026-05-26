"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ClientRedirect() {
  const router = useRouter();
  useEffect(() => {
    // Only run on client, as a safety net for humans
    if (typeof window !== "undefined") {
      router.replace("/en");
    }
  }, [router]);
  return null;
}
