import type { Metadata } from "next";

import { redirect } from "next/navigation";

import { FormForgot } from "@/components/auth/form-forgot";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shell } from "@/components/ui/shell";
import { appwriteUrl } from "@/lib/envClient";
import { SSOCallbackSchema } from "@/lib/validators/schema";

export const metadata: Metadata = {
  title: "Forgot Callback",
};

interface ForgotCallbackPageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export default function ForgotCallbackPage({ searchParams }: ForgotCallbackPageProps) {
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
      <div className="flex flex-col gap-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Forgot password</CardTitle>
            <CardDescription className="text-muted-foreground">Choose your new password</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <FormForgot searchParams={{ userId, secret }} />
          </CardContent>
        </Card>
      </div>
    </Shell>
  );
}
