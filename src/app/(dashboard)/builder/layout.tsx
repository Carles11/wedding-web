import { getCurrentUser } from "@/3-entities/user/api/getCurrentUser";
import { getCurrentUserSubscription } from "@/3-entities/user/api/getCurrentUserSubscription";
import { redirect } from "next/navigation"; // Add this line
import { ReactNode } from "react";
import { PlanProvider } from "../../providers";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/auth/login");
  }
  const subscription = await getCurrentUserSubscription(user.id);
  console.log({ subscription });

  return <PlanProvider subscription={subscription}>{children}</PlanProvider>;
}
