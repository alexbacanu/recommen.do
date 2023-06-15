import type { Profile } from "~/lib/types";
import type Stripe from "stripe";

import { Query } from "appwrite";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { appwriteServerService } from "~/lib/clients/appwrite-server";
import { getStripeInstance } from "~/lib/clients/stripe-server";
import { stripeWebhookKey } from "~/lib/envServer";
import { assignCredits } from "~/lib/helpers/assignCredits";

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

  if (event.type === "checkout.session.completed") {
    const { sdkServerDatabases } = appwriteServerService();
    const session = event.data.object as Stripe.Checkout.Session;

    // Get user profile based on customerId
    const { documents: profiles } = await sdkServerDatabases.listDocuments<Profile>("main", "profile", [
      Query.equal("stripeCustomerId", session.customer as string),
    ]);

    const singleProfile = profiles[0];

    if (!singleProfile) {
      return new Response(`No document found with customerId: ${session.customer}`, {
        status: 404,
      });
    }

    const paymentStatus = session.payment_status;

    if (paymentStatus !== "paid") {
      return new Response(`Payment status not paid`, {
        status: 404,
      });
    }

    // Update profile from stripe event
    await sdkServerDatabases.updateDocument("main", "profile", singleProfile.$id, {
      credits: singleProfile.credits + 50,
    });
  }

  if (event.type === "invoice.payment_succeeded") {
    const { sdkServerDatabases } = appwriteServerService();
    const session = event.data.object as Stripe.Invoice;

    // Get user profile based on customerId
    const { documents: profiles } = await sdkServerDatabases.listDocuments<Profile>("main", "profile", [
      Query.equal("stripeCustomerId", session.customer as string),
    ]);

    const singleProfile = profiles[0];

    if (!singleProfile) {
      return new Response(`No document found with customerId: ${session.customer}`, {
        status: 404,
      });
    }

    const sessionLines = session.lines.data[0];

    if (!sessionLines) {
      return new Response(`No session object found`, {
        status: 404,
      });
    }

    if (session.billing_reason === "subscription_create") {
      // Update profile from stripe event
      await sdkServerDatabases.updateDocument("main", "profile", singleProfile.$id, {
        stripeSubscriptionId: sessionLines.subscription,
        stripeSubscriptionName: sessionLines.plan?.metadata?.name,
        stripePriceId: sessionLines.price?.id,

        credits: singleProfile.credits + assignCredits(sessionLines.price?.id),
        stripeCurrentPeriodEnd: new Date(sessionLines.period.end * 1000),
      });
    }
  }

  if (event.type === "customer.subscription.created") {
    const { sdkServerDatabases } = appwriteServerService();
    const session = event.data.object as Stripe.Subscription;

    // Get user profile based on customerId
    const { documents: profiles } = await sdkServerDatabases.listDocuments<Profile>("main", "profile", [
      Query.equal("stripeCustomerId", session.customer as string),
    ]);

    const singleProfile = profiles[0];

    if (!singleProfile) {
      return new Response(`No document found with customerId: ${session.customer}`, {
        status: 404,
      });
    }

    const sessionItems = session.items.data[0];

    if (!sessionItems) {
      return new Response(`No session object found`, {
        status: 404,
      });
    }

    const sessionCreated = event.created;
    const statusLastUpdated = new Date(singleProfile.statusLastUpdated).getTime() / 1000;

    // Webhooks don't come in a specific order, we only want to update the status if it's newer
    if (sessionCreated > statusLastUpdated && singleProfile.status !== session.status) {
      // Update profile from stripe event
      await sdkServerDatabases.updateDocument("main", "profile", singleProfile.$id, {
        stripeStatus: session.status,
        stripeStatusLastUpdated: new Date(event.created * 1000),
      });
    }
  }

  if (event.type === "customer.subscription.updated") {
    const { sdkServerDatabases } = appwriteServerService();
    const session = event.data.object as Stripe.Subscription;

    // Get user profile based on customerId
    const { documents: profiles } = await sdkServerDatabases.listDocuments<Profile>("main", "profile", [
      Query.equal("stripeCustomerId", session.customer as string),
    ]);

    const singleProfile = profiles[0];

    if (!singleProfile) {
      return new Response(`No document found with customerId: ${session.customer}`, {
        status: 404,
      });
    }

    const sessionItems = session.items.data[0];

    if (!sessionItems) {
      return new Response(`No session object found`, {
        status: 404,
      });
    }

    const currentPeriodEnd = session.current_period_end;
    const databaseCurrentPeriodEnd = new Date(singleProfile.stripeCurrentPeriodEnd).getTime() / 1000;

    if (currentPeriodEnd > databaseCurrentPeriodEnd) {
      // Update profile from stripe event
      await sdkServerDatabases.updateDocument("main", "profile", singleProfile.$id, {
        stripeSubscriptionId: session.id,
        stripePriceId: sessionItems.price.id,

        credits: assignCredits(sessionItems.price.id),
        stripeCurrentPeriodEnd: new Date(currentPeriodEnd * 1000),
      });
    }

    const sessionCreated = event.created;
    const statusLastUpdated = new Date(singleProfile.statusLastUpdated).getTime() / 1000;

    // Webhooks don't come in a specific order, we only want to update the status if it's newer
    if (sessionCreated > statusLastUpdated && singleProfile.status !== session.status) {
      // Update profile from stripe event
      await sdkServerDatabases.updateDocument("main", "profile", singleProfile.$id, {
        stripeStatus: session.status,
        stripeStatusLastUpdated: new Date(event.created * 1000),
      });
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const { sdkServerDatabases } = appwriteServerService();
    const session = event.data.object as Stripe.Subscription;

    // Get user profile based on customerId
    const { documents: profiles } = await sdkServerDatabases.listDocuments<Profile>("main", "profile", [
      Query.equal("stripeCustomerId", session.customer as string),
    ]);

    const singleProfile = profiles[0];

    if (!singleProfile) {
      return new Response(`No document found with customerId: ${session.customer}`, {
        status: 404,
      });
    }

    const sessionItems = session.items.data[0];

    if (!sessionItems) {
      return new Response(`No session object found`, {
        status: 404,
      });
    }

    const sessionCreated = event.created;
    const statusLastUpdated = new Date(singleProfile.statusLastUpdated).getTime() / 1000;

    // Webhooks don't come in a specific order, we only want to update the status if it's newer
    if (sessionCreated > statusLastUpdated && singleProfile.status !== session.status) {
      // Update profile from stripe event
      await sdkServerDatabases.updateDocument("main", "profile", singleProfile.$id, {
        stripeStatus: session.status,
        stripeStatusLastUpdated: new Date(event.created * 1000),

        credits: 0,
        stripeCurrentPeriodEnd: new Date(session.current_period_end * 1000),
      });
    }
  }

  return NextResponse.json({ status: "success" });
}
