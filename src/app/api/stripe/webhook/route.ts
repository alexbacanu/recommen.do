import type { AppwriteProfile } from "@/lib/types/types";
import type Stripe from "stripe";

import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Query } from "node-appwrite";

import { appwriteServer } from "@/lib/clients/server-appwrite";
import { getStripeInstance } from "@/lib/clients/server-stripe";
import { stripeWebhookKey } from "@/lib/envServer";
import { assignCredits } from "@/lib/helpers/assign-credits";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  // Read Signature from header
  const signature = headers().get("Stripe-Signature");

  if (!signature) {
    return NextResponse.json(
      { status: "Missing Stripe signature. The request could not be authenticated." },
      { status: 400 },
    );
  }

  // Get request as string
  const requestText = await request.text();

  // Construct event
  const stripe = getStripeInstance();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(requestText, signature, stripeWebhookKey);
  } catch (error) {
    return NextResponse.json(
      { status: "Error processing webhook. Please ensure the webhook data is valid.", error: JSON.stringify(error) },
      { status: 400 },
    );
  }

  console.log("webhook triggered");

  if (event.type === "checkout.session.completed") {
    console.log("checkout session is completed");
    const session = event.data.object as Stripe.Checkout.Session;

    if (session.mode === "payment" && session.payment_status === "paid") {
      console.log("user gets refill");
      const { serverDatabases } = appwriteServer();

      // Get user profile based on customerId
      const { documents: profiles } = await serverDatabases.listDocuments<AppwriteProfile>("main", "profile", [
        Query.equal("stripeCustomerId", session.customer as string),
      ]);

      const singleProfile = profiles[0];

      if (!singleProfile) {
        return NextResponse.json(
          {
            status: "User profile not found. Please ensure the customer information is correct.",
            customer: session.customer,
          },
          { status: 404 },
        );
      }

      console.log("current credits:", singleProfile.credits);
      console.log("new credits:", singleProfile.credits + 50);

      // Update profile from stripe event
      await serverDatabases.updateDocument("main", "profile", singleProfile.$id, {
        credits: singleProfile.credits + 50,
      });
    }
  }

  if (event.type === "invoice.payment_succeeded") {
    console.log("user has subscription created/renewed");
    const session = event.data.object as Stripe.Invoice;
    const { serverDatabases } = appwriteServer();

    // Get user profile based on customerId
    const { documents: profiles } = await serverDatabases.listDocuments<AppwriteProfile>("main", "profile", [
      Query.equal("stripeCustomerId", session.customer as string),
    ]);

    const singleProfile = profiles[0];

    if (!singleProfile) {
      return NextResponse.json(
        {
          status: "User profile not found. Please ensure the customer information is correct.",
          customer: session.customer,
        },
        { status: 404 },
      );
    }

    const sessionLines = session.lines.data[0];

    if (!sessionLines) {
      return NextResponse.json(
        { status: "Session object not found. Please ensure the session data is valid." },
        { status: 404 },
      );
    }

    if (session.billing_reason === "subscription_create") {
      console.log("user has subscription created");

      console.log("current credits:", singleProfile.credits);
      console.log("1.planid:", sessionLines.price?.id);
      console.log("2.assign credits:", assignCredits(sessionLines.price?.id));
      console.log("new credits:", singleProfile.credits + assignCredits(sessionLines.price?.id));

      // Update profile from stripe event
      await serverDatabases.updateDocument("main", "profile", singleProfile.$id, {
        credits: singleProfile.credits + assignCredits(sessionLines.price?.id),

        stripeSubscriptionId: sessionLines.subscription,
        stripeSubscriptionName: sessionLines.plan?.metadata?.name,
        stripePriceId: sessionLines.price?.id,
        stripeCurrentPeriodEnd: new Date(sessionLines.period.end * 1000),
      });
    }

    if (session.billing_reason === "subscription_cycle") {
      console.log("user has subscription renewed");

      console.log("current credits:", singleProfile.credits);
      console.log("1.planid:", sessionLines.price?.id);
      console.log("2.assign credits:", assignCredits(sessionLines.price?.id));
      console.log("new credits:", assignCredits(sessionLines.price?.id));
      // Update profile from stripe event
      await serverDatabases.updateDocument("main", "profile", singleProfile.$id, {
        credits: assignCredits(sessionLines.price?.id),

        stripeSubscriptionId: sessionLines.subscription,
        stripeSubscriptionName: sessionLines.plan?.metadata?.name,
        stripePriceId: sessionLines.price?.id,
        stripeCurrentPeriodEnd: new Date(sessionLines.period.end * 1000),
      });
    }
  }

  if (event.type === "customer.subscription.created" || event.type === "customer.subscription.updated") {
    const session = event.data.object as Stripe.Subscription;
    const { serverDatabases } = appwriteServer();

    // Get user profile based on customerId
    const { documents: profiles } = await serverDatabases.listDocuments<AppwriteProfile>("main", "profile", [
      Query.equal("stripeCustomerId", session.customer as string),
    ]);

    const singleProfile = profiles[0];

    if (!singleProfile) {
      return NextResponse.json(
        {
          status: "User profile not found. Please ensure the customer information is correct.",
          customer: session.customer,
        },
        { status: 404 },
      );
    }

    const sessionItems = session.items.data[0];

    if (!sessionItems) {
      return NextResponse.json(
        { status: "Session object not found. Please ensure the session data is valid." },
        { status: 404 },
      );
    }

    const sessionCreated = event.created;
    const statusLastUpdated = singleProfile.stripeStatusLastUpdated
      ? new Date(singleProfile.statusLastUpdated).getTime() / 1000
      : 0;

    // Webhooks don't come in a specific order, we only want to update the status if it's newer
    if (sessionCreated > statusLastUpdated) {
      // Update profile from stripe event
      await serverDatabases.updateDocument("main", "profile", singleProfile.$id, {
        stripeStatus: session.status,
        stripeStatusLastUpdated: new Date(event.created * 1000),
      });
    }
  }

  if (event.type === "customer.subscription.deleted") {
    console.log("user has subscription deleted");
    const session = event.data.object as Stripe.Subscription;
    const { serverDatabases } = appwriteServer();

    // Get user profile based on customerId
    const { documents: profiles } = await serverDatabases.listDocuments<AppwriteProfile>("main", "profile", [
      Query.equal("stripeCustomerId", session.customer as string),
    ]);

    const singleProfile = profiles[0];

    if (!singleProfile) {
      return NextResponse.json(
        {
          status: "User profile not found. Please ensure the customer information is correct.",
          customer: session.customer,
        },
        { status: 404 },
      );
    }

    const sessionItems = session.items.data[0];

    if (!sessionItems) {
      return NextResponse.json(
        { status: "Session object not found. Please ensure the session data is valid." },
        { status: 404 },
      );
    }

    const sessionCreated = event.created;
    const statusLastUpdated = singleProfile.stripeStatusLastUpdated
      ? new Date(singleProfile.stripeStatusLastUpdated).getTime() / 1000
      : 0;

    // Webhooks don't come in a specific order, we only want to update the status if it's newer
    if (sessionCreated > statusLastUpdated) {
      console.log("current credits:", singleProfile.credits);
      console.log("new credits: (should be 0, check)");

      // Update profile from stripe event
      await serverDatabases.updateDocument("main", "profile", singleProfile.$id, {
        credits: 0,

        stripeSubscriptionId: "none",
        stripeSubscriptionName: null,
        stripePriceId: null,
        stripeCurrentPeriodEnd: new Date(session.current_period_end * 1000),

        stripeStatus: session.status,
        stripeStatusLastUpdated: new Date(event.created * 1000),
      });
    }
  }

  return NextResponse.json({ status: "Webhook processed successfully" });
}
