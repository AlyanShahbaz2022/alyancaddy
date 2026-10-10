import type { Metadata, Viewport } from "next";
import { Archivo_Black, Inter } from "next/font/google";
import "./globals.css";
import SiteShell from "@/components/layout/SiteShell";
import { getContent } from "@/lib/getContent";
import { plainText, seoKeywords, siteUrl } from "@/lib/seo";

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

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  colorScheme: "dark",
};

export async function generateMetadata(): Promise<Metadata> {
  const content = await getContent();
  const base = siteUrl(content);
  const title = plainText(content.site.title) || content.site.name;
  const description = content.site.description;

  return {
    metadataBase: new URL(base),
    title: { default: title, template: `%s | ${content.site.brandDisplay}` },
    description,
    keywords: seoKeywords(content),
    applicationName: content.site.brandDisplay,
    authors: [{ name: content.site.name, url: base }],
    creator: content.site.name,
    publisher: content.site.name,
    category: "technology",
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: "/",
      siteName: content.site.brandDisplay,
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    formatDetection: { telephone: false, email: false, address: false },
    ...(process.env.GOOGLE_SITE_VERIFICATION
      ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } }
      : {}),
  };
}

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
