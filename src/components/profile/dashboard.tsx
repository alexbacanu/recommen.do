"use client";

import { useAtomValue } from "jotai";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect } from "react";

import { FormSignIn } from "@/components/auth/form-sign-in";
import { OAuthSignIn } from "@/components/auth/oauth-sign-in";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
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

  if (account && profile)
    return (
      <div className="grid grid-cols-2 gap-8">
        <Card className="grid gap-4">
          <CardHeader>
            <CardTitle className="text-2xl">Account</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src="/avatars/01.png" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium leading-none">{account.name || "User"}</p>
                  <p className="text-sm text-muted-foreground">{account.email}</p>
                </div>
              </div>
              <Button variant="outline" aria-label="Change email">
                <Icons.edit className="mr-2 h-4 w-4" aria-hidden="true" />
                <span>Change email</span>
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <Button variant="link" asChild>
                <Link href="/sign-in" aria-label="Sign in">
                  Cookie settings
                </Link>
              </Button>

              <Separator orientation="vertical" className="h-6" />

              <Button variant="link" asChild>
                <Link href="/sign-in" aria-label="Sign in">
                  Manage sessions
                </Link>
              </Button>

              <Separator orientation="vertical" className="h-6" />

              <Button variant="link" asChild>
                <Link href="/sign-in" aria-label="Sign in">
                  Delete account
                </Link>
              </Button>
            </div>
          </CardContent>
          <CardFooter className="grid">
            <Button onClick={() => signOut()} aria-label="Log out">
              <Icons.logout className="mr-2 h-4 w-4" aria-hidden="true" />
              <span>Log out</span>
            </Button>
          </CardFooter>

          <Separator orientation="horizontal" className="w-full" />

          <CardHeader>
            <CardTitle className="text-2xl">Usage</CardTitle>
          </CardHeader>
          {/* <CardContent className="grid gap-4">
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src="/avatars/01.png" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium leading-none">{account.name || "User"}</p>
                  <p className="text-sm text-muted-foreground">{account.email}</p>
                </div>
              </div>
              <Button variant="outline" aria-label="Change email">
                <Icons.edit className="mr-2 h-4 w-4" aria-hidden="true" />
                <span>Change email</span>
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <Button variant="link" asChild>
                <Link href="/sign-in" aria-label="Sign in">
                  Cookie settings
                </Link>
              </Button>

              <Separator orientation="vertical" className="h-6" />

              <Button variant="link" asChild>
                <Link href="/sign-in" aria-label="Sign in">
                  Manage sessions
                </Link>
              </Button>

              <Separator orientation="vertical" className="h-6" />

              <Button variant="link" asChild>
                <Link href="/sign-in" aria-label="Sign in">
                  Delete account
                </Link>
              </Button>
            </div>
          </CardContent> */}
          <CardFooter className="grid">
            <Button aria-label="Add 50 more credits">
              <Icons.logout className="mr-2 h-4 w-4" aria-hidden="true" />
              <span>Add 50 more credits</span>
            </Button>
          </CardFooter>

          <Separator orientation="horizontal" className="w-full" />

          <CardHeader>
            <CardTitle className="text-2xl">Subscription</CardTitle>
          </CardHeader>
          {/* <CardContent className="grid gap-4">
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src="/avatars/01.png" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium leading-none">{account.name || "User"}</p>
                  <p className="text-sm text-muted-foreground">{account.email}</p>
                </div>
              </div>
              <Button variant="outline" aria-label="Change email">
                <Icons.edit className="mr-2 h-4 w-4" aria-hidden="true" />
                <span>Change email</span>
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <Button variant="link" asChild>
                <Link href="/sign-in" aria-label="Sign in">
                  Cookie settings
                </Link>
              </Button>

              <Separator orientation="vertical" className="h-6" />

              <Button variant="link" asChild>
                <Link href="/sign-in" aria-label="Sign in">
                  Manage sessions
                </Link>
              </Button>

              <Separator orientation="vertical" className="h-6" />

              <Button variant="link" asChild>
                <Link href="/sign-in" aria-label="Sign in">
                  Delete account
                </Link>
              </Button>
            </div>
          </CardContent> */}
          <CardFooter className="grid">
            <Button aria-label="Add 50 more credits">
              <Icons.logout className="mr-2 h-4 w-4" aria-hidden="true" />
              <span>Manage plan</span>
            </Button>
          </CardFooter>

          <Separator orientation="horizontal" className="w-full" />

          <CardHeader>
            <CardTitle className="text-2xl">Support</CardTitle>
          </CardHeader>
          {/* <CardContent className="grid gap-4">
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src="/avatars/01.png" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium leading-none">{account.name || "User"}</p>
                  <p className="text-sm text-muted-foreground">{account.email}</p>
                </div>
              </div>
              <Button variant="outline" aria-label="Change email">
                <Icons.edit className="mr-2 h-4 w-4" aria-hidden="true" />
                <span>Change email</span>
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <Button variant="link" asChild>
                <Link href="/sign-in" aria-label="Sign in">
                  Cookie settings
                </Link>
              </Button>

              <Separator orientation="vertical" className="h-6" />

              <Button variant="link" asChild>
                <Link href="/sign-in" aria-label="Sign in">
                  Manage sessions
                </Link>
              </Button>

              <Separator orientation="vertical" className="h-6" />

              <Button variant="link" asChild>
                <Link href="/sign-in" aria-label="Sign in">
                  Delete account
                </Link>
              </Button>
            </div>
          </CardContent> */}
          <CardFooter className="grid">
            <Button variant="secondary" aria-label="Buy me a coffee">
              <Icons.logout className="mr-2 h-4 w-4" aria-hidden="true" />
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
