import { redirect } from "next/navigation";

import { EmailCallback } from "@/components/auth/email-callback";
import { Shell } from "@/components/ui/shell";
import { appwriteUrl } from "@/lib/envClient";
import { SSOCallbackSchema } from "@/lib/validators/schema";

interface EmailCallbackPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function EmailCallbackPage({ searchParams }: EmailCallbackPageProps) {
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
      <EmailCallback searchParams={{ userId, secret }} />
    </Shell>
  );
}
