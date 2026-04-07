"use client";

import { useSupabaseAuth } from "@/4-shared/hooks/useSupabaseAuth";
import { BuilderButton } from "@/4-shared/ui/builder";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton({ currentLang }: { currentLang: string }) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { signOut } = useSupabaseAuth();
  const router = useRouter();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
      router.push(`/${currentLang}`);
    } catch (error) {
      console.error("Logout failed:", error);
      // Even if logout fails, redirect to home
      router.push(`/${currentLang}`);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <BuilderButton
      variant="secondary"
      loading={isLoggingOut}
      loadingLabel="Logging out..."
      onClick={handleLogout}
      aria-label={isLoggingOut ? "Logging out" : "Logout"}
    >
      {isLoggingOut ? "Logging out..." : "Logout"}
    </BuilderButton>
  );
}
