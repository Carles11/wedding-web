"use client";

import { useSupabaseAuth } from "@/4-shared/hooks/useSupabaseAuth";
import { BuilderButton } from "@/4-shared/ui/builder";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton({
  currentLang,
  iconOnly = false,
}: {
  currentLang: string;
  iconOnly?: boolean;
}) {
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
      router.push(`/${currentLang}`);
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (iconOnly) {
    return (
      <button
        onClick={handleLogout}
        disabled={isLoggingOut}
        aria-label={isLoggingOut ? "Logging out" : "Logout"}
        className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
      >
        {isLoggingOut ? (
          /* Spinner */
          <svg
            className="animate-spin w-[15px] h-[15px]"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
            />
          </svg>
        ) : (
          /* Log-out arrow icon */
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-[15px] h-[15px]"
            aria-hidden="true"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        )}
      </button>
    );
  }

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
