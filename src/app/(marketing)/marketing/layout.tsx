import { Footer } from "@/4-shared/ui/commons/footer/Footer";
import { shouldShowFooter } from "@/4-shared/utils/shouldShowFooter";
import { headers } from "next/headers";

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const host = ((await headers()).get("host") ?? "").toLowerCase().trim();
  const showFooter = await shouldShowFooter({ host, routeKind: "marketing" });

  return (
    <>
      {children}
      {showFooter && (
        <Footer
          siteName="Weddweb.com"
          author="Carles del Río Francés"
          repoUrl="https://www.rio-frances.com"
        />
      )}
    </>
  );
}
