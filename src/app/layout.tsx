import { Footer } from "@/4-shared/ui/commons/footer/Footer";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Niconne, Roboto } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "./providers/ToastProvider";

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

export default async function RootLayout({
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
        <ToastProvider />
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
