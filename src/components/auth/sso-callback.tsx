"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

import { LoadingPage } from "@/components/ui/loading";
import { profileAtom } from "@/lib/atoms/auth";
import { AppwriteService } from "@/lib/clients/client-appwrite";
import { appwriteUrl } from "@/lib/envClient";

interface SSOCallbackProps {
  searchParams: {
    userId: string;
    secret: string;
  };
}

export function SSOCallback({ searchParams }: SSOCallbackProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const profile = useAtomValue(profileAtom);

  // 0. Define your query.
  const { data: updateMagicURL } = useQuery({
    queryKey: ["updateMagicURL", searchParams.userId, searchParams.secret],
    queryFn: async () => await AppwriteService.updateMagicURL(searchParams.userId, searchParams.secret),
  });

  useEffect(() => {
    if (updateMagicURL) {
      queryClient.invalidateQueries(["account", "profile"]);
      toast.success("You are signed in!");

      if (profile) {
        window.open(`${appwriteUrl}/profile`);
        return;
      }

      window.open(`${appwriteUrl}/`);
      return;
    }
  }, [profile, queryClient, router, updateMagicURL]);

  return <LoadingPage />;
}
