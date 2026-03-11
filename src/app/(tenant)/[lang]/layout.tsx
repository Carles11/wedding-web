import ScrollToTopButton from "@/4-shared/ui/commons/scroll/ScrollToTopButton";

export default function TenantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <ScrollToTopButton />
    </>
  );
}
