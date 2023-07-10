import { type Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import { Shell } from "@/components/ui/shell";

export const metadata: Metadata = {
  title: "Verify",
  description: "Verify your account",
};

export default function VerifyEmailPage({ searchParams }: { searchParams: { email: string } }) {
  return (
    <Shell layout="confirmation">
      <div className="grid gap-8">
        <CardTitle className="flex items-center text-2xl tracking-normal">
          <Icons.verify className="mr-2 h-6 w-6 text-primary" aria-hidden="true" />
          Check your email
        </CardTitle>

        <div className="-mt-2 grid gap-1">
          <p>
            An email with a link has been sent to:{" "}
            <span className="font-semibold tracking-wide text-primary">{searchParams.email}</span>
          </p>
          <p>Please follow the instructions in the email in order to access your account.</p>
        </div>

        <div className="mt-2 grid">
          <Button variant="default" asChild>
            <Link href="/" aria-label="Return to homepage">
              Return to homepage
            </Link>
          </Button>
        </div>
      </div>
      <Image
        src="/auth/undraw_verified.svg"
        className="h-auto w-[36rem] object-contain"
        alt="undraw verified illustration"
        width={576}
        height={576}
      />
    </Shell>
  );
}
