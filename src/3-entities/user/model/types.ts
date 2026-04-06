import type { User, Session } from "@supabase/supabase-js";

/**
 * Re-export of Supabase User type for app-wide consistency
 */
export type AppUser = User;

/**
 * Extended user profile type that includes additional app-specific fields
 * Extends the base Supabase User with wedding SaaS specific properties
 */
export type UserProfile = User & {
  /** User role in the system */
  role?: "admin" | "guest" | "tenant_admin";
  /** ISO timestamp of when the user profile was created */
  created_at?: string;
  /** Site ID for multi-tenant support - links user to their wedding site */
  site_id?: string;
};

/**
 * Authentication state type used throughout the app
 * Represents the current auth status and session information
 */
export type AuthState = {
  /** Current authenticated user or null if not logged in */
  user: AppUser | null;
  /** Current session or null if not authenticated */
  session: Session | null;
  /** Loading state during auth operations */
  loading: boolean;
};
