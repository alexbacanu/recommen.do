"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { Icons } from "@/components/ui/icons";
import { AppwriteService } from "@/lib/clients/client-appwrite";
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

        // TODO: replace setTimeout with a retry function
        // We wait here for function to execute, which takes about 900ms
        setTimeout(async () => {
          try {
            await Promise.all([fetchAccount(), fetchProfile()]);
            router.push("/profile");
          } catch (error) {
            console.log("sso-callback.fetchAccount.fetchProfile.error:", error);
            router.push("/homepage");
          }
        }, 2000);
      } catch (error) {
        console.log("sso-callback.updateMagicURL.error:", error);
        router.push("/");
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
