import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { createAppwriteClient } from "~/lib/clients/appwrite-server";
import { getStripeInstance } from "~/lib/clients/stripe-server";
import { appwriteUrl } from "~/lib/envServer";

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

  if (!profiles[0]) {
    console.log("stripe.subscription:", "Profile missing");
    return new Response("Cannot find profile for this token", {
      status: 404,
    });
  }

  // Create Stripe checkout session
  const stripe = getStripeInstance();
  const session = await stripe.checkout.sessions.create({
    customer: profiles[0]?.stripeCustomerId,

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

  console.log(session.url);

  console.log("stripe.subscription:", "OK");
  return NextResponse.json({ url: session.url });
}
