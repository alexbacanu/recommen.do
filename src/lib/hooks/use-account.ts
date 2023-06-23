"use client";

import { useQuery } from "@tanstack/react-query";

import { AppwriteService } from "@/lib/helpers/appwrite-service";

async function getAccount() {
  const account = await AppwriteService.getAccount();
  return account;
}

export function useAccount() {
  const { data } = useQuery({
    queryKey: ["accountQuery"],
    queryFn: () => getAccount(),
    // enabled: hasSubscription,
  });

  const account = data ?? null;
  return account;
}
