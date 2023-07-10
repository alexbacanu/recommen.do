import type { AppwriteProfile } from "@/lib/types/types";

import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { AppwriteException } from "node-appwrite";
import Stripe from "stripe";

import { appwriteImpersonate } from "@/lib/clients/server-appwrite";
import { getStripeInstance } from "@/lib/clients/server-stripe";

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
          message: "We couldn't find your profile. Please log out and retry.",
        },
        {
          status: 404, // Not Found
        },
      );
    }

    if (!profile.stripeCustomerId) {
      return NextResponse.json(
        {
          message: "We couldn't find your Stripe customer id. Please log out and retry.",
        },
        {
          status: 404, // Not Found
        },
      );
    }

    // 🚦 Check for subscription
    const isSubscribed = profile.stripeCurrentPeriodEnd
      ? profile.stripePriceId && new Date(profile.stripeCurrentPeriodEnd).getTime() > Date.now()
      : false;

    if (!isSubscribed) {
      return NextResponse.json(
        {
          message: "We couldn't find your subscription. Please log out and retry.",
        },
        {
          status: 401, // Unauthorized
        },
      );
    }

    // 🫴 Get Stripe upcoming invoice
    const stripe = getStripeInstance();

    const upcoming = await stripe.invoices.retrieveUpcoming({
      customer: profile.stripeCustomerId,
    });
    const upcomingPlan = upcoming.lines.data[0]?.plan;

    if (!upcomingPlan) {
      return NextResponse.json(
        {
          message: "We couldn't find your upcoming subscription. Please log out and retry.",
        },
        {
          status: 404, // Not Found
        },
      );
    }

    // ✅ Everything OK
    return NextResponse.json({
      message: "Stripe subscription retrieved successfully.",
      plan: upcomingPlan,
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
        message: "We're experiencing issues with retrieving your subscription. Please try again later.",
      },
      {
        status: 500, // Internal Server Error
      },
    );
  }
}
