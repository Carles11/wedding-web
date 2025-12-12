import ScrollToTopButton from "@/4-shared/ui/scroll/ScrollToTopButton";

export default async function RootLayout({
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
