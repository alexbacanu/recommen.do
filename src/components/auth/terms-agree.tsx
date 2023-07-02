"use client";

import { useAtom } from "jotai";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { termsAtom } from "@/lib/atoms/legal";

export function TermsAgree() {
  const [hasAccepted, setHasAccepted] = useAtom(termsAtom);

  return (
    <div className="-mt-4 flex items-center gap-x-2">
      <Checkbox id="terms" checked={hasAccepted} onCheckedChange={() => setHasAccepted(!hasAccepted)} />
      <div className="grid gap-1.5 leading-none">
        <label
          htmlFor="terms"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          I agree to the{" "}
          <Button variant="link" className="h-auto p-0" asChild>
            <Link href="/terms" aria-label="Terms of Service">
              Terms of Service
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
  );
}
