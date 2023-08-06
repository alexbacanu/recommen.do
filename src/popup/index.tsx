import { accountAtom, profileAtom } from "@/lib/atoms/auth";
import ReactQueryProvider from "@/lib/providers/react-query";

import "@/styles/globals.css";

import { useStorage } from "@plasmohq/storage/hook";
import { useAtomValue } from "jotai";
import Link from "next/link";

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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/toaster";

export default function IndexPopup() {
  const [userAgreed] = useStorage<boolean>("userAgreed");

  const account = useAtomValue(accountAtom);
  const profile = useAtomValue(profileAtom);

  return (
    <>
      <ReactQueryProvider>
        <Init />
        {/* {account && !account.emailVerification && (
          <Badge variant="outline" className="border-orange-500 text-orange-500">
            <Icons.alert className="mr-2 h-3 w-3" aria-hidden="true" />
            Your email is not verified, you won't be able to login
          </Badge>
        )} */}
        {!userAgreed && (
          <div className="absolute inset-0 z-10 bg-white/10 backdrop-blur-2xl">
            <div className="grid gap-4 p-8">
              <Alert className="flex items-center gap-4">
                {/* <RocketIcon className="h-4 w-4" /> */}
                <div>
                  <Icons.alert className="h-6 w-6" aria-label="alert icon" />
                </div>

                <div className="">
                  <AlertTitle className="font-semibold tracking-normal">Additional permissions required!</AlertTitle>
                  <AlertDescription>
                    In order to use the extension you need to accept the privacy policy in the next page.
                  </AlertDescription>
                </div>
              </Alert>
              <Button variant="default" asChild>
                <Link href="/tabs/onboarding.html" target="_blank" aria-label="Enable recommen.do">
                  Enable recommen.do
                </Link>
              </Button>
            </div>
          </div>
        )}
        {account && profile && account.emailVerification ? (
          <Tabs defaultValue="account" className="min-h-[600px] min-w-[400px] overflow-hidden">
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
          <div className="mx-auto w-[400px]">
            <AuthRequiredCard />
          </div>
        )}
      </ReactQueryProvider>
      <Toaster />
    </>
  );
}
