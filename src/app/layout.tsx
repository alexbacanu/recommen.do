import { Inter } from "next/font/google";

import GoogleAnalytics from "@/components/analytics/google-analytics";
import CookieButton from "@/components/cookie/button";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/helpers/utils";
import ReactQueryProvider from "@/lib/providers/react-query";

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
