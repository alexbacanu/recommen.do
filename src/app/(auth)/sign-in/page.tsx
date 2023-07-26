import { type Metadata } from "next";
import Link from "next/link";

import AuthMethods from "@/components/auth/auth-methods";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Shell } from "@/components/ui/shell";

export const metadata: Metadata = {
  title: "Sign In",
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
            <AuthMethods />
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
