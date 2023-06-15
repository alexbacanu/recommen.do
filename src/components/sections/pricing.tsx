"use client";

import type { PricingPlan } from "~/lib/types";
import type { Variants } from "framer-motion";

import { motion } from "framer-motion";
import { useAtomValue } from "jotai";
import Link from "next/link";
import { useState } from "react";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { accountAtom, profileAtom } from "~/lib/atoms/appwrite";
import { useAppwrite } from "~/lib/helpers/useAppwrite";

interface PricingProps {
  plans: PricingPlan[];
}

export function Pricing({ plans }: PricingProps) {
  const [loading, setLoading] = useState(false);

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

  const zoom: Variants = {
    hidden: { scale: 0.95 },
    visible: {
      scale: 1,
      transition: {
        ease: "easeOut",
      },
    },
  };

  const { createJWT } = useAppwrite();
  const account = useAtomValue(accountAtom);
  const profile = useAtomValue(profileAtom);

  const showSubscribe = profile && !profile.stripeSubscriptionId;
  const showManage = profile && profile.stripeSubscriptionId;

  let jwt: string;

  const handleSubscribe = async (priceId: string) => {
    setLoading(true);

    if (!jwt) {
      const jwtToken = await createJWT();
      jwt = jwtToken.jwt;
    }

    const getCheckoutURL = await fetch(`/api/stripe/subscription/${priceId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    const checkoutUrl = await getCheckoutURL.json();

    window.open(checkoutUrl.url, "_blank", "noopener,noreferrer");
    setLoading(false);
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
              <Button asChild variant="outline" className="whitespace-nowrap">
                <Link href="https://recommendo.authui.site/">Get started</Link>
              </Button>
              <Label className="text-base">0$ / month</Label>
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
              <motion.div key={plan.priceId} variants={zoom} viewport={{ once: true }}>
                <Card className={index === 1 ? "border-ring" : ""}>
                  <CardHeader>
                    <CardTitle className="flex items-start justify-between">
                      {plan.name}
                      <Badge variant="outline">Free in beta</Badge>
                    </CardTitle>
                    <CardDescription>{plan.price}$ / month</CardDescription>
                  </CardHeader>
                  <CardContent className="grid">
                    {!account ? (
                      <Button asChild variant={index === 1 ? "default" : "outline"} disabled={loading}>
                        <Link href="https://recommendo.authui.site/">Get started</Link>
                      </Button>
                    ) : (
                      <Button
                        variant={index === 1 ? "default" : "outline"}
                        onClick={() => handleSubscribe(plan.priceId)}
                        disabled={loading}
                      >
                        {showSubscribe && "Subscribe"}
                        {showManage && "Manage subscription"}
                      </Button>
                    )}
                  </CardContent>
                  <CardFooter>
                    <div className="flex flex-col gap-y-4">
                      {plan.metadata.features &&
                        plan.metadata.features.split(",").map((feature, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-x-2 text-muted-foreground first:text-card-foreground"
                          >
                            <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                            <p className="text-sm font-medium leading-none">{feature}</p>
                          </div>
                        ))}
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
