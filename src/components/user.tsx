"use client";

import { useAtomValue } from "jotai";

import { accountAtom } from "~/lib/atoms/appwrite";

export function User() {
  const account = useAtomValue(accountAtom);

  return <section className="placeholder">{account ? `Hello ${account.name}` : `Not logged in`}</section>;
}
