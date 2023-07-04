"use client";

import { useQuery } from "@tanstack/react-query";

import { useAccount } from "@/lib/hooks/use-account";

export function Init() {
  const { fetchAccount, fetchProfile } = useAccount();

  useQuery({
    queryKey: ["account"],
    queryFn: fetchAccount,
  });

  useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
  });

  return null;
}
