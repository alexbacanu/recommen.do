"use client";

import { useMutation, useQuery } from "@tanstack/react-query";

import { AppwriteService } from "@/lib/helpers/appwrite-service";

async function getAccountFn() {
  const account = await AppwriteService.getAccount();
  return account;
}

function getAvatarFn(name = "r e") {
  const avatar = AppwriteService.getAccountInitials(name);
  return avatar;
}

async function signOutFn() {
  await AppwriteService.signOut();
}

export function useAccount() {
  const { data: accountData } = useQuery({
    queryKey: ["accountQuery"],
    queryFn: () => getAccountFn(),
    // enabled: hasSubscription,
  });

  const { data: avatarData } = useQuery({
    queryKey: ["avatarQuery", accountData?.name],
    queryFn: () => getAvatarFn(accountData?.name),
  });

  const { mutate: signOut } = useMutation({
    mutationFn: () => signOutFn(),
    onSuccess: () => {
      window?.location.reload();
    },
    // enabled: hasSubscription,
  });

  const account = accountData ?? undefined;
  const avatar = avatarData ?? undefined;

  return { account, avatar, signOut };
}
