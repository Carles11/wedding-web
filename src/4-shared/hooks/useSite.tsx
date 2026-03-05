import { useEffect, useState } from "react";
import { createClient } from "@/4-shared/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import type { Site } from "@/4-shared/types";

/**
 * Hook to fetch (but NOT create) a `site` row for the authenticated user.
 */
export function useSite(user: User | null) {
  const [site, setSite] = useState<Site | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!user || !user.id) {
      setSite(null);
      return;
    }

    let mounted = true;
    const supabase = createClient();

    async function fetchSite() {
      setLoading(true);
      setError(null);

      try {
        const { data, error: fetchErr } = await supabase
          .from("sites")
          .select(
            `
            id,
            title,
            subdomain,
            default_lang,
            languages,
            domains,
            pending_custom_domains,
            domain_statuses
          `,
          )
          .eq("owner_user_id", user?.id)
          .limit(1)
          .maybeSingle();

        if (fetchErr) throw fetchErr;

        // ✨ Parse JSON fields if needed
        if (data) {
          if (typeof data.domain_statuses === "string") {
            try {
              data.domain_statuses = JSON.parse(data.domain_statuses);
            } catch {}
          }
          if (!Array.isArray(data.pending_custom_domains)) {
            data.pending_custom_domains = [];
          }
        }

        if (mounted) setSite((data as Site) ?? null);
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        else setError(String(err));
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchSite();

    return () => {
      mounted = false;
    };
  }, [user, reloadKey]);

  // Expose a refresh function for consumers to re-fetch the site after updates.
  const refresh = () => setReloadKey((k) => k + 1);

  return { site, loading, error, refresh } as const;
}
