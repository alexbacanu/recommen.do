"use client";

import Link from "next/link";
import { useEffect } from "react";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function AuthSuccessPage() {
  useEffect(() => {
    window.open("/profile", "_self", "noopener,noreferrer");
  }, []);

  return (
    <section id="authsuccess_page">
      <div className="mx-auto flex max-w-7xl flex-col gap-y-4 p-4">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-x-6">
              <CardTitle className="">Authentication success!</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-semibold text-muted-foreground">
              You will be redirected in a few seconds to profile page
            </div>
          </CardContent>
          <CardFooter className="grid grid-cols-1 gap-4">
            <Link href="/profile" className={buttonVariants({ variant: "outline" })}>
              Go to profile now
            </Link>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}
