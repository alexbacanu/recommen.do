"use client";

import { useAtomValue } from "jotai";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect } from "react";

import { FormSignIn } from "@/components/auth/form-sign-in";
import { OAuthSignIn } from "@/components/auth/oauth-sign-in";
import { CardAccount } from "@/components/profile/card-account";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { accountAtom, profileAtom } from "@/lib/atoms/auth";
import { useAccount } from "@/lib/hooks/use-account";

export function Dashboard() {
  const account = useAtomValue(accountAtom);
  const profile = useAtomValue(profileAtom);

  const { signOut } = useAccount();

  useEffect(() => {
    if (account === false || profile === false) {
      redirect("/sign-in"); // replace with window.something
    }
  }, [account, profile]);

  // if (account && profile)
  return (
    <div className="grid grid-cols-2 gap-8">
      <Card>
        <CardAccount />

        <Separator orientation="horizontal" className="w-full" />

        <CardHeader className="pb-4">
          <CardTitle className="text-2xl">Usage</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 pb-4">
          <Label className="flex flex-col space-y-1">
            <span>Remaining</span>
            <span className="font-normal leading-snug text-muted-foreground">5 recommendations remaining</span>
          </Label>
          <Label className="flex flex-col space-y-1">
            <span>Valid until</span>
            <span className="font-normal leading-snug text-muted-foreground">Fri, 21 Jul 2023</span>
          </Label>
        </CardContent>
        <CardFooter className="grid">
          <Button onClick={() => signOut()} aria-label="Log out">
            <Icons.coins className="mr-2 h-4 w-4" aria-hidden="true" />
            <span>Add more recommendations</span>
          </Button>
        </CardFooter>

        <Separator orientation="horizontal" className="w-full" />

        <CardHeader className="pb-4">
          <CardTitle className="flex justify-between text-2xl">
            <span>Subscription</span>
            <Badge variant="outline">Inactive</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 pb-4">
          <Label className="flex flex-col space-y-1">
            <span>Current plan</span>
            <div className="flex gap-x-4 font-normal leading-snug text-muted-foreground">
              <div className="flex items-center">TypeScript</div>
              <div className="flex items-center">20k</div>
              <div className="flex items-center">Updated April 2023</div>
            </div>
          </Label>
          <Label className="flex flex-col space-y-1">
            <span>Renewal date</span>
            <span className="font-normal leading-snug text-muted-foreground">Fri, 21 Jul 2023</span>
          </Label>
        </CardContent>
        <CardFooter className="grid">
          <Button onClick={() => signOut()} aria-label="Log out">
            <Icons.sprout className="mr-2 h-4 w-4" aria-hidden="true" />
            <span>Manage plan</span>
          </Button>
        </CardFooter>

        <Separator orientation="horizontal" className="w-full" />

        <CardHeader className="pb-4">
          <CardTitle className="flex justify-between text-2xl">
            <span>OpenAI API Key</span>
            <Badge variant="outline">Not detected</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex items-center gap-x-2">
            <Input value="http://example.com/link/to/document" readOnly />
            <Button variant="destructive" className="shrink-0">
              Remove
            </Button>
          </div>
        </CardContent>
        {/* <CardFooter className="grid">
            <Button onClick={() => signOut()} aria-label="Log out">
              <Icons.sprout className="mr-2 h-4 w-4" aria-hidden="true" />
              <span>Manage plan</span>
            </Button>
          </CardFooter> */}

        <Separator orientation="horizontal" className="w-full" />

        <CardHeader className="pb-4">
          <CardTitle className="text-2xl">Support</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 pb-4">
          <div className="flex items-center justify-between">
            <Button variant="link" asChild>
              <Link href="/sign-in" aria-label="Sign in">
                Contact us
              </Link>
            </Button>

            <Separator orientation="vertical" className="h-6" />

            <Button variant="link" asChild>
              <Link href="/sign-in" aria-label="Sign in">
                Use your own OpenAI API key
              </Link>
            </Button>

            <Separator orientation="vertical" className="h-6" />

            <Button variant="link" asChild>
              <Link href="/sign-in" aria-label="Sign in">
                FAQ
              </Link>
            </Button>
          </div>
        </CardContent>
        <CardFooter className="grid">
          <Button variant="outline" aria-label="Log out">
            <Icons.coffee className="mr-2 h-4 w-4" aria-hidden="true" />
            <span>Buy me a coffee</span>
          </Button>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Sign up</CardTitle>
          <CardDescription className="text-muted-foreground">Choose your preferred sign up method</CardDescription>
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
            Already have an account?{" "}
            <Button variant="link" className="h-auto p-0" asChild>
              <Link href="/sign-in" aria-label="Sign in">
                Sign in
              </Link>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );

  return null;
}
