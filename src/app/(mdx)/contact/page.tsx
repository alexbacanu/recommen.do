import Link from "next/link";

import { FormContact } from "@/components/contact/contact-form";

export default function ContactPage() {
  return (
    <section id="contact_page">
      <div className="mx-auto flex max-w-7xl flex-col gap-y-8 p-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold">Contact</h1>
          <p>
            We would love to hear from you! If you have any questions, suggestions, or feedback, please don&apos;t
            hesitate to reach out. You can contact us at{" "}
            <Link href="mailto:hey@recommen.do" className="text-primary">
              hey@recommen.do
            </Link>
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">FAQ</h2>
          <p>
            Before contacting us, you might find the answer to your question in our Frequently Asked Questions (FAQ)
            section. We have compiled a list of common inquiries to provide you with quick and easy solutions. Please
            visit our{" "}
            <Link href="https://www.recommen.do/faq" className="text-primary">
              FAQ page
            </Link>{" "}
            for more information.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Contact form</h2>
          <FormContact />
        </div>
      </div>
    </section>
  );
}
