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
export interface Profile extends Models.Document {
  userId: string;
  name: string;
  email: string;
  credits: number;
  usage: number | null;
  stripeCurrentPeriodEnd: Date | null;
  stripeCustomerId: string | null;
  stripePriceId: string | null;
  stripeStatus: string | null;
  stripeStatusLastUpdated: Date | null;
  stripeSubscriptionId: string | null;
  stripeSubscriptionName: string | null;
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
