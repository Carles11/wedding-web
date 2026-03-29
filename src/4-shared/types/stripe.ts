export interface CheckoutResponse {
  success: boolean;
  code?: string;
  planType: string;
  sessionId?: string;
  url?: string;
  redirectTo?: string;
  message?: string;
}

export interface CheckoutClientProps {
  translations: Record<string, string>;
  lang: string;
  initialPlan?: string;
  isSuccess: boolean;
  sessionId?: string;
}
