import { createClient } from "@/4-shared/lib/supabase/client";
import type { Site } from "@/4-shared/types";
import type { User } from "@supabase/supabase-js";
import { useEffect, useRef, useState } from "react";

/**
 * Hook to fetch (but NOT create) a `site` row for the authenticated user.
 */
export function useSite(user: User | null) {
  const [site, setSite] = useState<Site | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lockedSiteId = useRef<string | null>(null);

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
          created_at,
          pending_custom_domains,
          domain_statuses
        `,
        )
        .eq("owner_user_id", user.id)
        .order("created_at", { ascending: true })
        .order("id", { ascending: true });

      if (fetchErr) throw fetchErr;

      const rows = Array.isArray(data) ? data : [];
      const chosenSite =
        (lockedSiteId.current
          ? (rows.find((row) => row.id === lockedSiteId.current) ?? null)
          : null) ??
        rows[0] ??
        null;

      if (rows.length > 1) {
        console.warn("[useSite] Multiple site rows found for owner_user_id", {
          userId: user.id,
          lockedSiteId: lockedSiteId.current,
          availableSiteIds: rows.map((row) => row.id),
          chosenSiteId: chosenSite?.id ?? null,
        });
      }

      if (chosenSite?.id !== lockedSiteId.current) {
        console.log("[useSite] Active site selection changed", {
          userId: user.id,
          previousSiteId: lockedSiteId.current,
          nextSiteId: chosenSite?.id ?? null,
          availableSiteIds: rows.map((row) => row.id),
        });
      }

      lockedSiteId.current = chosenSite?.id ?? null;

      if (chosenSite) {
        if (typeof chosenSite.domain_statuses === "string") {
          try {
            chosenSite.domain_statuses = JSON.parse(chosenSite.domain_statuses);
          } catch {}
        }
        if (!Array.isArray(chosenSite.pending_custom_domains)) {
          chosenSite.pending_custom_domains = [];
        }
      }

      setSite(chosenSite ? { ...chosenSite } : null);
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
