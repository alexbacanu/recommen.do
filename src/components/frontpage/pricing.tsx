"use client";

import type { PricingPlan } from "@/lib/types/types";
import type { Variants } from "framer-motion";

import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import Link from "next/link";

import PricingCard from "@/components/frontpage/pricing-card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { authuiSite } from "@/lib/envClient";
import { useProfile } from "@/lib/hooks/use-profile";

interface PricingProps {
  plans: PricingPlan[];
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
