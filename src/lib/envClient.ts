// Appwrite
export const appwriteEndpoint =
  process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ?? process.env.PLASMO_PUBLIC_APPWRITE_ENDPOINT ?? "";
export const appwriteProject =
  process.env.NEXT_PUBLIC_APPWRITE_PROJECT ?? process.env.PLASMO_PUBLIC_APPWRITE_PROJECT ?? "";
export const appwriteUrl = process.env.NEXT_PUBLIC_APPWRITE_URL ?? process.env.PLASMO_PUBLIC_APPWRITE_URL ?? "";

// Stripe
export const stripePublishableKey =
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? process.env.PLASMO_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "";

export const stripeBasicPlan =
  process.env.NEXT_PUBLIC_STRIPE_BASIC_PLAN ?? process.env.PLASMO_PUBLIC_STRIPE_BASIC_PLAN ?? "";
export const stripePremiumPlan =
  process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PLAN ?? process.env.PLASMO_PUBLIC_STRIPE_PREMIUM_PLAN ?? "";
export const stripeUltimatePlan =
  process.env.NEXT_PUBLIC_STRIPE_ULTIMATE_PLAN ?? process.env.PLASMO_PUBLIC_STRIPE_ULTIMATE_PLAN ?? "";

// Google
export const gtagId = process.env.NEXT_PUBLIC_GTAG_ID ?? process.env.PLASMO_PUBLIC_GTAG_ID ?? "";
