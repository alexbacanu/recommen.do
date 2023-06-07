"use client";

import { useSetAtom } from "jotai";
import { useEffect } from "react";

import { accountAtom } from "~/lib/atoms/appwrite";
import { useAppwrite } from "~/lib/helpers/useAppwrite";

export function Init() {
  const setAccount = useSetAtom(accountAtom);
  const { getAccount } = useAppwrite();

  useEffect(() => {
    const fetchAccount = async () => {
      const account = await getAccount();
      setAccount(account);
    };

    fetchAccount();
  }, []);

  return null;
}
