import type { Metadata } from "next";

import Privacy from "./privacy.mdx";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <section id="privacy_page">
      <div className="mx-auto flex max-w-7xl flex-col gap-y-4 p-4">
        <Privacy />
      </div>
    </section>
  );
}
