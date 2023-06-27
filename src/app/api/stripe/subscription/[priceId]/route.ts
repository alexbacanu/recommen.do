import type { AppwriteProfile } from "@/lib/types/types";

import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { appwriteImpersonate } from "@/lib/clients/server-appwrite";
import { getStripeInstance } from "@/lib/clients/server-stripe";
import { appwriteUrl } from "@/lib/envClient";

const corsHeaders = {
  // "Access-Control-Allow-Origin": "chrome-extension://cflbkohcinjdejhggkaejcgdkccdedan",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: { params: { priceId: string } }) {
  // Get priceId from slug
  const { priceId } = params;

  if (!priceId) {
    console.log("api.stripe.subscription:", "PriceID missing");
    return new Response("PriceID missing", {
      status: 400,
      headers: corsHeaders,
    });
  }

  // Read JWT from Authorization header
  const authHeader = headers().get("Authorization");
  const token = authHeader?.split(" ")[1];

  if (!token) {
    console.log("api.stripe.subscription:", "JWT token missing");
    return new Response("JWT token missing", {
      status: 400,
      headers: corsHeaders,
    });
  }

  // Get user profile based on JWT
  const { impersonateDatabases } = appwriteImpersonate(token);
  const { documents: profiles } = await impersonateDatabases.listDocuments<AppwriteProfile>("main", "profile");
  const profile = profiles[0];

  if (!profile) {
    console.log("api.stripe.subscription:", "Get current profile failed");
    return new Response("Get current profile failed", {
      status: 404,
      headers: corsHeaders,
    });
  }

  const isSubscribed = profile.stripeCurrentPeriodEnd
    ? profile.stripePriceId && new Date(profile.stripeCurrentPeriodEnd).getTime() > Date.now()
    : false;
  const stripe = getStripeInstance();

  // User is on paid plan
  if (isSubscribed && profile.stripeCustomerId) {
    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripeCustomerId,
      return_url: `${appwriteUrl}/profile`,
    });

    console.log("api.stripe.subscription:", "User is on paid plan");
    return NextResponse.json(
      { url: session.url },
      {
        headers: corsHeaders,
      },
    );
  }

  // User is on free plan
  // Create Stripe checkout session
  if (profile.stripeCustomerId) {
    const session = await stripe.checkout.sessions.create({
      customer: profile.stripeCustomerId,

      mode: "subscription",
      payment_method_types: ["card"],

      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],

      success_url: `${appwriteUrl}/payment/success`,
      cancel_url: `${appwriteUrl}/payment/cancel`,
    });

    console.log("api.stripe.subscription:", "OK");
    return NextResponse.json({ url: session.url }, { headers: corsHeaders });
  }

  console.log("api.stripe.subscription:", "Something went wrong");
  return new Response("Something went wrong", {
    status: 500,
    headers: corsHeaders,
  });
}
