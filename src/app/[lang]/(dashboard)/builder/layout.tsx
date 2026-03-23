import { getCurrentUser } from "@/3-entities/user/api/getCurrentUser";
import { getCurrentUserSubscription } from "@/3-entities/user/api/getCurrentUserSubscription";
import { Footer } from "@/4-shared/ui/commons/footer/Footer";
import { shouldShowFooter } from "@/4-shared/utils/shouldShowFooter";
import { PlanProvider, ToastProvider } from "@/app/providers";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const user = await getCurrentUser();
  const rawHeaders = await headers();
  const lang = rawHeaders.get("x-lang") || "en";
  if (!user) {
    redirect(`/${lang}/auth/login`);
  }

  // Email/password users must confirm their email before accessing builder.
  if (user.email && !user.email_confirmed_at) {
    redirect(`/${lang}/auth/signup?status=verify-email`);
  }

  const subscription = await getCurrentUserSubscription(user.id);
  const host = ((await headers()).get("host") ?? "").toLowerCase().trim();
  const showFooter = await shouldShowFooter({ host, routeKind: "builder" });

  return (
    <PlanProvider subscription={subscription}>
      {children}
      <ToastProvider />
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
