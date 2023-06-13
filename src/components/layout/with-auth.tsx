"use client";

import { useAtomValue } from "jotai";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { accountAtom, isLoadingAtom } from "~/lib/atoms/appwrite";

export default function AuthProtect({ children }: { children: React.ReactNode }) {
  const account = useAtomValue(accountAtom);
  const isLoading = useAtomValue(isLoadingAtom);

  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !account) {
      router.push("https://pickassistant.authui.site/");
    }
  }, [isLoading, account]);

  return account ? <>{children}</> : null;
}
