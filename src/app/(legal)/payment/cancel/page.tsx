"use client";

import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function PaymentCancelPage() {
  const router = useRouter();

  useEffect(() => {
    router.prefetch("/profile");

    const timeout = setTimeout(() => {
      router.replace("/profile");
    }, 2500);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <section id="paymentcancel_page">
      <div className="mx-auto flex max-w-7xl flex-col gap-y-4 p-4">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-x-6">
              <CardTitle className="">Payment cancelled!</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-semibold text-muted-foreground">
              Payment cancelled! You have not been charged. You will be redirected in a few seconds to home page
            </div>
          </CardContent>
          <CardFooter className="grid grid-cols-1 gap-4">
            <Link href="/" className={buttonVariants({ variant: "outline" })}>
              Go to home now
            </Link>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}
