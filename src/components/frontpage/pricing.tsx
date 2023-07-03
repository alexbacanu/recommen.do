"use client";

import type { StripePlan } from "@/lib/types/types";
import type { Variants } from "framer-motion";

import { motion } from "framer-motion";
import { useAtomValue } from "jotai";
import Link from "next/link";

import PricingCard from "@/components/frontpage/pricing-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import { Label } from "@/components/ui/label";
import { profileAtom } from "@/lib/atoms/auth";

interface PricingProps {
  plans: StripePlan[];
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
          <h2 className="heading-accent text-center tracking-tight">Subscription plans</h2>

          <Card className="flex flex-col items-center justify-between gap-4 p-6 sm:flex-row md:gap-6">
            <div className="flex items-center gap-x-2 md:gap-x-6">
              <Badge variant="outline" className="hidden rounded-md px-4 py-2 uppercase md:flex">
                <Icons.clock className="mr-2 h-4 w-4" aria-hidden="true" />
                Limited offer
              </Badge>

              <Label className="text-center text-base font-normal">10 free recommendations on account creation</Label>
            </div>

            <div className="grid items-center gap-x-2 md:gap-x-6">
              {profile ? (
                <Button variant="secondary" className="whitespace-nowrap text-sm" disabled>
                  Already claimed
                </Button>
              ) : (
                <Button variant="secondary" className="whitespace-nowrap text-sm" asChild>
                  <Link href="/sign-up" aria-label="Get started">
                    Get started
                  </Link>
                </Button>
              )}
            </div>
          </Card>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 gap-x-4 gap-y-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-x-8"
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
