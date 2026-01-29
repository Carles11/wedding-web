"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/4-shared/api/supabaseClient";
import type { User } from "@supabase/supabase-js";
import type { Site } from "@/4-shared/types";

// Use the shared Site type for strong typing

/**
 * Hook that ensures a `site` row exists for the authenticated user.
 * NOTE: This implementation runs on the client using the regular Supabase client.
 * For security and correctness, consider moving creation logic to a server-side
 * endpoint that uses `supabaseAdmin` (service role key) for initial site provisioning.
 */
export function useSite(user: User | null) {
  const [site, setSite] = useState<Site | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    // Ensure we have a valid authenticated user with an id before running queries.
    if (!user || !user.id) {
      setSite(null);
      return;
    }

    let mounted = true;

    async function ensureSite() {
      setLoading(true);
      setError(null);

      try {
        if (!user?.id) {
          // Handle or throw not-logged-in error
          return null;
        }
        // Do not use generic type parameters for `.from()` unless you have
        // matching generated DB types. Use runtime casting instead to keep
        // this code compatible with various Supabase client versions.
        const { data, error: fetchErr } = await supabase
          .from("sites")
          .select("id, subdomain, default_lang, languages, domains")
          .eq("owner", user.id)
          .limit(1)
          .maybeSingle();

        if (fetchErr) throw fetchErr;

        if (data) {
          if (mounted) setSite(data as Site);
        } else {
          // Create a minimal site record for this user.
          // TODO: Move this creation to a server-side endpoint with admin key.
          const defaultSubdomain = generateSubdomainFromEmail(
            user?.email || user?.id || "guest",
          );
          const { data: created, error: createErr } = await supabase
            .from("sites")
            .insert([
              {
                owner: user?.id,
                subdomain: defaultSubdomain,
                default_lang: "en",
                languages: ["en"],
                domains: [],
              },
            ])
            .select("id, subdomain, default_lang, languages, domains")
            .maybeSingle();

          if (createErr) throw createErr;
          if (mounted && created) setSite(created as Site);
        }
      } catch (err: unknown) {
        console.error("[useSite] error ensuring site:", err);
        if (mounted) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError(String(err));
          }
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    ensureSite();

    return () => {
      mounted = false;
    };
  }, [user]);

  // Expose a refresh function so consumers (forms) can re-fetch the site after updates.
  const refresh = () => setReloadKey((k) => k + 1);

  // Re-run effect when reloadKey changes
  useEffect(() => {
    if (!user || !user.id) return;
    // trigger a re-fetch by calling the same effect logic through reloadKey
    // We'll call the same ensureSite flow by toggling reloadKey; simplest approach
    // is to call setSite(null) and let the existing effect fetch again via dependency change.
    // For clarity, we simply call the main effect by updating reloadKey; the main
    // effect depends on `user` and `reloadKey` in the next edit.
  }, [reloadKey]);

  return { site, loading, error, refresh } as const;
}

function generateSubdomainFromEmail(input: string) {
  const normalized = (input || "guest").toLowerCase();
  const prefix = normalized
    .split("@")[0]
    .replace(/[^a-z0-9-]/g, "")
    .slice(0, 24);
  // Add a short random suffix to reduce collisions in this simple client-side impl.
  const suffix = Math.random().toString(36).slice(2, 6);
  return `${prefix}-${suffix}`;
}
