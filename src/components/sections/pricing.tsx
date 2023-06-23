"use client";

import type { PricingPlan } from "@/lib/types";
import type { Variants } from "framer-motion";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { appwriteUrl, authuiSite } from "@/lib/envClient";
import { AppwriteService } from "@/lib/helpers/appwrite-service";
import { useAccount } from "@/lib/hooks/use-account";
import { useProfile } from "@/lib/hooks/use-profile";

interface PricingProps {
  plans: PricingPlan[];
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

export function Pricing({ plans }: PricingProps) {
  const profile = useProfile();

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.75,
        ease: "easeOut",
        delayChildren: 0.2,
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <section id="pricing" className="overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 py-8 lg:py-16">
        <div className="flex flex-col gap-y-10 lg:gap-y-12 xl:gap-y-14">
          <h2 className="heading-accent text-center">Simple, transparent pricing</h2>

          <Card className="flex items-center justify-between gap-x-2 p-6 md:gap-x-6">
            <div className="flex items-center gap-x-2 md:gap-x-6">
              <Badge variant="default" className="rounded-md bg-indigo-500 px-4 py-2 uppercase">
                <Clock className="mr-2 h-4 w-4" />
                Limited offer
              </Badge>
              <Label className="text-center text-sm md:text-base">10 free recommendations on account creation</Label>
            </div>
            <div className="flex items-center gap-x-2 md:gap-x-6">
              {profile ? (
                <>
                  <Label className="text-base">Already claimed</Label>
                </>
              ) : (
                <>
                  <Link
                    href={authuiSite}
                    className={buttonVariants({ variant: "outline", className: "whitespace-nowrap" })}
                  >
                    Get started
                  </Link>
                  <Label className="text-lg uppercase">Free</Label>
                </>
              )}
            </div>
          </Card>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 gap-x-4 gap-y-6 lg:grid-cols-3 lg:gap-x-8"
          >
            {plans.map((plan, index) => (
              <PricingCard key={plan.priceId} plan={plan} index={index} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function PricingCard({ plan, index }: { plan: PricingPlan; index: number }) {
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
    <motion.div key={plan.priceId} variants={zoom} viewport={{ once: true }}>
      <Card className={index === 1 ? "border-ring" : ""}>
        <CardHeader>
          <CardTitle className="flex items-start justify-between">
            {plan.name}
            <Badge variant="outline">Beta</Badge>
          </CardTitle>
          <CardDescription>{plan.price}$ / month</CardDescription>
        </CardHeader>

        <CardContent className="grid">
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
        </CardFooter>
      </Card>
    </motion.div>
  );
}
