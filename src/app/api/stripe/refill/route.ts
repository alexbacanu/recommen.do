import type { AppwriteProfile } from "@/lib/types/types";

import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { AppwriteException } from "node-appwrite";
import Stripe from "stripe";

import { appwriteImpersonate } from "@/lib/clients/server-appwrite";
import { getStripeInstance } from "@/lib/clients/server-stripe";
import { appwriteUrl } from "@/lib/envClient";

// export const runtime = "edge";
export const dynamic = "force-dynamic";

// 1. ✅ Auth
// 2. ❌ Permissions
// 3. ❌ Input
// 4. ➖ Secure
// 5. ➖ Rate limiting
export async function GET() {
  try {
    // 🫴 Get Authorization
    const authHeader = headers().get("Authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return NextResponse.json(
        {
          message: "The JWT token is missing. Please check and try again.",
        },
        {
          status: 401, // Unauthorized
        },
      );
    }

    // 🫴 Get Account
    const { impersonateAccount } = appwriteImpersonate(token);
    const account = await impersonateAccount.get();

    if (!account) {
      return NextResponse.json(
        {
          message: "We couldn't find your account. Please check your details and try again.",
        },
        {
          status: 404, // Not Found
        },
      );
    }

    if (!account.emailVerification) {
      return NextResponse.json(
        {
          message: "Your email is not verified. Please verify your email and try again.",
        },
        {
          status: 401, // Not Found
        },
      );
    }

    // 🫴 Get Profile
    const { impersonateDatabases } = appwriteImpersonate(token);
    const { documents: profiles } = await impersonateDatabases.listDocuments<AppwriteProfile>("main", "profile");
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

    if (!profile.stripeCustomerId) {
      return NextResponse.json(
        {
          message: "We couldn't find your Stripe customer id. Please sign out and retry.",
        },
        {
          status: 404, // Not Found
        },
      );
    }

    if (profile.credits >= 950) {
      return NextResponse.json(
        {
          message: "You have reached the maximum limit of recommendations (950 credits).",
        },
        {
          status: 429, // Unauthorized
        },
      );
    }

    // 🔥 Create Stripe checkout session
    const stripe = getStripeInstance();
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
                profile.stripeCurrentPeriodEnd
                  ? new Date(profile.stripeCurrentPeriodEnd).toUTCString() // when subscription expires
                  : new Date(new Date().setDate(new Date().getDate() + 30)).toUTCString() // 30 days from now on
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

    // ✅ Everything OK
    return NextResponse.json({
      message: "Stripe checkout session created successfully.",
      url: session.url,
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
        message: "We're experiencing issues with refilling your recommendations. Please try again later.",
      },
      {
        status: 500, // Internal Server Error
      },
    );
  }
}
