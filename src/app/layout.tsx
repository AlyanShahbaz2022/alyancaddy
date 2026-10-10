import type { Metadata } from "next";
import { Archivo_Black, Inter } from "next/font/google";
import "./globals.css";
import SiteShell from "@/components/layout/SiteShell";

const archivoBlack = Archivo_Black({
  variable: "--font-archivo-black",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AlyanCaddy — Muhammad Umar",
  description:
    "Full-stack developer and Shopify expert crafting modern websites, mobile apps, and content. Islamabad / Sargodha, Pakistan.",
  keywords: [
    "AlyanCaddy",
    "alyancaddy",
    "Muhammad Umar",
    "Full-Stack Developer",
    "Shopify Expert",
    "Web Development",
    "App Development",
  ],
  openGraph: {
    title: "AlyanCaddy — Muhammad Umar",
    description:
      "Full-stack developer and Shopify expert crafting modern websites, mobile apps, and content.",
    type: "website",
  },
};

export default function RootLayout(props: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${archivoBlack.variable} ${inter.variable}`}
    >
      <body className="bg-ink font-sans text-white antialiased">
        <div aria-hidden className="noise-overlay" />
        <SiteShell>{props.children}</SiteShell>
      </body>
    </html>
  );
}
