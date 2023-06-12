"use client";

import { useAtomValue } from "jotai";

import { accountAtom } from "~/lib/atoms/appwrite";
import { useAppwrite } from "~/lib/helpers/useAppwrite";

export function Account() {
  const account = useAtomValue(accountAtom);
  const { signOut } = useAppwrite();

  return (
    <section className="placeholder py-24">
      <h2 className="text-2xl">Account</h2>
      <p>{account ? account.name : "Username"}</p>
      <p>{account ? account.email : "Email"}</p>
      <button className="bg-red-500">Delete account</button>
      <button className="bg-blue-300" onClick={() => signOut()}>
        Logout
      </button>
    </section>
  );
}
