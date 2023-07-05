import type { AppwriteProfile } from "@/lib/types/types";

import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

import { appwriteImpersonate } from "@/lib/clients/server-appwrite";
import { getStripeInstance } from "@/lib/clients/server-stripe";

const corsHeaders = {
  // "Access-Control-Allow-Origin": "chrome-extension://cflbkohcinjdejhggkaejcgdkccdedan",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export const dynamic = "force-dynamic";

export async function GET() {
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

  if (isSubscribed && profile.stripeCustomerId) {
    try {
      const upcoming = await stripe.invoices.retrieveUpcoming({
        customer: profile.stripeCustomerId,
      });

      const upcomingPlan = upcoming.lines.data[0]?.plan;

      return NextResponse.json(upcomingPlan, {
        headers: corsHeaders,
      });
    } catch (error) {
      if (error instanceof Stripe.errors.StripeInvalidRequestError) {
        return NextResponse.json(error.code, {
          headers: corsHeaders,
          status: error.statusCode,
        });
      }

      return NextResponse.json(error, {
        headers: corsHeaders,
        status: 500,
      });
    }
  }

  console.log("api.stripe.subscription.retrieve:", "Something went wrong");
  return new Response("Something went wrong", {
    status: 500,
    headers: corsHeaders,
  });
}
