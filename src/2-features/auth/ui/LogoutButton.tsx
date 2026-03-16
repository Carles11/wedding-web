"use client";

import { useSupabaseAuth } from "@/4-shared/hooks/useSupabaseAuth";
import { MarketingButton } from "@/4-shared/ui/marketing";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
    <MarketingButton
      variant="auth-outline"
      loading={isLoggingOut}
      loadingLabel="Logging out..."
      onClick={handleLogout}
      aria-label={isLoggingOut ? "Logging out" : "Logout"}
    >
      {isLoggingOut ? "Logging out..." : "Logout"}
    </MarketingButton>
  );
}
