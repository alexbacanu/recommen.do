import type { AppwriteProfile } from "@/lib/types/types";

import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { appwriteImpersonate } from "@/lib/clients/server-appwrite";
import { getStripeInstance } from "@/lib/clients/server-stripe";
import { appwriteUrl } from "@/lib/envClient";
import { corsHeaders } from "@/lib/helpers/cors";

export const dynamic = "force-dynamic";

export async function GET() {
  // Read JWT from Authorization header
  const authHeader = headers().get("Authorization");
  const token = authHeader?.split(" ")[1];

  if (!token) {
    console.log("api.stripe.refill:", "JWT token missing");
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
    console.log("api.stripe.refill:", "Get current profile failed");
    return new Response("Get current profile failed", {
      status: 404,
      headers: corsHeaders,
    });
  }

  if (profile.credits >= 950) {
    console.log("api.stripe.refill:", "You have reached your refill limit (max 999 credits)");
    return new Response("You have reached your refill limit (max 999 credits)", {
      status: 400,
      headers: corsHeaders,
    });
  }

  if (profile.stripeCustomerId) {
    const stripe = getStripeInstance();

    // User needs refill
    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer: profile.stripeCustomerId,

      mode: "payment",
      payment_method_types: ["card"],

      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: 200,
            product_data: {
              name: "Add 50 recommendations",
              description: `These recommendations will expire on: ${
                profile.stripeCurrentPeriodEnd && new Date(profile.stripeCurrentPeriodEnd).toUTCString()
              }, at the end of your current billing cycle.`,
              images: [
                "https://cloud.appwrite.io/v1/storage/buckets/images/files/refill/view?project=6491ab878b30a8638965",
              ],
            },
          },
        },
      ],

      success_url: `${appwriteUrl}/payment/success`,
      cancel_url: `${appwriteUrl}/payment/cancel`,
    });

    console.log("api.stripe.refill:", "URL Created");
    return NextResponse.json({ url: session.url }, { headers: corsHeaders });
  }

  console.log("api.stripe.refill:", "Something went wrong");
  return new Response("Something went wrong", {
    status: 500,
    headers: corsHeaders,
  });
}
