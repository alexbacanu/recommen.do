import type { PricingPlan } from "~/lib/types";

import { Features } from "~/components/sections/features";
import { Hero } from "~/components/sections/hero";
import { Pricing } from "~/components/sections/pricing";
import { getStripeInstance } from "~/lib/clients/stripe-server";

async function getPlans() {
  const stripe = getStripeInstance();
  const { data: prices } = await stripe.prices.list();

  const plans = await Promise.all(
    prices.map(async (price) => {
      if (price.type !== "recurring") return;
      const product = await stripe.products.retrieve(price.product as string);

      return {
        priceId: price.id,
        name: product.name,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        price: price.unit_amount! / 100,
        interval: price.recurring?.interval,
        currency: price.currency,
        description: product.description,
        metadata: product.metadata,
      };
    }),
  );
  const sortedPlans = plans.sort((a, b) => (a?.price || 0) - (b?.price || 0));

  return sortedPlans;
}

export default async function HomePage() {
  const plans = (await getPlans()) as PricingPlan[];

  return (
    <>
      <Hero />
      <Features />
      <Pricing plans={plans} />
    </>
  );
}
