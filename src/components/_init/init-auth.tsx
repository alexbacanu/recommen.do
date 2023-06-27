"use client";

import { useEffect } from "react";

import { useAccount } from "@/lib/hooks/use-account";

export function Init() {
  const { fetchAccount, fetchProfile } = useAccount();

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchAccount(), fetchProfile()]);
    };

    fetchData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
