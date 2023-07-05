"use client";

import { useAtomValue } from "jotai";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { CardAccount } from "@/components/profile/card-account";
import { CardHistory } from "@/components/profile/card-history";
import { CardSessions } from "@/components/profile/card-sessions";
import { CardSubscription } from "@/components/profile/card-subscription";
import { CardSupport } from "@/components/profile/card-support";
import { CardUsage } from "@/components/profile/card-usage";
import { Card } from "@/components/ui/card";
import { LoadingPage } from "@/components/ui/loading";
import { accountAtom, profileAtom } from "@/lib/atoms/auth";

export function Dashboard() {
  const router = useRouter();

  const account = useAtomValue(accountAtom);
  const profile = useAtomValue(profileAtom);

  useEffect(() => {
    if (account === false || profile === false) {
      router.push("/sign-in");
    }
  }, [account, profile, router]);

  if (account && profile)
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
