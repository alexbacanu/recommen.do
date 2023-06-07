import { Inter } from "next/font/google";

import { Footer } from "~/components/layout/footer";
import { Header } from "~/components/layout/header";
import { Init } from "~/components/layout/init";

import "~/styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "🤖 Pick Assistant",
  description: "🛍️ Shop smarter and faster with Pick Assistant, your ultimate shopping companion!",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Init />
        <Header />
        <main className="min-h-[91.25vh]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
