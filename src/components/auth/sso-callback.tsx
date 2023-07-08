"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { LoadingPage } from "@/components/ui/loading";
import { useToast } from "@/components/ui/use-toast";
import { AppwriteService } from "@/lib/clients/client-appwrite";
import { appwriteUrl } from "@/lib/envClient";
import { useAccount } from "@/lib/hooks/use-account";

interface SSOCallbackProps {
  searchParams: {
    userId: string;
    secret: string;
  };
}

export function SSOCallback({ searchParams }: SSOCallbackProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { fetchProfile } = useAccount();

  const [attempts, setAttempts] = useState(0);

  // 0. Define your query.
  const { isSuccess, isError } = useQuery({
    queryKey: ["updateMagicURL", searchParams.userId, searchParams.secret],
    queryFn: async () => await AppwriteService.updateMagicURL(searchParams.userId, searchParams.secret),
    retry: 1,
  });

  useEffect(() => {
    if (isError) {
      window.open("/", "_self");
    }

    if (isSuccess) {
      queryClient.invalidateQueries(["account", "profile"]);

      toast({
        description: "You are signed in!",
      });

      const checkProfile = async () => {
        const profileData = await fetchProfile();

        if (profileData) {
          return window.open(`${appwriteUrl}/profile`, "_self");
        } else {
          // If no profile found, increment attempts and check again
          if (attempts < 3) {
            setAttempts(attempts + 1);
            const delay = Math.pow(2, attempts) * 1000; // Delay in milliseconds (1, 2, 4 seconds)
            setTimeout(checkProfile, delay);
          } else {
            // No profile found after 3 attempts, redirect to homepage
            window.open("/", "_self"); // Replace with the actual homepage route
          }
        }
      };

      checkProfile();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isError, isSuccess]);

  return <LoadingPage />;
}
