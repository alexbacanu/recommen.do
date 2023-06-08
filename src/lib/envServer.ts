import "server-only";

// Appwrite
export const appwriteApiKey = process.env.APPWRITE_API_KEY ?? "";
export const appwriteWebhookKey = process.env.APPWRITE_WEBHOOK_KEY ?? "";
export const appwriteUrl = process.env.APPWRITE_URL ?? "";

// Stripe
export const stripeSecretKey = process.env.STRIPE_SECRET_KEY ?? "";
export const stripeWebhookKey = process.env.STRIPE_WEBHOOK_KEY ?? "";

export const stripeBasicPlan = process.env.STRIPE_BASIC_PLAN ?? "";
export const stripePremiumPlan = process.env.STRIPE_PREMIUM_PLAN ?? "";
export const stripeUltimatePlan = process.env.STRIPE_ULTIMATE_PLAN ?? "";

// OpenAI
export const openaiKey = process.env.OPENAI_API_KEY ?? "";
export const openaiOrg = process.env.OPENAI_API_ORG ?? "";
