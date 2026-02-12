"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/4-shared/lib/supabase/client";
import type { Session, User } from "@supabase/supabase-js";

/**
 * Client-side auth hook using cookie-based session management.
 *
 * - Manages auth state (session, user, loading)
 * - Auto-subscribes to auth state changes
 * - Provides signOut helper
 *
 * Use in client components that need auth state.
 */
export function useSupabaseAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    let mounted = true;

    async function init() {
      const {
        data: { session: initialSession },
      } = await supabase.auth.getSession();

      if (!mounted) return;
      setSession(initialSession ?? null);
      setUser(initialSession?.user ?? null);
      setLoading(false);
    }

    init();

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, newSession) => {
      if (!mounted) return;
      setSession(newSession ?? null);
      setUser(newSession?.user ?? null);
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, [supabase.auth]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
  };

  return { session, user, loading, signOut, supabase } as const;
}
