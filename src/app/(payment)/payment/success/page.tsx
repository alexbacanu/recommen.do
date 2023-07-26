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
    router.prefetch("/profile");

    const timeout = setTimeout(() => {
      router.replace("/profile");
    }, 5000);

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
          <Icons.success className="mr-2 h-6 w-6 text-primary" aria-hidden="true" />
          Payment success!
        </CardTitle>

        <div className="-mt-2 grid gap-1">
          <p>Payment success!</p>
          <p>You will be redirected in a few seconds to your profile page.</p>
        </div>

        <div className="mt-2 grid">
          <Button variant="default" asChild>
            <Link href="/" aria-label="Or return to homepage">
              Or return to homepage
            </Link>
          </Button>
          <Progress value={progress} className="mt-2" />
        </div>
      </div>
      <Image
        src="/payment/undraw_order_confirmed.svg"
        className="h-auto w-[36rem] object-contain"
        alt="Confirmation image for successful payment on recommen.do plans"
        width={576}
        height={576}
      />
    </Shell>
  );
}
