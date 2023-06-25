"use client";

import { Account } from "@/components/profile/profile-account";
import { Alerts } from "@/components/profile/profile-alerts";
import { Login } from "@/components/profile/profile-login";
import { Subscription } from "@/components/profile/profile-subscription";
import { useAccount } from "@/lib/hooks/use-account";
import { useProfile } from "@/lib/hooks/use-profile";

export function Dashboard() {
  const { account } = useAccount();
  const profile = useProfile();

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-y-4 p-4">
      {account && profile && (
        <>
          <Alerts />
          <Subscription />
          <Account />
        </>
      )}
      {account && !profile && (
        <>
          <Alerts />
          <Login />
        </>
      )}
      {!account && <Login />}
    </div>
  );
}
