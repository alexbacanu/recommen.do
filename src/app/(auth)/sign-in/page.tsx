import { type Metadata } from "next";
import Link from "next/link";

import { FormSignIn } from "@/components/auth/form-sign-in";
import { OAuthSignIn } from "@/components/auth/oauth-sign-in";
import { TermsAgree } from "@/components/auth/terms-agree";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Shell } from "@/components/ui/shell";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your account",
};

export default function SignInPage() {
  return (
    <Shell layout="auth">
      <div className="flex flex-col gap-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Sign in</CardTitle>
            <CardDescription className="text-muted-foreground">Choose your preferred sign in method</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <OAuthSignIn />

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <FormSignIn />
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
        <TermsAgree />
      </div>
    </Shell>
  );
}
