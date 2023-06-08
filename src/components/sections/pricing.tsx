"use client";

import { useAtomValue } from "jotai";

import { accountAtom, profileAtom } from "~/lib/atoms/appwrite";

interface PricingProps {
  plans: {
    id: string;
    name: string;
    price: number;
    interval: string | undefined;
    currency: string;
    description: string | null;
  }[];
}

export function Pricing({ plans }: PricingProps) {
  const account = useAtomValue(accountAtom);
  const profile = useAtomValue(profileAtom);
  console.log("account:", account);
  console.log("profile:", profile);

  const showCreateAccountButton = !account;
  const showSubscribeButton = profile && !profile.stripeSubscriptionId;
  const showManageSubscriptionButton = profile && profile.stripeSubscriptionId;

  return (
    <section className="placeholder py-24">
      <h2 className="text-2xl">Plans</h2>
      <div className="flex justify-between">
        {plans.map((plan) => (
          <div key={plan.id}>
            <h3>{plan.name}</h3>
            <p>
              ${plan.price} / {plan.interval}
            </p>
            {showCreateAccountButton && <div className="bg-red-500 rounded-md">Create Account</div>}
            {showSubscribeButton && <div className="bg-red-500 rounded-md">Subscribe</div>}
            {showManageSubscriptionButton && <div className="bg-red-500 rounded-md">Manage Subscription</div>}
          </div>
        ))}
      </div>
    </section>
  );
}
