import type { Metadata } from "next";

import Cookies from "./cookies.mdx";

export const metadata: Metadata = {
  title: "Cookies Policy",
};

export default function CookiesPage() {
  return (
    <section id="cookies_page">
      <div className="mx-auto flex max-w-7xl flex-col gap-y-4 p-4">
        <Cookies />
      </div>
    </section>
  );
}
