import { getCurrentUser } from "@/3-entities/user/api/getCurrentUser";
import { getCurrentUserSubscription } from "@/3-entities/user/api/getCurrentUserSubscription";
import { fetchMarketingTranslations } from "@/4-shared/api/marketing";
import { isValidLanguage } from "@/4-shared/helpers/isValidLanguage";
import { Footer } from "@/4-shared/ui/commons/footer/Footer";
import { PlanProvider, ToastProvider } from "@/app/providers";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
// import "../../../globals.css";

type DashboardLayoutProps = {
  children: ReactNode;
  params: Promise<{ lang: string }>;
};

export default async function DashboardLayout({
  children,
  params,
}: DashboardLayoutProps) {
  const user = await getCurrentUser();
  const realParams = await params;
  const lang = isValidLanguage(realParams?.lang) ? realParams.lang : "en";
  if (!user) {
    redirect(`/${lang}/auth/login`);
  }

  // Email/password users must confirm their email before accessing builder.
  if (user.email && !user.email_confirmed_at) {
    redirect(`/${lang}/auth/signup?status=verify-email`);
  }

  const subscription = await getCurrentUserSubscription(user.id);

  const marketingTranslations = await fetchMarketingTranslations(lang, "en");

  return (
    <div className="builder-theme">
      <PlanProvider subscription={subscription}>
        {children}
        <ToastProvider />
        <Footer
          siteName="Weddweb.com"
          author="Carles del Río Francés"
          repoUrl="https://github.com/Carles11/"
          translations={marketingTranslations}
          lang={lang}
        />
      </PlanProvider>
    </div>
  );
}
