import { createHmac } from "crypto";

import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { appwriteServer } from "@/lib/clients/server-appwrite";
import { getStripeInstance } from "@/lib/clients/server-stripe";
import { appwriteUrl } from "@/lib/envClient";
import { appwriteWebhookKey } from "@/lib/envServer";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.json();
  const payload = `${appwriteUrl}/api/stripe/customer${JSON.stringify(body)}`;

  const signature = headers().get("X-Appwrite-Webhook-Signature");
  const token = createHmac("sha1", appwriteWebhookKey).update(payload).digest("base64");

  if (signature !== token) {
    console.log("api.stripe.customer:", "Webhook signature is invalid");
    return new Response("Webhook signature is invalid", {
      status: 401,
    });
  }

  // Create a new customer in stripe
  const stripe = getStripeInstance();
  const customer = await stripe.customers.create({
    email: body.email,
    name: body.name,
  });

  // Update the newly created customer in appwrite
  const { serverDatabases } = appwriteServer();

  await serverDatabases.updateDocument("main", "profile", body.$id, {
    stripeCustomerId: customer.id,
  });

  console.log("api.stripe.customer:", "OK");
  return NextResponse.json({ customerId: customer.id });
}
