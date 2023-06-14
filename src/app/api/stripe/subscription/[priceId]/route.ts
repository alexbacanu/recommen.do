import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { createAppwriteClient } from "~/lib/clients/appwrite-server";
import { getStripeInstance } from "~/lib/clients/stripe-server";
import { appwriteUrl } from "~/lib/envClient";

export async function GET(request: Request, { params }: { params: { priceId: string } }) {
  // Get priceId from slug
  const { priceId } = params;

  if (!priceId) {
    console.log("stripe.subscription:", "PriceID missing");
    return new Response("PriceID missing", {
      status: 400,
    });
  }

  // Read JWT from Authorization header
  const authHeader = headers().get("Authorization");
  const token = authHeader?.split(" ")[1];

  if (!token) {
    console.log("stripe.subscription:", "JWT token missing");
    return new Response("JWT token missing", {
      status: 400,
    });
  }

  // Get user profile based on JWT
  const { sdkDatabases } = createAppwriteClient(token);
  const { documents: profiles } = await sdkDatabases.listDocuments("main", "profile");
  const profile = profiles[0];

  if (!profile) {
    console.log("stripe.subscription:", "Profile missing");
    return new Response("Cannot find profile for this token", {
      status: 404,
    });
  }

  const isSubscribed = profile.stripePriceId && new Date(profile.stripeCurrentPeriodEnd).getTime() > Date.now();
  // console.log("isSubscribed:", isSubscribed);

  const stripe = getStripeInstance();

  // User is on paid plan
  if (isSubscribed && profile.stripeCustomerId) {
    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripeCustomerId,
      return_url: `${appwriteUrl}/profile`,
    });

    console.log("stripe.subscription:", "isSubscribed OK");
    return NextResponse.json(
      { url: session.url },
      {
        headers: {
          // "Access-Control-Allow-Origin": "chrome-extension://cflbkohcinjdejhggkaejcgdkccdedan",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      },
    );
  }

  // User is on free plan
  // Create Stripe checkout session
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

  console.log("stripe.subscription:", "OK");
  return NextResponse.json({ url: session.url });
}
