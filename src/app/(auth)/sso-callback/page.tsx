import { type Metadata } from "next";

import { SSOCallback } from "@/components/auth/sso-callback";
import { Shell } from "@/components/ui/shell";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your account",
};

interface SSOCallbackPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function SSOCallbackPage({ searchParams }: SSOCallbackPageProps) {
  return (
    <Shell layout="auth">
      <SSOCallback searchParams={searchParams} />
    </Shell>
  );
}
