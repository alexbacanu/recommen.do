"use client";

import { useAtomValue } from "jotai";
import { redirect } from "next/navigation";
import { useEffect } from "react";

import { CardAccount } from "@/components/profile/card-account";
import { CardAPIKey } from "@/components/profile/card-apikey";
import { CardHistory } from "@/components/profile/card-history";
import { CardSupport } from "@/components/profile/card-support";
import { CardUsage } from "@/components/profile/card-usage";
import { Card } from "@/components/ui/card";
import { accountAtom, profileAtom } from "@/lib/atoms/auth";
import { useAccount } from "@/lib/hooks/use-account";

export function Dashboard() {
  const account = useAtomValue(accountAtom);
  const profile = useAtomValue(profileAtom);

  const { signOut } = useAccount();

  useEffect(() => {
    if (account === false || profile === false) {
      redirect("/sign-in"); // replace with window.something
    }
  }, [account, profile]);

  // if (account && profile)
  return (
    <div className="grid grid-cols-2 gap-8">
      <Card>
        <CardAccount />

        <CardUsage />

        <CardAPIKey />

        <CardSupport />
      </Card>
      <Card>
        <CardHistory />
      </Card>
    </div>
  );

  return null;
}
