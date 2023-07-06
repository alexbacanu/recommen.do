"use client";

import type { StripePlan } from "@/lib/types/types";
import type { Variants } from "framer-motion";

import { useMutation } from "@tanstack/react-query";
import { AppwriteException } from "appwrite";
import { motion } from "framer-motion";
import { useAtomValue } from "jotai";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import { useToast } from "@/components/ui/use-toast";
import { accountAtom, profileAtom } from "@/lib/atoms/auth";
import { AppwriteService } from "@/lib/clients/client-appwrite";
import { appwriteUrl } from "@/lib/envClient";
import { cn } from "@/lib/helpers/utils";

interface PricingCardProps {
  plan: StripePlan;
  index: number;
}

type GetSubscribeURLarams = {
  priceId: string;
};

export default function PricingCard({ plan, index }: PricingCardProps) {
  const { toast } = useToast();
  const router = useRouter();

  const account = useAtomValue(accountAtom);
  const profile = useAtomValue(profileAtom);

  const showGetStarted = !account || (account && !profile);
  const showSubscribe = profile && profile.stripeSubscriptionId === "none";
  const showManageSubscription = profile && profile.stripeSubscriptionId !== "none";

  // 0. Define your mutation.
  const { mutate, isLoading } = useMutation({
    mutationKey: ["getSubscribeURL"],
    mutationFn: async ({ priceId }: GetSubscribeURLarams) => {
      const jwt = await AppwriteService.createJWT();

      const response = await fetch(`${appwriteUrl}/api/stripe/subscription/${priceId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      const checkoutUrl: { url: string } = await response.json();
      return checkoutUrl.url;
    },
    onSuccess: (data) => {
      router.push(data);
    },
    onError: async (error) => {
      if (error instanceof AppwriteException) {
        toast({
          description: error.message,
        });
        // toast.error(error.message);
      }

      if (error instanceof Error) {
        toast({
          description: error.message,
        });
        // toast.error(error.message);
      }

      console.error(error);
    },
  });

  const zoom: Variants = {
    hidden: { scale: 0.95 },
    visible: {
      scale: 1,
      transition: {
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      key={plan.priceId}
      className={index === 1 ? "order-none col-span-1 md:order-first md:col-span-2 lg:order-none lg:col-span-1" : ""}
      variants={zoom}
      viewport={{ once: true }}
    >
      <Card className={cn("grid gap-4 p-4 lg:p-0 relative", index === 1 ? "border-ring" : "")}>
        {index === 0 && (
          <Icons.plan1
            className="pointer-events-none absolute h-5/6 w-5/6 translate-x-[32px] text-muted-foreground/[0.03]"
            strokeWidth={0.25}
            aria-hidden="true"
          />
        )}
        {index === 1 && (
          <Icons.plan2
            className="pointer-events-none absolute h-5/6 w-5/6 translate-x-[32px] text-muted-foreground/[0.03]"
            strokeWidth={0.25}
            aria-hidden="true"
          />
        )}
        {index === 2 && (
          <Icons.plan3
            className="pointer-events-none absolute h-5/6 w-5/6 translate-x-[32px] text-muted-foreground/[0.03]"
            strokeWidth={0.25}
            aria-hidden="true"
          />
        )}

        <CardHeader>
          <CardTitle className="text-3xl font-light">
            <div className="flex items-center justify-center">
              {index === 0 && <Icons.plan1 className="mr-4 h-8 w-8" strokeWidth={1} aria-hidden="true" />}
              {index === 1 && <Icons.plan2 className="mr-4 h-8 w-8" strokeWidth={1} aria-hidden="true" />}
              {index === 2 && <Icons.plan3 className="mr-4 h-8 w-8" strokeWidth={1} aria-hidden="true" />}
              {plan.name}
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="grid gap-8">
          <div className="grid">
            <p className="text-center text-4xl font-light leading-none tracking-tighter text-foreground/80">
              {plan.metadata.recommendations}
            </p>
            <div className="text-center text-base leading-tight text-muted-foreground">recommendations</div>
          </div>

          <div className="flex items-center justify-center gap-x-1">
            <span className="text-4xl font-light leading-none tracking-tighter text-foreground/80">
              <sup className="top-[-14px] text-base">$</sup>
              {plan.price}
            </span>
            <div className="grid grid-rows-2">
              <div className="row-start-2 text-left text-base leading-tight text-muted-foreground">/month</div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="grid">
          {showGetStarted && (
            <Button variant={index === 1 ? "default" : "secondary"} asChild>
              <Link href="/sign-up">Get started</Link>
            </Button>
          )}

          {showSubscribe && (
            <Button
              variant={index === 1 ? "default" : "secondary"}
              onClick={() => mutate({ priceId: plan.priceId })}
              disabled={isLoading}
              aria-label="Subscribe now"
            >
              {isLoading ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <Icons.sprout className="mr-2 h-4 w-4" aria-hidden="true" />
              )}
              Subscribe now
            </Button>
          )}

          {showManageSubscription && (
            <Button
              variant={index === 1 ? "default" : "secondary"}
              onClick={() => mutate({ priceId: plan.priceId })}
              disabled={isLoading}
              aria-label="Manage subscription"
            >
              {isLoading ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <Icons.manage className="mr-2 h-4 w-4" aria-hidden="true" />
              )}
              Manage subscription
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}
