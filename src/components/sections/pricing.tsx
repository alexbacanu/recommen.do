"use client";

import type { PricingPlan } from "~/lib/types";
import type { Variants } from "framer-motion";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useAtomValue } from "jotai";
import Link from "next/link";

import { Badge } from "~/components/ui/badge";
import { Button, buttonVariants } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { accountAtom, profileAtom } from "~/lib/atoms/appwrite";
import { appwriteUrl, authuiSite } from "~/lib/envClient";
import { AppwriteService } from "~/lib/helpers/appwrite-service";

interface PricingProps {
  plans: PricingPlan[];
}

let jwt: string;
async function getCheckoutURL(priceId: string) {
  if (!jwt) {
    const jwtObject = await AppwriteService.createJWT();
    jwt = jwtObject.jwt;
  }

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
  const profile = useAtomValue(profileAtom);

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
              <Label className="text-lg uppercase">Free</Label>
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
                    className={buttonVariants({ variant: "outline", className: "whitespace-nowrap" })}
                    href={authuiSite}
                  >
                    Get started
                  </Link>
                  <Label className="text-base">0$ / month</Label>
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
  const account = useAtomValue(accountAtom);
  const profile = useAtomValue(profileAtom);

  const showGetStarted = !account;
  const showSubscribe = profile && !profile.stripeSubscriptionId;
  const showManageSubscription = profile && profile.stripeSubscriptionId;

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
            <Link href={authuiSite} className={buttonVariants({ variant: index === 1 ? "default" : "outline" })}>
              Get started
            </Link>
          )}

          {showSubscribe && (
            <Button variant={index === 1 ? "default" : "outline"} disabled={isLoading}>
              <Link href={needsVerification ? "/profile" : checkoutURL}>Subscribe now</Link>
            </Button>
          )}

          {showManageSubscription && (
            <Button variant={index === 1 ? "default" : "outline"} disabled={isLoading}>
              <Link href={checkoutURL}>Manage subscription</Link>
            </Button>
          )}
        </CardContent>

        <CardFooter>
          <div className="flex flex-col gap-y-4">
            {plan.metadata.features &&
              plan.metadata.features.split(",").map((feature, index) => (
                <div key={index} className="flex items-center gap-x-2 text-muted-foreground first:text-card-foreground">
                  <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                  <p className="text-sm font-medium leading-none">{feature}</p>
                </div>
              ))}
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
