"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { appwriteUrl } from "@/lib/envClient";

export function CardLegal() {
  const extensionDetected = !window?.next;
  const target = extensionDetected ? "_blank" : "_self";

  if (extensionDetected)
    return (
      <>
        <Separator orientation="horizontal" className="w-full" />

        <CardContent className="grid p-4">
          <Button variant="link" className="p-1" asChild>
            <Link href={`${appwriteUrl}/terms`} target={target} aria-label="Terms and conditions">
              Terms and conditions
            </Link>
          </Button>

          <Button variant="link" className="p-1" asChild>
            <Link href={`${appwriteUrl}/privacy`} target={target} aria-label="Privacy policy">
              Privacy policy
            </Link>
          </Button>

          <Button variant="link" className="p-1" asChild>
            <Link href={`${appwriteUrl}/cookies`} target={target} aria-label="Cookies policy">
              Cookies policy
            </Link>
          </Button>
        </CardContent>
      </>
    );

  return null;
}
