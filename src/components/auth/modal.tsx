"use client";

import { useAtomValue } from "jotai";
import Link from "next/link";

import { accountAtom } from "~/lib/atoms/appwrite";

export function Modal() {
  const account = useAtomValue(accountAtom);

  return (
    <section className="placeholder py-24">
      <Link href="https://pickassistant.authui.site/">
        <span>{account ? "Logout" : "Login"}</span>
      </Link>
    </section>
  );
}
