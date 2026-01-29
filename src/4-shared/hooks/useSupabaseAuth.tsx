"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/4-shared/api/supabaseClient";
import type { Session, User } from "@supabase/supabase-js";

export function useSupabaseAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

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

      // Subscribe to auth changes
      const { data: listener } = supabase.auth.onAuthStateChange(
        (_, newSession) => {
          if (!mounted) return;
          setSession(newSession ?? null);
          setUser(newSession?.user ?? null);
        },
      );

      return () => {
        mounted = false;
        listener?.subscription?.unsubscribe();
      };
    }

    const cleanup = init();
    return () => {
      // Nothing here; the init() returns cleanup for listener
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
  };

  return { session, user, loading, signOut } as const;
}
