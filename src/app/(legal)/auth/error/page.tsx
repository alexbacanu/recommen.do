"use client";

import { useEffect } from "react";

import { buttonVariants } from "~/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";

export default function AuthErrorPage() {
  useEffect(() => {
    window.open("/profile", "_self", "noopener,noreferrer");
  }, []);

  return (
    <section id="autherror_page">
      <div className="mx-auto flex max-w-7xl flex-col gap-y-4 p-4">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-x-6">
              <CardTitle className="">Authentication error!</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-semibold text-muted-foreground">
              There was a problem on our end. Try clearing your cookies, disable adblock or try again later. You will be
              redirected in a few seconds to home page.
            </div>
          </CardContent>
          <CardFooter className="grid grid-cols-1 gap-4">
            <a href="/profile" className={buttonVariants({ variant: "outline" })}>
              Go to home now
            </a>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}
