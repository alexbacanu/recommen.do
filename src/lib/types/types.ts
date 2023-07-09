import type { Models } from "appwrite";

// Appwrite
export type AppwriteAccount = Models.User<Models.Preferences>;
export type AppwriteProfile = Models.Document & {
  userId: string;
  name: string;
  email: string;
  credits: number;
  usage: number | null;

  stripeCustomerId: string | null;

  stripeSubscriptionId: string | "none";
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
export type StripePlan = {
  priceId: string;
  name: string;
  price: number;
  interval: string | null;
  currency: string;
  description: string;
  metadata: {
    recommendations: string;
    name: string;
  };
};

// OpenAI
export type ScrapedProduct = {
  identifier: string;
  image: string;
  link: string;
  name: string;
  price: string;
  reviews: string;
  stars: string;
  source: string;
};
export type ChatGPTMessage = {
  role: "user" | "system" | "assistant";
  content: string;
};

// NextJS
export type APIResponse = {
  message: string;
  url?: string;
};
