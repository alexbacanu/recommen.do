import { type Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { FormForgot } from "@/components/auth/form-forgot";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Shell } from "@/components/ui/shell";
import { appwriteUrl } from "@/lib/envClient";
import { SSOCallbackSchema } from "@/lib/validators/schema";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your account",
};

interface ForgotCallbackPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
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
          <CardFooter>
            <div className="text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Button variant="link" className="h-auto p-0" asChild>
                <Link href="/sign-up" aria-label="Sign up">
                  Sign up
                </Link>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </Shell>
  );
}
