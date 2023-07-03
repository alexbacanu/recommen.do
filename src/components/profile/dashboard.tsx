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
import { accountAtom, profileAtom } from "@/lib/atoms/auth";

export function Dashboard() {
  const account = useAtomValue(accountAtom);
  const profile = useAtomValue(profileAtom);
  const router = useRouter();

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
