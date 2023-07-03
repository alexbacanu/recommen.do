"use client";

import { useAtomValue } from "jotai";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { LoadingPage } from "@/components/ui/loading";
import { accountAtom } from "@/lib/atoms/auth";
import { AppwriteService } from "@/lib/clients/client-appwrite";
import { useAccount } from "@/lib/hooks/use-account";
import { SSOCallbackSchema } from "@/lib/validators/schema";

interface SSOCallbackProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export function SSOCallback({ searchParams }: SSOCallbackProps) {
  const account = useAtomValue(accountAtom);
  const { fetchAccount, fetchProfile } = useAccount();
  const router = useRouter();

  const { searchParams: validatedSearchParams } = SSOCallbackSchema.parse({
    searchParams,
  });

  const userId = validatedSearchParams?.userId;
  const secret = validatedSearchParams?.secret;

  useEffect(() => {
    const updateMagicURL = async () => {
      if (!userId || !secret) {
        // toast({
        //   title: "Error",
        //   description: "Invalid user ID or secret.",
        //   variant: "destructive",
        // });
        return;
      }

      if (account) {
        // toast({
        //   title: "Error",
        //   description: "You are already signed in!",
        //   variant: "destructive",
        // });
        return;
      }

      try {
        const response = await AppwriteService.updateMagicURL(userId, secret);
        console.log("sso-callback.updateMagicURL.success:", response);

        // TODO: replace setTimeout with a retry function
        // We wait here for function to execute, which takes about 900ms
        setTimeout(async () => {
          try {
            const response = await Promise.all([fetchAccount(), fetchProfile()]);
            console.log("sso-callback.fetchAccount.fetchProfile.success:", response);
            if (response) router.push("/profile");
          } catch (error) {
            console.log("sso-callback.fetchAccount.fetchProfile.error:", error);
            router.push("/");
          }
        }, 2000);
      } catch (error) {
        console.log("sso-callback.updateMagicURL.error:", error);
        router.push("/");
      }
    };

    updateMagicURL();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, secret, router]);

  return <LoadingPage />;
}
