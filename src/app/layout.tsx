import { Inter } from "next/font/google";

import GoogleAnalytics from "@/components/_analytics/google-analytics";
import CookieButton from "@/components/_cookies/button";
import { Init } from "@/components/_init/init-auth";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Toaster } from "@/components/ui/toaster";
import { siteConfig } from "@/lib/config/browser";
import { cn } from "@/lib/helpers/utils";
import ReactQueryProvider from "@/lib/providers/react-query";

import "@/styles/globals.css";

import type { Metadata } from "next";

import { appwriteUrl } from "@/lib/envClient";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(appwriteUrl),
  alternates: {
    canonical: "/",
  },

  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,

  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: appwriteUrl,
    siteName: siteConfig.name,
    images: [
      {
        url: `${appwriteUrl}/cover.png`,
        width: 1341,
        height: 842,
        alt: "Screenshot of recommen.do website",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    site: appwriteUrl,
    images: [`${appwriteUrl}/cover.png`],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn("subpixel-antialiased", inter.className)}>
      <GoogleAnalytics />
      <body className="subpixel-antialiased">
        <ReactQueryProvider>
          <Init />
          <Header />
          <main className="content-area">{children}</main>
          <Footer />
        </ReactQueryProvider>
        <CookieButton />

        <Toaster />
      </body>
    </html>
  );
}
