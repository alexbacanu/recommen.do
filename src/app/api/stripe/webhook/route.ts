import type Stripe from "stripe";

import { Query } from "appwrite";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { createAppwriteClient } from "~/lib/clients/appwrite-server";
import { getStripeInstance } from "~/lib/clients/stripe-server";
import { stripeBasicPlan, stripePremiumPlan, stripeUltimatePlan, stripeWebhookKey } from "~/lib/envServer";

function checkPlan(plan: string) {
  const planMap: Record<string, number> = {
    [stripeBasicPlan]: 50,
    [stripePremiumPlan]: 200,
    [stripeUltimatePlan]: 600,
  };

  if (plan in planMap) {
    return planMap[plan];
  } else {
    return 0;
  }
}

export async function POST(request: Request) {
  // Read Signature from header
  const signature = headers().get("Stripe-Signature");

  if (!signature) {
    console.log("stripe.webhook:", "Signature missing");
    return new Response("Stripe Signature missing", {
      status: 400,
    });
  }

  // Get request as string
  const requestText = await request.text();

  // Construct event
  const stripe = getStripeInstance();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(requestText, signature, stripeWebhookKey);
  } catch (error) {
    console.log("stripe.webhook:", error);
    return new Response(`Webhook error: ${error}`, {
      status: 400,
    });
  }

  if (event.type === "customer.subscription.created") {
    const { sdkDatabases } = createAppwriteClient();
    const session = event.data.object;

    // Get user profile based on customerId
    const { documents: profiles } = await sdkDatabases.listDocuments("main", "profile", [
      Query.equal("stripeCustomerId", session.customer),
    ]);

    const singleProfile = profiles[0];

    if (!singleProfile) {
      return new Response(`No document found with customerId: ${session.customer}`, {
        status: 404,
      });
    }

    const date = new Date();
    console.log("newDate:", date);

    const currentPeriodEnd = new Date(session.current_period_end * 1000);
    console.log("currentPeriodEnd:", currentPeriodEnd);

    // Update profile from stripe event
    await sdkDatabases.updateDocument("main", "profile", singleProfile.$id, {
      stripeSubscriptionId: session.id,
      stripePriceId: session.plan.id,
      stripeCurrentPeriodEnd: currentPeriodEnd,
      credits: singleProfile.credits + checkPlan(session.plan.id),
    });
  }

  if (event.type === "customer.subscription.updated") {
    console.log("updated:event:", event);
    console.log("updated:event.data.object:", JSON.stringify(event.data.object));
  }

  if (event.type === "customer.subscription.deleted") {
    console.log("deleted:event:", event);
    console.log("deleted:event.data.object:", JSON.stringify(event.data.object));
  }

  return NextResponse.json({ status: "success" });
}
