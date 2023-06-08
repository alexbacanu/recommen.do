import { Features } from "~/components/sections/features";
import { Hero } from "~/components/sections/hero";
import { Pricing } from "~/components/sections/pricing";
import { getStripeInstance } from "~/lib/clients/stripe-server";

async function getPlans() {
  const stripe = getStripeInstance();
  const { data: prices } = await stripe.prices.list();

  const plans = await Promise.all(
    prices.map(async (price) => {
      const product = await stripe.products.retrieve(price.product as string);

      return {
        priceId: price.id,
        name: product.name,
        price: price.unit_amount! / 100,
        interval: price.recurring?.interval,
        currency: price.currency,
        description: product.description,
      };
    }),
  );

  const sortedPlans = plans.sort((a, b) => a.price - b.price);

  return sortedPlans;
}

export default async function HomePage() {
  const plans = await getPlans();

  return (
    <>
      <Hero />
      <Features />
      <Pricing plans={plans} />
    </>
  );
}
