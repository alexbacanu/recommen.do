import { Dashboard } from "~/components/layout/dashboard";
import { Init } from "~/components/layout/init";

import "~/styles/globals.css";

export default function IndexPopup() {
  return (
    <section id="popup_page" className="min-w-[420px]">
      <Init />
      <Dashboard />
    </section>
  );
}
