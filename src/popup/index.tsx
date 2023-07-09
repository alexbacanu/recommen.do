import "https://www.googletagmanager.com/gtag/js?id=$PLASMO_PUBLIC_GTAG_ID";

import { useEffect } from "react";

import { accountAtom } from "@/lib/atoms/auth";
import ReactQueryProvider from "@/lib/providers/react-query";

import "@/styles/globals.css";

import { useAtomValue } from "jotai";

import { Init } from "@/components/_init/init-auth";
import AuthRequiredCard from "@/components/extension/auth-required";
import { CardAccount } from "@/components/profile/card-account";
import { CardAPIKey } from "@/components/profile/card-apikey";
import { CardHistory } from "@/components/profile/card-history";
import { CardLegal } from "@/components/profile/card-legal";
import { CardSessions } from "@/components/profile/card-sessions";
import { CardSubscription } from "@/components/profile/card-subscription";
import { CardSupport } from "@/components/profile/card-support";
import { CardUsage } from "@/components/profile/card-usage";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/toaster";
import { gtagId } from "@/lib/envClient";

export default function IndexPopup() {
  const account = useAtomValue(accountAtom);

  useEffect(() => {
    window.dataLayer = window.dataLayer || []; // eslint-disable-line
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
      <ReactQueryProvider>
        <Init />
        {account ? (
          <Tabs defaultValue="account" className="min-h-[600px] w-[380px] overflow-hidden">
            <TabsContent
              value="account"
              className="mx-auto max-h-[calc(100vh-56px)] min-h-[544px] max-w-3xl overflow-auto"
            >
              <CardAccount />
              <CardUsage />
              <CardSubscription />
            </TabsContent>

            <TabsContent
              value="history"
              className="mx-auto max-h-[calc(100vh-56px)] min-h-[544px] max-w-3xl overflow-auto"
            >
              <CardHistory />
            </TabsContent>

            <TabsContent
              value="settings"
              className="mx-auto max-h-[calc(100vh-56px)] min-h-[544px] max-w-3xl overflow-auto"
            >
              <CardAPIKey />
              <CardSessions />
              <CardSupport />
              <CardLegal />
            </TabsContent>

            <TabsList className="fixed bottom-0 top-auto grid w-full grid-cols-3  rounded-none border-t border-gray-300 shadow-inner">
              <TabsTrigger value="account" className="select-none">
                Account
              </TabsTrigger>
              <TabsTrigger value="history" className="select-none">
                History
              </TabsTrigger>
              <TabsTrigger value="settings" className="select-none">
                Settings
              </TabsTrigger>
            </TabsList>
          </Tabs>
        ) : (
          <div className="w-[380px]">
            <AuthRequiredCard />
          </div>
        )}
      </ReactQueryProvider>
      <Toaster />
    </>
  );
}
