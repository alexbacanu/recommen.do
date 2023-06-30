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
import { CardSupport } from "@/components/profile/card-support";
import { CardUsage } from "@/components/profile/card-usage";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/toaster";
import { gtagId } from "@/lib/envClient";

export default function IndexPopup() {
  const account = useAtomValue(accountAtom);
  const extensionDetected = !window?.next;

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
        {account ? (
          <Tabs defaultValue="account" className="h-[600px] w-[380px] overflow-hidden bg-primary-foreground">
            <TabsContent value="account" className="max-h-[544px] overflow-auto">
              <div>
                <CardUsage />
              </div>
            </TabsContent>

            <TabsContent value="history" className="max-h-[544px] overflow-auto">
              <div>
                <CardHistory />
              </div>
            </TabsContent>

            <TabsContent value="settings" className="max-h-[544px] overflow-auto">
              <div>
                <CardAccount />
                <CardAPIKey />
                <CardSupport />
                <CardLegal />
              </div>
            </TabsContent>

            <TabsList className="fixed bottom-0 grid w-full grid-cols-3 rounded-none border-t border-gray-300 shadow-inner">
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
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
