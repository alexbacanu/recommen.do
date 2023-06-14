import "https://www.googletagmanager.com/gtag/js?id=$PLASMO_PUBLIC_GTAG_ID";

import { useEffect } from "react";

import { Dashboard } from "~/components/layout/dashboard";
import { Init } from "~/components/layout/init";

import "~/styles/globals.css";

export default function IndexPopup() {
  useEffect(() => {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments); // eslint-disable-line
    };
    window.gtag("js", new Date());
    window.gtag("config", process.env.PLASMO_PUBLIC_GTAG_ID, {
      page_path: "/popup",
      debug_mode: true,
    });

    window.gtag("event", "login", {
      method: "TEST",
    });
  }, []);

  return (
    <section id="popup_page" className="min-w-[420px]">
      <Init />
      <Dashboard />
    </section>
  );
}
