import "./globals.css";
import { Footer } from "@/4-shared/ui/footer/Footer";
import { Roboto, Niconne } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

const roboto = Roboto({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-roboto",
  display: "swap",
});

const niconne = Niconne({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-niconne",
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const payingCustomer = true;

  return (
    <html
      lang="en"
      className={`${roboto.className} ${roboto.variable} ${niconne.variable}`}
    >
      <body>
        {children}
        {payingCustomer && (
          <Footer
            siteName="Weddweb.com"
            author="Carles del Río Francés"
            repoUrl="https://www.rio-frances.com"
          />
        )}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
