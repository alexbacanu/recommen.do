"use client";

import { useAtomValue } from "jotai";
import { redirect } from "next/navigation";
import { useEffect } from "react";

import { accountAtom, profileAtom } from "@/lib/atoms/auth";

export function Dashboard() {
  const account = useAtomValue(accountAtom);
  const profile = useAtomValue(profileAtom);

  useEffect(() => {
    if (account === false || profile === false) {
      redirect("/sign-in"); // replace with window.something
    }
  }, [account, profile]);

  return <div className="mx-auto flex max-w-7xl flex-col gap-y-4 p-4">Hello</div>;
}
