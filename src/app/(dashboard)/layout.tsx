import { ReactNode } from "react";
import { getCurrentUserSubscription } from "@/4-shared/api/builder/getCurrentUserSubscription";
import { getCurrentUser } from "@/3-entities/user/api/getCurrentUser";
import { PlanProvider } from "../providers";
import { redirect } from "next/navigation"; // Add this line

type DashboardLayoutProps = {
  children: ReactNode;
};

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const user = await getCurrentUser();
  if (!user) {
    console.log({ user });
    redirect("/auth/login"); // <-- Redirect IMMEDIATELY if unauthenticated!
  }
  const subscription = await getCurrentUserSubscription(user.id);
  console.log({ subscription });

  return <PlanProvider subscription={subscription}>{children}</PlanProvider>;
}
