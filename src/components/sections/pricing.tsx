"use client";

import { useAtomValue } from "jotai";

import { accountAtom, profileAtom } from "~/lib/atoms/appwrite";
import { useAppwrite } from "~/lib/helpers/useAppwrite";

interface PricingProps {
  plans: {
    priceId: string;
    name: string;
    price: number;
    interval: string | undefined;
    currency: string;
    description: string | null;
  }[];
}

export function Pricing({ plans }: PricingProps) {
  const { createJWT } = useAppwrite();
  const account = useAtomValue(accountAtom);
  const profile = useAtomValue(profileAtom);

  console.log("account:", account);
  console.log("profile:", profile);

  const showCreateAccountButton = !account;
  const showSubscribeButton = profile && !profile.stripeSubscriptionId;
  const showManageSubscriptionButton = profile && profile.stripeSubscriptionId;

  let jwt: string;

  const handleSubscribe = async (priceId: string) => {
    if (!jwt) {
      const jwtToken = await createJWT();
      jwt = jwtToken.jwt;
    }

    console.log("jwt:", jwt);

    const getCheckoutURL = await fetch(`/api/stripe/subscription/${priceId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    const checkoutUrl = await getCheckoutURL.json();

    console.log("getCheckoutURL:", checkoutUrl);
    window.open(checkoutUrl.url, "_blank", "noopener,noreferrer");
  };

  const handleRefill = async () => {
    if (!jwt) {
      const jwtToken = await createJWT();
      jwt = jwtToken.jwt;
    }

    console.log("jwt:", jwt);

    const getCheckoutURL = await fetch(`/api/stripe/refill`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    const checkoutUrl = await getCheckoutURL.json();

    console.log("getCheckoutURL:", checkoutUrl);
    window.open(checkoutUrl.url, "_blank", "noopener,noreferrer");
  };

  return (
    <section className="placeholder py-24">
      <h2 className="text-2xl">Plans</h2>
      <div className="flex justify-between">
        {plans.map((plan) => (
          <div key={plan.priceId}>
            <h3>{plan.name}</h3>
            <p>
              ${plan.price} / {plan.interval}
            </p>
            {showCreateAccountButton && <div className="bg-red-500 rounded-md">Create Account</div>}
            {showSubscribeButton && (
              <button onClick={() => handleSubscribe(plan.priceId)} className="bg-red-500 rounded-md">
                Subscribe
              </button>
            )}
            {showManageSubscriptionButton && (
              <button onClick={() => handleSubscribe(plan.priceId)} className="bg-red-500 rounded-md">
                Manage subscription
              </button>
            )}
            {showManageSubscriptionButton && (
              <button onClick={() => handleRefill()} className="bg-red-500 rounded-md">
                Add 50 credits
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
