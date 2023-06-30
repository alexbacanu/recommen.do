import "https://www.googletagmanager.com/gtag/js?id=$PLASMO_PUBLIC_GTAG_ID";

import { useEffect } from "react";

import AuthRequiredCard from "@/components/extension/auth-required";
import { Dashboard } from "@/components/profile/dashboard";
import { accountAtom } from "@/lib/atoms/auth";
import ReactQueryProvider from "@/lib/providers/react-query";

import "@/styles/globals.css";

import { useAtomValue } from "jotai";

import { Init } from "@/components/_init/init-auth";
import { Toaster } from "@/components/ui/toaster";
import { gtagId } from "@/lib/envClient";

export default function IndexPopup() {
  const account = useAtomValue(accountAtom);

  useEffect(() => {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments); // eslint-disable-line
    };
    window.gtag("js", new Date());
    window.gtag("config", gtagId, {
      page_path: "/popup",
      debug_mode: true,
    });

    window.gtag("event", "login", {
      method: "TEST",
    });
  }, []);

  return (
    <>
      <Init />
      <ReactQueryProvider>
        <section id="popup_page" className="min-w-[520px]">
          <div className="mx-auto flex max-w-7xl flex-col gap-y-4 p-8">
            {account ? <Dashboard /> : <AuthRequiredCard />}
          </div>
        </section>
      </ReactQueryProvider>
      <Toaster />
    </>
  );
}
