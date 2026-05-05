import type { RsvpAnalyticsData, RsvpAnalyticsJson } from "@/3-entities/rsvp/model/types";
import { useCallback, useEffect, useState } from "react";

type UseRsvpAnalyticsOptions = {
  enabled?: boolean;
};

type UseRsvpAnalyticsReturn = {
  data: RsvpAnalyticsData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

export function useRsvpAnalytics(
  siteId: string,
  options: UseRsvpAnalyticsOptions = {},
): UseRsvpAnalyticsReturn {
  const { enabled = true } = options;
  const [data, setData] = useState<RsvpAnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    if (!enabled || !siteId) {
      setData(null);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/sites/${siteId}/rsvp-analytics`, {
        method: "GET",
        cache: "no-store",
      });
      const json = (await res.json()) as RsvpAnalyticsJson;

      if (!res.ok || !json.success) {
        setError(
          json.success ? "Failed to load RSVP analytics." : json.error,
        );
        setData(null);
        return;
      }

      setData(json.analytics);
    } catch {
      setError("Network error — please try again.");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [enabled, siteId]);

  useEffect(() => {
    void fetchAnalytics();
  }, [fetchAnalytics]);

  return {
    data,
    loading,
    error,
    refetch: fetchAnalytics,
  };
}
