import { Inter } from "next/font/google";

import CookieButton from "@/components/cookies/cookie-button";
import { Footer } from "@/components/layout/footer";
import GoogleAnalytics from "@/components/layout/google-analytics";
import { Header } from "@/components/layout/header";
import { Init } from "@/components/layout/init";
import { Toaster } from "@/components/ui/toaster";
import ReactQueryProvider from "@/lib/providers/react-query";
import { cn } from "@/lib/utils";

import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "recommen.do",
  description: "🛍️ Shop smarter and faster with recommen.do, your ultimate shopping companion!",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn("subpixel-antialiased", inter.className)}>
      <GoogleAnalytics />
      <body className="subpixel-antialiased">
        <ReactQueryProvider>
          <Init />
          <Header />
          <main className="min-h-[76.95vh]">{children}</main>
          <Footer />
        </ReactQueryProvider>
        <CookieButton />
        <Toaster />
      </body>
    </html>
  );
}
