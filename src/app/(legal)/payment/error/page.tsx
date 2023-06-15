"use client";

import { useEffect } from "react";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";

export default function PaymentErrorPage() {
  useEffect(() => {
    window.location.href = "/profile";
  }, []);

  return (
    <section id="paymenterror_page">
      <div className="mx-auto flex max-w-7xl flex-col gap-y-4 p-4">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-x-6">
              <CardTitle className="">Payment error!</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-semibold text-muted-foreground">
              There has been an error with your payment. You have not been charged. You will be redirected in a few
              seconds to home page
            </div>
          </CardContent>
          <CardFooter className="grid grid-cols-1 gap-4">
            <Button variant="outline" asChild>
              <a href="/">Go to home now</a>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}
