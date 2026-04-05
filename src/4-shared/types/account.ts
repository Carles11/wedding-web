export interface AccountInfo {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  preferred_language: string | null;
  created_at: string;
  updated_at: string;
  onboarding_completed: boolean | null;
  plan_type: string | null;
  last_activity_at: string | null;
}
