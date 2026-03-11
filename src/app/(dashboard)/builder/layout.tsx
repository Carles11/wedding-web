import { getCurrentUser } from "@/3-entities/user/api/getCurrentUser";
import { getCurrentUserSubscription } from "@/3-entities/user/api/getCurrentUserSubscription";
import { Footer } from "@/4-shared/ui/commons/footer/Footer";
import { shouldShowFooter } from "@/4-shared/utils/shouldShowFooter";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
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
  const host = ((await headers()).get("host") ?? "").toLowerCase().trim();
  const showFooter = await shouldShowFooter({ host, routeKind: "builder" });

  return (
    <PlanProvider subscription={subscription}>
      {children}
      {showFooter && (
        <Footer
          siteName="Weddweb.com"
          author="Carles del Río Francés"
          repoUrl="https://www.rio-frances.com"
        />
      )}
    </PlanProvider>
  );
}
