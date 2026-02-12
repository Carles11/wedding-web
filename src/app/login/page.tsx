import type { Metadata } from "next";
import LoginForm from "@/2-features/auth/ui/LoginForm";

export const metadata: Metadata = {
  title: "Login | WeddWeb",
  description: "Login to your wedding website dashboard",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
