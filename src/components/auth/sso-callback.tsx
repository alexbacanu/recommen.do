"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { Icons } from "@/components/ui/icons";
import { AppwriteService } from "@/lib/clients/client-appwrite";
import { retryPromise } from "@/lib/helpers/utils";
import { useAccount } from "@/lib/hooks/use-account";
import { SSOCallbackSchema } from "@/lib/validators/schema";

interface SSOCallbackProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export function SSOCallback({ searchParams }: SSOCallbackProps) {
  const { fetchAccount, fetchProfile } = useAccount();
  const router = useRouter();

  const { searchParams: validatedSearchParams } = SSOCallbackSchema.parse({
    searchParams,
  });

  const userId = validatedSearchParams?.userId;
  const secret = validatedSearchParams?.secret;

  useEffect(() => {
    const updateMagicURL = async () => {
      if (!userId || !secret) {
        return; // TODO: do toast error
      }

      try {
        const response = await AppwriteService.updateMagicURL(userId, secret);
        console.log("sso-callback.updateMagicURL.success:", response);

        await Promise.all([retryPromise(fetchAccount, 3, 500), retryPromise(fetchProfile, 3, 500)]);

        router.push("/profile");
      } catch (error) {
        console.log("sso-callback.updateMagicURL.error:", error);
        router.push("/homepage");
      }
    };

    updateMagicURL();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, secret, router]);

  return (
    <div
      role="status"
      aria-label="Loading"
      aria-describedby="loading-description"
      className="flex items-center justify-center"
    >
      <Icons.spinner className="h-16 w-16 animate-spin" aria-hidden="true" />
    </div>
  );
}
