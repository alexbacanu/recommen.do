import type { Metadata } from "next";

import { redirect } from "next/navigation";

import { SSOCallback } from "@/components/auth/sso-callback";
import { Shell } from "@/components/ui/shell";
import { appwriteUrl } from "@/lib/envClient";
import { SSOCallbackSchema } from "@/lib/validators/schema";

export const metadata: Metadata = {
  title: "SSO Callback",
};

interface SSOCallbackPageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export default function SSOCallbackPage({ searchParams }: SSOCallbackPageProps) {
  const { searchParams: validatedSearchParams } = SSOCallbackSchema.parse({
    searchParams,
  });

  const userId = validatedSearchParams?.userId;
  const secret = validatedSearchParams?.secret;

  if (!userId || !secret) {
    redirect(`${appwriteUrl}/`);
  }

  return (
    <Shell layout="auth">
      <SSOCallback searchParams={{ userId, secret }} />
    </Shell>
  );
}
