"use client";

import { useQuery } from "@tanstack/react-query";

import { AppwriteService } from "@/lib/helpers/appwrite-service";

async function getProfile() {
  const profile = await AppwriteService.getProfile();
  return profile;
}

export function useProfile() {
  const { data } = useQuery({
    queryKey: ["profileQuery"],
    queryFn: () => getProfile(),
    // enabled: hasSubscription,
  });

  const profile = data ?? undefined;
  return profile;
}
