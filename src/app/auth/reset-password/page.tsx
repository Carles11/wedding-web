import type { Metadata } from "next";
import ResetPasswordForm from "@/2-features/auth/ui/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Reset Password | WeddWeb",
  description: "Set your new password",
};

export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}
