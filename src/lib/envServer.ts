import "server-only";

// Appwrite
export const appwriteApiKey = process.env.APPWRITE_API_KEY ?? "";
export const appwriteWebhookKey = process.env.APPWRITE_WEBHOOK_KEY ?? "";

// Stripe
export const stripeSecretKey = process.env.STRIPE_SECRET_KEY ?? "";
export const stripeWebhookKey = process.env.STRIPE_WEBHOOK_KEY ?? "";

// OpenAI
export const openaiKey = process.env.OPENAI_API_KEY ?? "";
export const openaiOrg = process.env.OPENAI_API_ORG ?? "";

// Resend
export const resendKey = process.env.RESEND_API_KEY ?? "";
