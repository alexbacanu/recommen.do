"use client";

import { useAtomValue } from "jotai";

import { Account } from "@/components/tabs/account";
import { Alerts } from "@/components/tabs/alerts";
import { Login } from "@/components/tabs/login";
import { Subscription } from "@/components/tabs/subscription";
import { accountAtom, profileAtom } from "@/lib/atoms/appwrite";

export function Dashboard() {
  const account = useAtomValue(accountAtom);
  const profile = useAtomValue(profileAtom);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-y-4 p-4">
      {account && profile && (
        <>
          <Alerts account={account} profile={profile} />
          <Subscription profile={profile} />
          <Account account={account} profile={profile} />
        </>
      )}
      {account && !profile && (
        <>
          <Alerts account={account} profile={profile} />
          <Login />
        </>
      )}
      {!account && <Login />}
    </div>
  );
}
