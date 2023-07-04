"use client";

import { useQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

import { LoadingPage } from "@/components/ui/loading";
import { accountAtom } from "@/lib/atoms/auth";
import { AppwriteService } from "@/lib/clients/client-appwrite";
import { appwriteUrl } from "@/lib/envClient";
import { useAccount } from "@/lib/hooks/use-account";
import { SSOCallbackSchema } from "@/lib/validators/schema";

interface SSOCallbackProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export function SSOCallback({ searchParams }: SSOCallbackProps) {
  const router = useRouter();

  const account = useAtomValue(accountAtom);
  const { fetchAccount, fetchProfile } = useAccount();

  const { searchParams: validatedSearchParams } = SSOCallbackSchema.parse({
    searchParams,
  });

  const userId = validatedSearchParams?.userId;
  const secret = validatedSearchParams?.secret;

  // 0. Define your query.
  const { data: updateMagicURL } = useQuery({
    queryKey: ["updateMagicURL", userId, secret],
    queryFn: async () => {
      if (!userId || !secret) {
        return;
      }

      return await AppwriteService.updateMagicURL(userId, secret);
    },
    enabled: !!userId && !!secret,
  });

  // 0. Define your query.
  const { data: refreshAccounts } = useQuery({
    queryKey: ["refreshAccounts"],
    queryFn: async () => {
      await fetchAccount();
      return await fetchProfile();
    },
    enabled: !!updateMagicURL,
    retry: 5,
  });

  useEffect(() => {
    if (account && refreshAccounts) {
      toast.success("You are signed in!");

      router.push(`${appwriteUrl}/profile`);
      router.refresh();

      return;
    }

    if (!userId || !secret) {
      toast.error("Invalid user ID or secret.");

      router.push(`${appwriteUrl}/`);
      router.refresh();

      return;
    }
  }, [account, refreshAccounts, router, secret, userId]);

  return <LoadingPage />;
}
