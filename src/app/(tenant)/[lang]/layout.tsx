import ScrollToTopButton from "@/4-shared/ui/scroll/ScrollToTopButton";

type TenantLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
};

/**
 * Tenant layout - sets correct HTML lang attribute per language route.
 *
 * Note: This layout does NOT re-declare <html> or <body> tags because
 * the root layout already provides them with fonts and analytics.
 * We only wrap children to add tenant-specific elements.
 *
 * The lang attribute is set via metadata in the page component instead.
 */
export default async function TenantLayout({ children }: TenantLayoutProps) {
  // We don't use params here since Next.js doesn't allow nested <html> tags
  // The lang attribute will be set via page metadata instead

  return (
    <>
      {children}
      <ScrollToTopButton />
    </>
  );
}
