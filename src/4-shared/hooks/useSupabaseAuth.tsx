"use client";

import { createClient } from "@/4-shared/lib/supabase/client";
import type { Session, User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

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

  /**
   * Securely change the user's email, requiring their current password.
   * Returns { success, error }.
   */
  const changeEmailWithPassword = async (
    currentEmail: string,
    newEmail: string,
    password: string,
    lang: string, // 1. Add lang parameter to send the email in the correct language
  ) => {
    // Step 1: Re-authenticate
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: currentEmail,
      password,
    });
    if (signInError) {
      return { success: false, error: signInError };
    }

    // Step 2: Update email AND metadata
    const { error: updateError } = await supabase.auth.updateUser({
      email: newEmail,
      data: { language: lang }, // 2. This is what the Edge Function reads!
    });

    if (updateError) {
      return { success: false, error: updateError };
    }
    return { success: true };
  };

  return {
    session,
    user,
    loading,
    signOut,
    supabase,
    changeEmailWithPassword,
  } as const;
}
