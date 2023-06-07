import "server-only";

import Stripe from "stripe";

import { stripeSecretKey } from "~/lib/envServer";

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2022-11-15",
  typescript: true,
});

export { stripe };
