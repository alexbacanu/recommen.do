"use client";

import { useAtomValue } from "jotai";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { CardAccount } from "@/components/profile/card-account";
import { CardAPIKey } from "@/components/profile/card-apikey";
import { CardHistory } from "@/components/profile/card-history";
import { CardLegal } from "@/components/profile/card-legal";
import { CardSupport } from "@/components/profile/card-support";
import { CardUsage } from "@/components/profile/card-usage";
import { Card } from "@/components/ui/card";
import { LoadingPage } from "@/components/ui/loading";
import { accountAtom } from "@/lib/atoms/auth";

export function Dashboard() {
  const account = useAtomValue(accountAtom);
  const router = useRouter();

  useEffect(() => {
    if (account === false) {
      router.push("/sign-in");
    }
  }, [account, router]);

  if (account)
    return (
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-[0.8fr_0.7fr_0.8fr]">
        <Card>
          <CardAccount />
          <CardAPIKey />
          <CardSupport />
          <CardLegal />
        </Card>

        <Card>
          <CardUsage />
        </Card>

        <Card>
          <CardHistory />
        </Card>
      </div>
    );

  return <LoadingPage />;
}
