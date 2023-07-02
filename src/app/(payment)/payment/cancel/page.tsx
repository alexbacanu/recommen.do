"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import { Progress } from "@/components/ui/progress";
import { Shell } from "@/components/ui/shell";

export default function PaymentCancelPage() {
  const router = useRouter();

  useEffect(() => {
    router.prefetch("/");

    const timeout = setTimeout(() => {
      router.replace("/");
    }, 2500);

    return () => clearTimeout(timeout);
  }, [router]);

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setProgress(100), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Shell layout="confirmation">
      <div className="grid gap-8">
        <CardTitle className="flex items-center text-2xl tracking-normal">
          <Icons.cancel className="mr-2 h-6 w-6 text-primary" aria-hidden="true" />
          Payment cancelled!
        </CardTitle>

        <div className="-mt-2 grid gap-1">
          <p>Payment cancelled! You have not been charged.</p>
          <p>You will be redirected in a few seconds to home page.</p>
        </div>

        <div className="mt-2 grid">
          <Button variant="default" asChild>
            <Link href="/" aria-label="Return to homepage">
              Return to homepage
            </Link>
          </Button>
          <Progress value={progress} className="mt-2" />
        </div>
      </div>
      <Image
        src="/payment/undraw_cancel.svg"
        className="h-auto w-[36rem] object-contain"
        alt="undraw verified illustration"
        width={576}
        height={576}
      />
    </Shell>
  );
}
