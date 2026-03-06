import type { Metadata } from "next";
import ForgotPasswordForm from "@/2-features/auth/ui/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Forgot Password | WeddWeb",
  description: "Reset your password",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
