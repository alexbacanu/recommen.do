/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { StripePlan } from "@/lib/types/types";

import { Features } from "@/components/frontpage/features";
import { Hero } from "@/components/frontpage/hero";
import { Pricing } from "@/components/frontpage/pricing";
import { getStripeInstance } from "@/lib/clients/server-stripe";

async function fetchStripePlans() {
  const stripe = getStripeInstance();
  const { data: prices } = await stripe.prices.list();

  const plans = await Promise.all(
    prices.map(async (price) => {
      if (price.type === "recurring") {
        const product = await stripe.products.retrieve(price.product as string);

        return {
          priceId: price.id,
          name: product.name,
          price: price.unit_amount! / 100,
          interval: price.recurring?.interval,
          currency: price.currency,
          description: product.description,
          metadata: product.metadata,
        };
      }
    }),
  );

  const sortedPlans = plans.sort((a, b) => (a?.price || 0) - (b?.price || 0)) as StripePlan[];

  return sortedPlans;
}

export default async function HomePage() {
  const plans = await fetchStripePlans();

  return (
    <>
      <Hero />
      <Features />
      <Pricing plans={plans} />
    </>
  );
}
