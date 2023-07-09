// import type { AppwriteProfile } from "@/lib/types/types";

// import { headers } from "next/headers";
// import { NextResponse } from "next/server";
// import Stripe from "stripe";

// import { appwriteImpersonate } from "@/lib/clients/server-appwrite";
// import { getStripeInstance } from "@/lib/clients/server-stripe";
// import { corsHeaders } from "@/lib/helpers/cors";

// export const dynamic = "force-dynamic";

// export async function GET() {
//   // Read JWT from Authorization header
//   const authHeader = headers().get("Authorization");
//   const token = authHeader?.split(" ")[1];

//   if (!token) {
//     console.log("api.stripe.subscription:", "JWT token missing");
//     return new Response("JWT token missing", {
//       status: 400,
//       headers: corsHeaders,
//     });
//   }

//   // Get user profile based on JWT
//   const { impersonateDatabases } = appwriteImpersonate(token);
//   const { documents: profiles } = await impersonateDatabases.listDocuments<AppwriteProfile>("main", "profile");
//   const profile = profiles[0];

//   if (!profile) {
//     console.log("api.stripe.subscription:", "Get current profile failed");
//     return new Response("Get current profile failed", {
//       status: 404,
//       headers: corsHeaders,
//     });
//   }

//   const isSubscribed = profile.stripeCurrentPeriodEnd
//     ? profile.stripePriceId && new Date(profile.stripeCurrentPeriodEnd).getTime() > Date.now()
//     : false;

//   const stripe = getStripeInstance();

//   if (isSubscribed && profile.stripeCustomerId) {
//     try {
//       const upcoming = await stripe.invoices.retrieveUpcoming({
//         customer: profile.stripeCustomerId,
//       });

//       const upcomingPlan = upcoming.lines.data[0]?.plan;

//       return NextResponse.json(upcomingPlan, {
//         headers: corsHeaders,
//       });
//     } catch (error) {
//       if (error instanceof Stripe.errors.StripeInvalidRequestError) {
//         return NextResponse.json(error.code, {
//           headers: corsHeaders,
//           status: error.statusCode,
//         });
//       }

//       return NextResponse.json(error, {
//         headers: corsHeaders,
//         status: 500,
//       });
//     }
//   }

//   console.log("api.stripe.subscription.retrieve:", "Something went wrong");
//   return new Response("Something went wrong", {
//     status: 500,
//     headers: corsHeaders,
//   });
// }

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
          message: "Profile not found. Please sign out and try again.",
        },
        {
          status: 404, // Not Found
        },
      );
    }

    if (!profile.stripeCustomerId) {
      return NextResponse.json(
        {
          message: "You need to have a Stripe customer id. Please sign out and try again.",
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
          message: "Account does not have a subscription. Please sign out and try again.",
        },
        {
          status: 401, // Unauthorized
        },
      );
    }

    // 🔥 Get Stripe upcoming invoice
    const stripe = getStripeInstance();

    const upcoming = await stripe.invoices.retrieveUpcoming({
      customer: profile.stripeCustomerId,
    });
    const upcomingPlan = upcoming.lines.data[0]?.plan;

    if (!upcomingPlan) {
      return NextResponse.json(
        {
          message: "Account does not have an upcoming subscription plan. Please sign out and try again.",
        },
        {
          status: 404, // Not Found
        },
      );
    }

    // ✅ Everything OK
    return NextResponse.json({
      message: "Recommendations refilled successfully.",
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
        message: "Subscription retrieval issue on our end. Please try again later.",
      },
      {
        status: 500, // Internal Server Error
      },
    );
  }
}
