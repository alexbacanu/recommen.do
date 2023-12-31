"use client";

import Link from "next/link";
import { useState } from "react";

import { FormSignIn } from "@/components/auth/form-sign-in";
import { OAuthSignIn } from "@/components/auth/oauth-sign-in";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface AuthMethodsProps {
  displayTerms?: boolean;
}

export default function AuthMethods({ displayTerms = false }: AuthMethodsProps) {
  const [hasAccepted, setHasAccepted] = useState(false);

  return (
    <>
      {displayTerms ? (
        <div className="-mt-2 flex items-center gap-x-2 lg:-mt-4">
          <Checkbox id="terms" checked={hasAccepted} onCheckedChange={() => setHasAccepted(!hasAccepted)} />
          <div className="grid gap-2 leading-none">
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I agree to{" "}
              <Button variant="link" className="h-auto p-0" asChild>
                <Link href="/terms" aria-label="Terms and Conditions">
                  Terms and Conditions
                </Link>
              </Button>{" "}
              and{" "}
              <Button variant="link" className="h-auto p-0" asChild>
                <Link href="/privacy" aria-label="Privacy Policy">
                  Privacy Policy
                </Link>
              </Button>
              .
            </label>
          </div>
        </div>
      ) : (
        <div className="-mt-2 flex items-center gap-x-2 lg:-mt-4">
          <div className="grid gap-2 leading-none">
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              By continuing, you are setting up an account and agree to our{" "}
              <Button variant="link" className="h-auto p-0" asChild>
                <Link href="/terms" aria-label="Terms and Conditions">
                  Terms and Conditions
                </Link>
              </Button>{" "}
              and{" "}
              <Button variant="link" className="h-auto p-0" asChild>
                <Link href="/privacy" aria-label="Privacy Policy">
                  Privacy Policy
                </Link>
              </Button>
              .
            </label>
          </div>
        </div>
      )}

      <OAuthSignIn hasAccepted={hasAccepted || !displayTerms} />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>

      <FormSignIn hasAccepted={hasAccepted || !displayTerms} />
    </>
  );
}
