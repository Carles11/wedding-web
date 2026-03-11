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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${roboto.className} ${roboto.variable} ${niconne.variable}`}
    >
      <body>
        {children}
        <ToastProvider />
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
