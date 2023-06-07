"use client";

import { useEffect } from "react";

import { useAppwrite } from "~/lib/helpers/useAppwrite";

export function Init() {
  const { getAccount } = useAppwrite();

  useEffect(() => {
    getAccount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
