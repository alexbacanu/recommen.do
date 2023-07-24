import type { Models } from "appwrite";
import type Stripe from "stripe";

// Appwrite
export type AppwriteAccount = Models.User<Models.Preferences>;
export type AppwriteProfile = Models.Document & {
  userId: string;
  name: string;
  email: string;
  credits: number;
  usage: number | null;

  stripeCustomerId: string | null;

  stripeSubscriptionId: string;
  stripeSubscriptionName: string | null;
  stripePriceId?: string;
  stripeCurrentPeriodEnd: Date | null;

  stripeStatus: string | null;
  stripeStatusLastUpdated: Date | null;

  markedForDeletion: Date;
  termsAgreed: Date;
  history: string[];
  saveHistory: boolean;
};

// Stripe
export type CustomStripePlan = Stripe.Plan & {
  metadata: {
    recommendations: string;
    name: string;
  };
};

// OpenAI
export interface ScrapedProduct {
  identifier: string;
  image: string;
  link: string;
  name: string;
  price: string;
  reviews: string;
  stars: string;
  source: string;
}
export interface ChatGPTMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

// NextJS
export interface APIResponse {
  message: string;
  url?: string;
  plan?: CustomStripePlan;
}

export interface BrowserDetails {
  name: string;
  short: string;
  href: string;
  ariaLabel: string;
  description: string;
}
