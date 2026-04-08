"use client";

import { useSite } from "@/4-shared/hooks/useSite";
import { createClient } from "@/4-shared/lib/supabase/client";
import { CustomLoader } from "@/4-shared/ui/commons/loader/CustomLoader";
import { User } from "@supabase/supabase-js";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function DomainConnectCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState("Finalizing Connection...");
  const hasRun = useRef(false); // Prevent double-triggering in StrictMode

  const { site, verifyDomain } = useSite(user);

  // 1. Initialize User
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  // 2. Main Logic
  useEffect(() => {
    // Only run if we have a user and site, and haven't run it yet
    if (!user || !site || hasRun.current) return;

    const finalize = async () => {
      hasRun.current = true;
      setStatus("Confirming DNS with Registrar...");

      try {
        // GoDaddy usually returns the domain in the query string
        // Fallback to the first pending domain in your DB
        const domain =
          searchParams.get("domain") || site.pending_custom_domains?.[0];

        if (domain) {
          await verifyDomain(domain);
          setStatus("Success! Domain Verified.");
        } else {
          setStatus("Syncing Status...");
        }
      } catch (err) {
        console.warn("Handshake verification pending:", err);
        setStatus("DNS is updating...");
      } finally {
        // Short delay so they see the final status message
        setTimeout(() => router.push("/builder/settings/domain"), 2000);
      }
    };

    finalize();
  }, [user, site, searchParams, verifyDomain, router]);

  return <CustomLoader message={status} />;
}
