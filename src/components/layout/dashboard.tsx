"use client";

import { Account } from "@/components/tabs/account";
import { Alerts } from "@/components/tabs/alerts";
import { Login } from "@/components/tabs/login";
import { Subscription } from "@/components/tabs/subscription";
import { useAccount } from "@/lib/hooks/use-account";
import { useProfile } from "@/lib/hooks/use-profile";

export function Dashboard() {
  const { account } = useAccount();
  const profile = useProfile();
  // const account = useAtomValue(accountAtom);
  // const profile = useAtomValue(profileAtom);

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
