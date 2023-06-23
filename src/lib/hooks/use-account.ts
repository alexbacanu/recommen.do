"use client";

import { useMutation, useQuery } from "@tanstack/react-query";

import { AppwriteService } from "@/lib/helpers/appwrite-service";

async function getAccountFn() {
  const account = await AppwriteService.getAccount();
  return account;
}

async function signOutFn() {
  await AppwriteService.signOut();
}

export function useAccount() {
  const { data } = useQuery({
    queryKey: ["accountQuery"],
    queryFn: () => getAccountFn(),
    // enabled: hasSubscription,
  });

  const { mutate: signOut } = useMutation({
    mutationFn: () => signOutFn(),
    onSuccess: () => {
      window.location.reload();
    },
    // enabled: hasSubscription,
  });

  const account = data ?? undefined;
  return { account, signOut };
}
