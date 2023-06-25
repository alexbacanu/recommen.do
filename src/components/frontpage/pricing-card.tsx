"use client";

import type { PricingPlan } from "@/lib/types/types";
import type { Variants } from "framer-motion";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Banana, Cherry, Citrus } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AppwriteService } from "@/lib/clients/appwrite-service";
import { appwriteUrl } from "@/lib/envClient";
import { useAccount } from "@/lib/hooks/use-account";
import { useProfile } from "@/lib/hooks/use-profile";

interface PricingCardProps {
  plan: PricingPlan;
  index: number;
}

async function getCheckoutURL(priceId: string) {
  const jwt = await AppwriteService.createJWT();

  const response = await fetch(`${appwriteUrl}/api/stripe/subscription/${priceId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });

  const checkoutURL: { url: string } = await response.json();
  return checkoutURL;
}

export default function PricingCard({ plan, index }: PricingCardProps) {
  const { account } = useAccount();
  const profile = useProfile();

  const showGetStarted = !account || (account && !profile);
  const showSubscribe = profile && profile.stripeSubscriptionId === "none";
  const showManageSubscription = profile && profile.stripeSubscriptionId !== "none";

  const needsVerification = account && !account.emailVerification;

  const { data, isLoading } = useQuery({
    queryKey: ["getCheckoutURL", plan.priceId],
    queryFn: () => getCheckoutURL(plan.priceId),
    enabled: !!profile,
  });

  const checkoutURL = data ? data.url : "#";

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
      <Card className={index === 1 ? "border-ring" : ""}>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            <div className="flex items-center justify-center gap-x-2">
              {index === 0 && <Cherry className="text-primary" />}
              {index === 1 && <Banana className="text-primary" />}
              {index === 2 && <Citrus className="text-primary" />}
              {plan.name}
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="grid grid-cols-2 gap-x-2">
          <div className="flex items-end justify-center gap-x-1">
            <span className="text-4xl font-medium leading-none text-foreground/80">
              {plan.metadata.recommendations}
            </span>
            <div className="grid grid-rows-2">
              <div className="text-sm">credits</div>
              <div className="text-sm text-muted-foreground">/Month</div>
            </div>
          </div>

          <div className="flex items-end justify-center gap-x-1">
            <span className="text-4xl font-medium leading-none text-foreground/80">
              {/* <span className="mr-0.5 text-base">$</span> */}${plan.price}
              <sup className="top-[-1rem] mr-0.5 text-base">99</sup>
            </span>
            <div className="grid grid-rows-2">
              <div className="row-start-2 text-sm text-muted-foreground">/Month</div>
            </div>
          </div>

          {/* <div className="flex items-end justify-end gap-x-2">
            <span className="flex items-end font-medium leading-none opacity-90">
              <span className="mr-0.5 text-xl leading-none">$</span>
              <span className="text-4xl leading-none">{plan.price}</span>
            </span>
            <div className="grid grid-rows-2">
              <div className="row-start-2 text-sm text-muted-foreground">/Month</div>
            </div>
          </div> */}
        </CardContent>

        <CardFooter className="grid">
          {showGetStarted && (
            <Button variant={index === 1 ? "default" : "secondary"} asChild>
              <Link href="/profile">Get started</Link>
            </Button>
          )}

          {showSubscribe && (
            <Button variant={index === 1 ? "default" : "secondary"} disabled={isLoading} asChild>
              <Link href={needsVerification ? "/profile" : checkoutURL}>Subscribe now</Link>
            </Button>
          )}

          {showManageSubscription && (
            <Button variant={index === 1 ? "default" : "secondary"} disabled={isLoading} asChild>
              <Link href={checkoutURL}>Manage subscription</Link>
            </Button>
          )}
        </CardFooter>

        {/* <CardContent className="grid">
          {showGetStarted && (
            <Button variant={index === 1 ? "default" : "outline"} asChild>
              <Link href="/profile">Get started</Link>
            </Button>
          )}

          {showSubscribe && (
            <Button variant={index === 1 ? "default" : "outline"} disabled={isLoading} asChild>
              <Link href={needsVerification ? "/profile" : checkoutURL}>Subscribe now</Link>
            </Button>
          )}

          {showManageSubscription && (
            <Button variant={index === 1 ? "default" : "outline"} disabled={isLoading} asChild>
              <Link href={checkoutURL}>Manage subscription</Link>
            </Button>
          )}
        </CardContent>

        <CardFooter>
          <div className="flex flex-col gap-y-4">
            {plan.metadata.features &&
              plan.metadata.features.split(",").map((feature, index) => (
                <div key={index} className="flex items-center gap-x-2 text-muted-foreground first:text-card-foreground">
                  <span className="flex h-2 w-2 rounded-full bg-primary/80" />
                  <p className="text-sm font-medium leading-none">{feature}</p>
                </div>
              ))}
          </div>
        </CardFooter> */}
      </Card>
    </motion.div>
  );
}
