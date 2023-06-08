import "server-only";

import Stripe from "stripe";

import { stripeSecretKey } from "~/lib/envServer";

let stripeInstance: Stripe | null = null;
const getStripeInstance = (): Stripe => {
  if (!stripeInstance) {
    stripeInstance = new Stripe(stripeSecretKey, {
      apiVersion: "2022-11-15",
      typescript: true,
    });
  }
  return stripeInstance;
};

export { getStripeInstance };
