import type { Metadata } from "next";
import SignupForm from "@/2-features/auth/ui/SignupForm";

export const metadata: Metadata = {
  title: "Sign Up | WeddWeb",
  description: "Create your wedding website account",
};

export default function SignupPage() {
  return <SignupForm />;
}
