import { FormContact } from "@/components/contact/contact-form";

import Contact from "./contact.mdx";

export default function ContactPage() {
  return (
    <section id="contact_page">
      <div className="mx-auto flex max-w-7xl flex-col gap-y-4 p-4">
        <Contact />
        <FormContact />
      </div>
    </section>
  );
}
