import { Inter } from "next/font/google";

import CookieButton from "~/components/cookies/cookie-button";
import { Footer } from "~/components/layout/footer";
import GoogleAnalytics from "~/components/layout/google-analytics";
import { Header } from "~/components/layout/header";
import { Init } from "~/components/layout/init";

import "~/styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "recommen.do",
  description: "🛍️ Shop smarter and faster with recommen.do, your ultimate shopping companion!",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <GoogleAnalytics />
      <CookieButton />
      <body className={inter.className}>
        <Init />
        <Header />
        <main className="min-h-[91.25vh]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
