import { useEffect, useRef, useState } from "react";
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

  // Store a ref to the in-flight fetch resolver so refresh() can await it.
  const resolveRefresh = useRef<(() => void) | null>(null);

  const fetchSite = async () => {
    if (!user?.id) {
      setSite(null);
      return;
    }

    setLoading(true);
    setError(null);

    const supabase = createClient();

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
        .eq("owner_user_id", user.id)
        .limit(1)
        .maybeSingle();

      if (fetchErr) throw fetchErr;

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

      setSite(data ? { ...data } : null);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError(String(err));
    } finally {
      setLoading(false);
      // Resolve any awaiting refresh() callers
      resolveRefresh.current?.();
      resolveRefresh.current = null;
    }
  };

  useEffect(() => {
    fetchSite();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  /**
   * Awaitable refresh: resolves only after the fetch fully completes
   * and state has been updated.
   */
  const refresh = (): Promise<void> => {
    return new Promise((resolve) => {
      resolveRefresh.current = resolve;
      fetchSite();
    });
  };

  return { site, loading, error, refresh } as const;
}
