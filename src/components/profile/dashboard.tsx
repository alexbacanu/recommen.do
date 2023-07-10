"use client";

import { useMutation } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { CardAccount } from "@/components/profile/card-account";
import { CardHistory } from "@/components/profile/card-history";
import { CardSessions } from "@/components/profile/card-sessions";
import { CardSubscription } from "@/components/profile/card-subscription";
import { CardSupport } from "@/components/profile/card-support";
import { CardUsage } from "@/components/profile/card-usage";
import { Card } from "@/components/ui/card";
import { LoadingPage } from "@/components/ui/loading";
import { accountAtom, profileAtom } from "@/lib/atoms/auth";
import { AppwriteService } from "@/lib/clients/client-appwrite";

export function Dashboard() {
  const router = useRouter();

  const [emailSent, setEmailSent] = useState(false);

  const account = useAtomValue(accountAtom);
  const profile = useAtomValue(profileAtom);

  // 0. Define your mutation.
  const { mutate } = useMutation({
    mutationKey: ["createVerification"],
    mutationFn: async ({ _email }: { _email: string }) => await AppwriteService.createVerification(),
    onSuccess: (_, variables) => {
      router.push(`/sign-in/verify?email=${variables._email}`);
    },
    onSettled: (data, error) => {
      if (!!error) router.push("/");
    },
    cacheTime: 1000 * 60 * 15,
    retry: 0,
  });

  useEffect(() => {
    if (account === false && profile === false) {
      router.push("/sign-in");
    }
  }, [account, profile, router]);

  if (!!account && !account.emailVerification && !emailSent) {
    mutate({ _email: account.email });
    setEmailSent(true);
    return <LoadingPage />;
  }

  if (account && profile && account.emailVerification)
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        <Card>
          <CardAccount />
          <CardSessions />
          <CardSupport />
        </Card>

        <Card>
          <CardUsage />
          <CardSubscription />
        </Card>

        <Card>
          <CardHistory />
        </Card>
      </div>
    );

  return <LoadingPage />;
}
