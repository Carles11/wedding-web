import "./globals.css";
import { Footer } from "@/4-shared/ui/footer/Footer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Footer
          siteName="Rio Frances"
          author="Carles11"
          repoUrl="https://www.rio-frances.com"
        />
      </body>
    </html>
  );
}
