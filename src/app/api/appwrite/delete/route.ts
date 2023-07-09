import type { AppwriteProfile } from "@/lib/types/types";

import { AppwriteException } from "appwrite";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { AppwriteException as AppwriteExceptionNode } from "node-appwrite";
import Stripe from "stripe";

import { appwriteImpersonate, appwriteServer } from "@/lib/clients/server-appwrite";
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
          message: "JWT token missing. Please verify and retry.",
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
          message: "Account not found. Please verify your details.",
        },
        {
          status: 404, // Not Found
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
          message: "Profile not found. Please verify your details.",
        },
        {
          status: 404, // Not Found
        },
      );
    }

    // ➖ Delete Stripe Customer
    if (profile.stripeCustomerId) {
      const stripe = getStripeInstance();
      await stripe.customers.del(profile.stripeCustomerId);
    }

    // ➖ Delete Appwrite Profile
    const { serverDatabases } = appwriteServer();
    await serverDatabases.deleteDocument("main", "profile", profile.$id);

    // ➖ Delete Appwrite Account
    const { serverUsers } = appwriteServer();
    await serverUsers.delete(account.$id);

    // ✅ Everything OK
    return NextResponse.json({
      message: "Your account was deleted successfully.",
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
          status: error.code,
        },
      );
    }

    if (error instanceof AppwriteExceptionNode) {
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
        message: "Account deletion issues on our end. Please try again later.",
      },
      {
        status: 500, // Internal Server Error
      },
    );
  }
}
