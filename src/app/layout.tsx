import {
  Lora,
  Niconne,
  Playfair_Display,
  Plus_Jakarta_Sans,
  Roboto,
} from "next/font/google";
import "./globals.css";

// Initialize fonts
const niconne = Niconne({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-niconne",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display",
});

const roboto = Roboto({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`
        ${roboto.className}
        ${niconne.variable} 
        ${playfair.variable} 
        ${roboto.variable} 
        ${lora.variable} 
        ${jakarta.variable} 
        antialiased
      `}
      >
        {children}
      </body>
    </html>
  );
}
