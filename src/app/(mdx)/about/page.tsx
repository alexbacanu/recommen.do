import type { Metadata } from "next";

import About from "./about.mdx";

export const metadata: Metadata = {
  title: "About Us",
};

export default function AboutPage() {
  return (
    <section id="about_page">
      <div className="mx-auto flex max-w-7xl flex-col gap-y-4 p-4">
        <About />
      </div>
    </section>
  );
}
