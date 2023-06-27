import { type Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import { Shell } from "@/components/ui/shell";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your account",
};

export default function VerifyEmailPage({ searchParams }: { searchParams: { email: string } }) {
  return (
    <Shell layout="confirmation">
      <div className="grid gap-8">
        <div>
          <CardTitle className="flex items-center text-2xl tracking-normal">
            <Icons.verify className="mr-2 h-6 w-6 text-primary" aria-hidden="true" />
            Verify your email
          </CardTitle>
        </div>
        <div className="-mt-2 grid gap-4">
          <div>
            <p>
              An email with a verification link has been sent to:{" "}
              <span className="font-semibold tracking-wide text-primary">{searchParams.email}</span>
            </p>
            <p>Please follow the instructions in the email to verify your account.</p>
          </div>
        </div>
        <div className="mt-2 grid gap-4">
          <Button variant="default" asChild>
            <Link href="/" aria-label="Return to homepage">
              Return to homepage
            </Link>
          </Button>
        </div>
      </div>
      <div>
        <Image
          src="/auth/undraw_verified.svg"
          className="h-auto w-[36rem] object-contain"
          alt="undraw verified illustration"
          width={576}
          height={576}
        />
      </div>
    </Shell>
  );
}
