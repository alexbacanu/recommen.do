import type { Metadata } from "next";

import Terms from "./terms.mdx";

export const metadata: Metadata = {
  title: "Terms and Conditions",
};

export default function TermsPage() {
  return (
    <section id="terms_page">
      <div className="mx-auto flex max-w-7xl flex-col gap-y-4 p-4">
        <Terms />
      </div>
    </section>
  );
}
