"use client";

import { useEffect } from "react";

import { useAppwrite } from "@/lib/helpers/use-appwrite";

export function Init() {
  const { getAccount, getProfile } = useAppwrite();

  useEffect(() => {
    getAccount();
    getProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
