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

        const productName = product.name;
        const productDescription = product.description;
        const productMetadata = product.metadata;
        const priceId = price.id;
        const priceAmount = price.unit_amount ? price.unit_amount / 100 : 0;
        const priceInterval = price.recurring?.interval;
        const priceCurrency = price.currency;

        if (productDescription && priceInterval) {
          return {
            productName,
            productDescription,
            productMetadata,
            priceId,
            priceAmount,
            priceInterval,
            priceCurrency,
          };
        }
      }
    }),
  );

  const sortedPlans = plans.sort((a, b) => (a?.priceAmount ?? 0) - (b?.priceAmount ?? 0));

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
