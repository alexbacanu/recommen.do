"use client";

import { useEffect } from "react";

import { buttonVariants } from "~/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";

export default function PaymentCancelPage() {
  useEffect(() => {
    window.open("/profile", "_self", "noopener,noreferrer");
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
            <a href="/" className={buttonVariants({ variant: "outline" })}>
              Go to home now
            </a>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}