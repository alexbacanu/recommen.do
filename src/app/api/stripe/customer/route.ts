import { createHmac } from "crypto";

import { headers } from "next/headers";

import { stripe } from "~/lib/clients/stripe";
import { appwriteWebhookKey, appwriteWebhookUrl } from "~/lib/envServer";

export async function POST(request: Request) {
  const body = await request.json();
  const payload = `${appwriteWebhookUrl}${JSON.stringify(body)}`;

  const signature = headers().get("X-Appwrite-Webhook-Signature");
  const token = createHmac("sha1", appwriteWebhookKey).update(payload).digest("base64");

  if (signature !== token) {
    return new Response("Webhook signature is invalid", {
      status: 401,
    });
  }

  const customer = await stripe.customers.create({
    email: body.email,
    name: body.name,
  });

  return new Response(`Customer created: ${customer.id}`, {
    status: 200,
  });
}
