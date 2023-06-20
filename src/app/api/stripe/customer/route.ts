import { createHmac } from "crypto";
import type { Profile } from "~/lib/types";

import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { appwriteServerService } from "~/lib/clients/appwrite-server";
import { getStripeInstance } from "~/lib/clients/stripe-server";
import { appwriteUrl } from "~/lib/envClient";
import { appwriteWebhookKey } from "~/lib/envServer";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.json();
  const payload = `${appwriteUrl}/api/stripe/customer${JSON.stringify(body)}`;

  const signature = headers().get("X-Appwrite-Webhook-Signature");
  const token = createHmac("sha1", appwriteWebhookKey).update(payload).digest("base64");
  console.log("stripe.customer.signature:", signature);
  console.log("stripe.customer.token:", token);

  if (signature !== token) {
    console.log("stripe.customer:", "Webhook signature is invalid");
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
  const { sdkServerDatabases } = appwriteServerService();

  // Get user profile based on customerId
  const { documents: profiles } = await sdkServerDatabases.listDocuments<Profile>("main", "profile", body.$id);

  const singleProfile = profiles[0];

  console.log("-----------------------------------------------------------------------");
  console.log("singleProfile:", singleProfile);
  console.log("-----------------------------------------------------------------------");

  await sdkServerDatabases.updateDocument("main", "profile", body.$id, {
    stripeCustomerId: customer.id,
  });

  console.log("stripe.customer:", "OK");
  return NextResponse.json({ customerId: customer.id });
}
