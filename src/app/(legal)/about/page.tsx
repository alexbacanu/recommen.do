"use client";

import About from "./about.mdx";

export default function AboutPage() {
  return (
    <section id="about_page">
      <div className="mx-auto flex max-w-7xl flex-col gap-y-4 p-4">
        <About />
      </div>
    </section>
  );
}
