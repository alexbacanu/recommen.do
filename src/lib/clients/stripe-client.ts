import type { Stripe } from "@stripe/stripe-js";

import { loadStripe } from "@stripe/stripe-js";

import { stripePublishableKey } from "~/lib/envClient";

let stripePromise: Promise<Stripe | null>;
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(stripePublishableKey);
  }
  return stripePromise;
};

export { getStripe };
