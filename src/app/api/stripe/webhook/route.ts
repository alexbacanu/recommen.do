import type { AppwriteProfile } from "@/lib/types/types";

import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { AppwriteException, Query } from "node-appwrite";
import Stripe from "stripe";

import { appwriteServer } from "@/lib/clients/server-appwrite";
import { getStripeInstance } from "@/lib/clients/server-stripe";
import { stripeWebhookKey } from "@/lib/envServer";
import { assignCredits } from "@/lib/helpers/assign-credits";

// export const runtime = "edge";
export const dynamic = "force-dynamic";

// 1. ❌ Auth
// 2. ✅ Permissions
// 3. ❌ Input
// 4. ➖ Secure
// 5. ➖ Rate limiting
export async function POST(request: Request) {
  let event: Stripe.Event;
  try {
    // 🫴 Get Body
    const requestText = await request.text();

    if (!requestText) {
      return NextResponse.json(
        {
          message: "Request body is required.",
        },
        {
          status: 404, // Not Found
        },
      );
    }

    // 🚦 Verify Signature
    const stripe = getStripeInstance();
    const signature = headers().get("Stripe-Signature");

    if (!signature) {
      return NextResponse.json(
        {
          message: "Signature is required.",
        },
        {
          status: 401, // Unauthorized
        },
      );
    }

    event = stripe.webhooks.constructEvent(requestText, signature, stripeWebhookKey);

    // 🚦 Check
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      if (session.mode === "payment" && session.payment_status === "paid") {
        const { serverDatabases } = appwriteServer();
        const { documents: profiles } = await serverDatabases.listDocuments<AppwriteProfile>("main", "profile", [
          Query.equal("stripeCustomerId", session.customer as string),
        ]);
        const profile = profiles[0];

        if (!profile) {
          return NextResponse.json(
            {
              message: "We couldn't find your profile. Please sign out and retry.",
            },
            {
              status: 404, // Not Found
            },
          );
        }

        // ☀️ Update Appwrite Profile
        await serverDatabases.updateDocument("main", "profile", profile.$id, {
          credits: profile.credits + 50,
        });
      }
    }

    // 🚦 Check
    if (event.type === "invoice.payment_succeeded") {
      const session = event.data.object as Stripe.Invoice;

      const { serverDatabases } = appwriteServer();
      const { documents: profiles } = await serverDatabases.listDocuments<AppwriteProfile>("main", "profile", [
        Query.equal("stripeCustomerId", session.customer as string),
      ]);
      const profile = profiles[0];

      if (!profile) {
        return NextResponse.json(
          {
            message: "We couldn't find your profile. Please sign out and retry.",
          },
          {
            status: 404, // Not Found
          },
        );
      }

      const sessionLines = session.lines.data[0];

      if (!sessionLines) {
        return NextResponse.json(
          {
            message: "We couldn't find your invoice session. Please sign out and retry.",
          },
          {
            status: 404, // Not Found
          },
        );
      }

      if (session.billing_reason === "subscription_create") {
        // ☀️ Update Appwrite Profile
        await serverDatabases.updateDocument("main", "profile", profile.$id, {
          credits: profile.credits + assignCredits(sessionLines.price?.id),

          stripeSubscriptionId: sessionLines.subscription,
          stripeSubscriptionName: sessionLines.plan?.metadata?.name,
          stripePriceId: sessionLines.price?.id,
          stripeCurrentPeriodEnd: new Date(sessionLines.period.end * 1000),
        });
      }

      if (session.billing_reason === "subscription_cycle") {
        // ☀️ Update Appwrite Profile
        await serverDatabases.updateDocument("main", "profile", profile.$id, {
          credits: assignCredits(sessionLines.price?.id),

          stripeSubscriptionId: sessionLines.subscription,
          stripeSubscriptionName: sessionLines.plan?.metadata?.name,
          stripePriceId: sessionLines.price?.id,
          stripeCurrentPeriodEnd: new Date(sessionLines.period.end * 1000),
        });
      }
    }

    // 🚦 Check
    if (event.type === "customer.subscription.created" || event.type === "customer.subscription.updated") {
      const session = event.data.object as Stripe.Subscription;

      const { serverDatabases } = appwriteServer();
      const { documents: profiles } = await serverDatabases.listDocuments<AppwriteProfile>("main", "profile", [
        Query.equal("stripeCustomerId", session.customer as string),
      ]);

      const profile = profiles[0];

      if (!profile) {
        return NextResponse.json(
          {
            message: "We couldn't find your profile. Please sign out and retry.",
          },
          {
            status: 404, // Not Found
          },
        );
      }

      const sessionItems = session.items.data[0];

      if (!sessionItems) {
        return NextResponse.json(
          {
            message: "We couldn't find your invoice session. Please sign out and retry.",
          },
          {
            status: 404, // Not Found
          },
        );
      }

      const sessionCreated = event.created;
      const statusLastUpdated = profile.stripeStatusLastUpdated
        ? new Date(profile.stripeStatusLastUpdated).getTime() / 1000
        : 0;

      // Webhooks don't come in a specific order, we only want to update the status if it's newer
      // TODO: it doesn't really work, if 2 come in the same second, statusLastUpdated will be the same (0)
      if (sessionCreated > statusLastUpdated) {
        // ☀️ Update Appwrite Profile
        await serverDatabases.updateDocument("main", "profile", profile.$id, {
          stripeStatus: "active",
          stripeStatusLastUpdated: new Date(event.created * 1000),
        });
      }
    }

    // 🚦 Check
    if (event.type === "customer.subscription.deleted") {
      const session = event.data.object as Stripe.Subscription;

      const { serverDatabases } = appwriteServer();
      const { documents: profiles } = await serverDatabases.listDocuments<AppwriteProfile>("main", "profile", [
        Query.equal("stripeCustomerId", session.customer as string),
      ]);
      const profile = profiles[0];

      if (!profile) {
        return NextResponse.json(
          {
            message: "We couldn't find your profile. Please sign out and retry.",
          },
          {
            status: 404, // Not Found
          },
        );
      }

      const sessionItems = session.items.data[0];

      if (!sessionItems) {
        return NextResponse.json(
          {
            message: "We couldn't find your invoice session. Please sign out and retry.",
          },
          {
            status: 404, // Not Found
          },
        );
      }

      const sessionCreated = event.created;
      const statusLastUpdated = profile.stripeStatusLastUpdated
        ? new Date(profile.stripeStatusLastUpdated).getTime() / 1000
        : 0;

      // Webhooks don't come in a specific order, we only want to update the status if it's newer
      // TODO: it doesn't really work, if 2 come in the same second, statusLastUpdated will be the same (0)
      if (sessionCreated > statusLastUpdated) {
        // ☀️ Update Appwrite Profile
        await serverDatabases.updateDocument("main", "profile", profile.$id, {
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

    // ✅ Everything OK
    return NextResponse.json({
      message: "Webhook processed successfully.",
    });
  } catch (error) {
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        {
          message: error.message,
        },
        {
          status: error.statusCode,
        },
      );
    }

    if (error instanceof AppwriteException) {
      return NextResponse.json(
        {
          message: error.message,
        },
        {
          status: error.code ? error.code : 500,
        },
      );
    }

    // ❌ Everything NOT OK
    console.log(error);
    return NextResponse.json(
      {
        message: "We're experiencing issues with processing your request. Please try again later.",
      },
      {
        status: 500, // Internal Server Error
      },
    );
  }
}
