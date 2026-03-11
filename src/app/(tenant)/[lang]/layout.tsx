import { Footer } from "@/4-shared/ui/commons/footer/Footer";
import ScrollToTopButton from "@/4-shared/ui/commons/scroll/ScrollToTopButton";
import { shouldShowFooter } from "@/4-shared/utils/shouldShowFooter";
import { headers } from "next/headers";

export default async function TenantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const host = ((await headers()).get("host") ?? "").toLowerCase().trim();
  const showFooter = await shouldShowFooter({ host, routeKind: "tenant" });

  return (
    <>
      {children}
      <ScrollToTopButton />
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
