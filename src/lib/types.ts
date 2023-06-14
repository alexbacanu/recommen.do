import type { Models } from "appwrite";

// OpenAI
export type ChatGPTAgent = "user" | "system" | "assistant";

export interface ChatGPTMessage {
  role: ChatGPTAgent;
  content: string;
}

export interface OpenAIStreamPayload {
  model: string;
  messages: ChatGPTMessage[];
  temperature: number;
  max_tokens: number;
  top_p: number;
  frequency_penalty: number;
  presence_penalty: number;
  stream: boolean;
  n: number;
  stop?: string[];
  user?: string;
}

export interface OpenAISettings {
  apiKey: undefined | string;
  orgName: undefined | string;
}

export interface OpenAIRequest {
  products: Product[];
  prompt: string;
}

// Products
export interface Product {
  identifier: string;
  image?: string;
  link?: string;
  name?: string;
  price?: string;
  reviews?: string;
  stars?: string;
}

export interface Products {
  products: Product[];
}

// API
export interface APIRequest {
  json: {
    jwt: string;
    openaiSettings: OpenAISettings;
    openaiRequest: OpenAIRequest;
  };
}

// Appwrite
export interface Profile extends Models.Document {
  userId: string;
  name: string;
  email: string;
  credits: number;
  usage: number;
  stripeCurrentPeriodEnd: Date;
  stripeCustomerId: string;
  stripePriceId: string;
  stripeStatus: string;
  stripeStatusLastUpdated: Date;
  stripeSubscriptionId: string;
  stripeSubscriptionName: string;
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
