import type { Models } from "appwrite";

// OpenAI
export interface Product {
  identifier: string;
  image: string;
  link: string;
  name: string;
  price: string;
  reviews: string;
  stars: string;
}

// Appwrite
export type Account = Models.User<Models.Preferences>;

export interface Profile extends Models.Document {
  userId: string;
  name: string;
  email: string;
  credits: number;
  usage: number | null;

  stripeCustomerId: string | null;

  stripeSubscriptionId: string | "none";
  stripeSubscriptionName: string | null;
  stripePriceId: string | null;
  stripeCurrentPeriodEnd: Date | null;

  stripeStatus: string | null;
  stripeStatusLastUpdated: Date | null;
}

// Stripe
export interface PricingPlan {
  priceId: string;
  name: string;
  price: number;
  interval: string | null;
  currency: string;
  description: string;
  metadata: {
    features: string;
    name: string;
  };
}
