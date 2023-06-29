"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import { Separator } from "@/components/ui/separator";

export function CardSupport() {
  return (
    <>
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl">Support</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 pb-4">
        <div className="flex items-center justify-between">
          <Button variant="link" asChild>
            <Link href="/contact" aria-label="Contact us">
              Contact us
            </Link>
          </Button>

          <Separator orientation="vertical" className="h-6" />

          <Button variant="link" asChild>
            <Link href="/installation" aria-label="Use your own OpenAI API key">
              Use your own OpenAI API key
            </Link>
          </Button>

          <Separator orientation="vertical" className="h-6" />

          <Button variant="link" asChild>
            <Link href="/faq" aria-label="FAQ">
              FAQ
            </Link>
          </Button>
        </div>
      </CardContent>
      <CardFooter className="grid">
        <Button variant="outline" aria-label="Buy me a coffee">
          <Icons.coffee className="mr-2 h-4 w-4" aria-hidden="true" />
          <span>Buy me a coffee</span>
        </Button>
      </CardFooter>
    </>
  );
}
