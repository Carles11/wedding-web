// 4-shared/ui/TenantAnalyticsTracker.tsx
"use client";

import { useEffect } from "react";

export function TenantAnalyticsTracker({
  siteId,
  isCustomDomain,
}: {
  siteId: string;
  isCustomDomain: boolean;
}) {
  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).gtag) {
      // Use 'event' to signal a specific site type
      (window as any).gtag("event", "page_view", {
        site_type: "wedding_instance",
        wedding_id: siteId,
        is_custom_domain: isCustomDomain,
        send_to: process.env.NEXT_PUBLIC_GA_ID,
      });

      // Also fire the conversion event you created in the UI
      (window as any).gtag("event", "generate_wedding_site", {
        wedding_id: siteId,
      });
    }
  }, [siteId, isCustomDomain]);

  return null; // This component renders nothing, it only handles the side effect
}
