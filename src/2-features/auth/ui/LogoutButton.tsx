"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSupabaseAuth } from "@/4-shared/hooks/useSupabaseAuth";

export default function LogoutButton() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { signOut } = useSupabaseAuth();
  const router = useRouter();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
      // Even if logout fails, redirect to home
      router.push("/");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      aria-label={isLoggingOut ? "Logging out" : "Logout"}
    >
      {isLoggingOut ? "Logging out..." : "Logout"}
    </button>
  );
}
